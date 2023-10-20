import '@0xsequence/design-system/styles.css'

import React, { useEffect, useState } from 'react'
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

import {
  Box,
  Button,
  CheckmarkIcon,
  Select,
  Spinner,
  Text,
  TextArea,
  TextInput,
  ThemeProvider,
  WarningIcon
} from '@0xsequence/design-system'
import BrowserOnly from '@docusaurus/BrowserOnly'
import Layout from '@theme/Layout'

const networks = [
  { name: 'Polygon', nodePath: 'polygon' },
  { name: 'Ethereum', nodePath: 'mainnet' }
]

interface Result {
  isValid: boolean
  error?: string
}

export default function Debugger() {
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')
  const [signature, setSignature] = useState('')
  const [network, setNetwork] = useState('polygon')

  const [displayNetworkPicker, setDisplayNetworkPicker] = useState(false)

  const [isDebugPending, setIsDebugPending] = useState(false)

  const [result, setResult] = useState<Result | undefined>()

  const checkWalletType = () => {}

  const runDebug = async () => {
    setResult(undefined)
    setIsDebugPending(true)
    try {
      const result = await debug(address, message, signature, network)
      setResult({ isValid: result })
    } catch (error) {
      setResult({ isValid: false, error })
    }
    setIsDebugPending(false)
  }

  useEffect(() => {
    setResult(undefined)
  }, [address, message, signature, network])

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
                      <Box
                        style={{ minHeight: '44px' }}
                        marginTop="12"
                        alignItems="center"
                        justifyContent="center">
                        {isDebugPending ? (
                          <Spinner />
                        ) : (
                          <Button
                            marginBottom="8"
                            label="Debug"
                            onClick={() => {
                              if (
                                !ethers.utils.isAddress(address) ||
                                message === '' ||
                                signature === ''
                              ) {
                                return
                              }

                              runDebug()
                            }}></Button>
                        )}
                      </Box>

                      {result && (
                        <Box
                          width="auto"
                          background={result.isValid ? 'gradientPrimary' : 'backgroundMuted'}
                          borderColor={result.isValid ? 'positive' : 'negative'}
                          borderWidth="thick"
                          borderStyle="solid"
                          borderRadius="md"
                          paddingX="6"
                          paddingY="4">
                          {result.isValid && (
                            <Box alignItems="center">
                              <Box
                                width="8"
                                height="8"
                                minWidth="8"
                                background="positive"
                                alignItems="center"
                                justifyContent="center"
                                borderRadius="circle"
                                marginRight="2">
                                <CheckmarkIcon color="white" />
                              </Box>
                              <Text variant="medium">Signature is valid!</Text>
                            </Box>
                          )}
                          {!result.isValid && (
                            <Box alignItems="center">
                              <Box
                                width="8"
                                height="8"
                                minWidth="8"
                                background="warning"
                                alignItems="center"
                                justifyContent="center"
                                borderRadius="circle"
                                marginRight="2">
                                <WarningIcon color="negative" />
                              </Box>
                              <Box>
                                {result.error ? (
                                  <Text style={{ overflowWrap: 'anywhere' }} variant="medium">
                                    {String(result.error)}
                                  </Text>
                                ) : (
                                  <Text variant="medium">Signature is not valid.</Text>
                                )}
                              </Box>
                            </Box>
                          )}
                        </Box>
                      )}
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
    return true
  }

  if (await checkScenario_NotPrefixedHash(address, message, signature, network)) {
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