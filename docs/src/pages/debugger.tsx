import '@0xsequence/design-system/styles.css'

import { ethers } from 'ethers'
import {
  concat,
  hexlify,
  keccak256,
  SigningKey,
  splitSignature,
  toUtf8Bytes
} from 'ethers/lib/utils'
import { isValidMessageSignature, validateEIP6492Offchain } from 'ethsigning'
import React, { useState } from 'react'

import {
  Box,
  Button,
  Select,
  Text,
  TextArea,
  TextInput,
  ThemeProvider
} from '@0xsequence/design-system'
import BrowserOnly from '@docusaurus/BrowserOnly'
import Layout from '@theme/Layout'

const networks = [
  { name: 'Polygon', nodePath: 'polygon' },
  { name: 'Ethereum', nodePath: 'mainnet' }
]

export default function Debugger() {
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')
  const [signature, setSignature] = useState('')
  const [network, setNetwork] = useState('polygon')

  const [displayNetworkPicker, setDisplayNetworkPicker] = useState(false)

  const checkWalletType = () => {}

  return (
    <BrowserOnly>
      {() => {
        return (
          <Layout title="Signature debugger" description="">
            <ThemeProvider>
              <Box className="container debugger-container">
                <Box marginTop="16">
                  <Box
                    alignItems="center"
                    flexDirection="column"
                    textAlign="center"
                    marginBottom="16">
                    <Text variant="xlarge" marginBottom="4">
                      Signature Debugger
                    </Text>
                    <Text variant="normal">
                      Enter signer address, message and signature to validate/debug. The tool will
                      check possible issues if signature is not valid and try to give you direction
                      that can help you resolve the issue.
                    </Text>
                    <Text variant="normal" marginTop="4" color="positive">
                      Supports both EOA and smart contract wallet signatures.
                    </Text>
                  </Box>
                  <Box justifyContent="center">
                    <Box
                      width="full"
                      flexDirection="column"
                      justifyContent="flex-start"
                      fontSize="medium">
                      <Box width="full">
                        <Box flexDirection="column">
                          <Text variant="medium" marginBottom="2">
                            Signer address:
                          </Text>
                          <TextInput
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            placeholder="0x..."
                            name="signerAddress"
                          />
                          <Text variant="medium" marginTop="6" marginBottom="2">
                            Message:
                          </Text>
                          <TextArea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder=""
                            name="message"
                          />
                          <Text variant="medium" marginTop="6" marginBottom="2">
                            Signature:
                          </Text>
                          <TextArea
                            value={signature}
                            onChange={e => setSignature(e.target.value)}
                            placeholder=""
                            name="signature"
                          />
                          <Text variant="medium" marginTop="6" marginBottom="2">
                            Network:
                          </Text>
                          <Select
                            name="network"
                            labelLocation="top"
                            onValueChange={val => {
                              setNetwork(val)
                              checkWalletType()
                            }}
                            value={network}
                            options={[
                              ...networks.map(n => ({
                                label: (
                                  <Box alignItems="center" gap="2">
                                    <Text>{n.name}</Text>
                                  </Box>
                                ),
                                value: n.nodePath
                              }))
                            ]}
                          />
                        </Box>
                      </Box>
                      <Box marginTop="12" alignItems="center" justifyContent="center">
                        <Button
                          label="Debug"
                          onClick={() => {
                            if (
                              !ethers.utils.isAddress(address) ||
                              message === '' ||
                              signature === ''
                            ) {
                              return
                            }

                            debug(address, message, signature, network)
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </ThemeProvider>
          </Layout>
        )
      }}
    </BrowserOnly>
  )
}

// For invalid sig, check for cases (to see if it actually matches this way):
// 1. prefixEIP191Message missing
// 2. digest hashed as string instead of bytes

// If above are not helpful, then check address (if smart contract or EOA) and
// give suggestion on how to sign it correctly

const debug = async (address: string, message: string, signature: string, network: string) => {
  const provider = providerForNetwork(network)
  const isValid = await isValidMessageSignature(address, message, signature, provider)

  if (isValid) {
    console.log('Signature is valid!')
    return
  }

  if (checkScenario_NotPrefixedHash) {
    console.log('not prefixed hash')
  }
}

const providerForNetwork = (network: string) => {
  return new ethers.providers.JsonRpcProvider(`https://nodes.sequence.app/${network}`)
}

const MessagePrefix: string = '\x19Ethereum Signed Message:\n'

const joinSignature = (signature: ethers.Signature): string => {
  signature = splitSignature(signature)

  return hexlify(concat([signature.r, signature.s, signature.recoveryParam ? '0x1c' : '0x1b']))
}

const checkScenario_NotPrefixedHash = (
  address: string,
  message: string,
  signature: string,
  network: string
) => {
  const provider = providerForNetwork(network)
  const notPrefixedHash = keccak256(toUtf8Bytes(message))
  return validateEIP6492Offchain(provider, address, notPrefixedHash, signature)
}

// Dump test data:
;(async () => {
  const testPrivKey = '0x465d0d758d8c7664d9e1bfa46fb5fb8e27265cb4bc28c0f7752d596910545028'
  const testSigningKey = new SigningKey(testPrivKey)
  const testEthersWallet = new ethers.Wallet(testPrivKey)
  const testMessage = 'Test Test Test'
  const testMessageValidSig = await testEthersWallet.signMessage(testMessage)
  const testMessageInvaliSig_notPrefixed = joinSignature(
    testSigningKey.signDigest(keccak256(toUtf8Bytes(testMessage)))
  )

  console.log('testWalletAddr:', testEthersWallet.address)
  console.log('testMessage:', testMessage)
  console.log('testMessageValidSig:', testMessageValidSig)
  console.log('testMessageInvalidSig_notPrefixed:', testMessageInvaliSig_notPrefixed)
})()
