import React, { useState } from 'react'
import Layout from '@theme/Layout'
import { ethers } from 'ethers'
import { isValidMessageSignature, validateEIP6492Offchain } from 'ethsigning'
import {
  SigningKey,
  concat,
  hexlify,
  keccak256,
  splitSignature,
  toUtf8Bytes
} from 'ethers/lib/utils'

const networks = [
  { name: 'Polygon', nodePath: 'polygon' },
  { name: 'Ethereum', nodePath: 'mainnet' }
]

export default function Debugger() {
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')
  const [signature, setSignature] = useState('')
  const [network, setNetwork] = useState('polygon')

  // We need the network picker only if signer address is a smart contract wallet
  const [displayNetworkPicker, setDisplayNetworkPicker] = useState(false)

  const checkWalletType = () => {}

  return (
    <Layout title="Signature debugger" description="">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          marginTop: '20px',
          textAlign: 'center'
        }}>
        <h2>Signature Validation Debugger</h2>
        <p>Enter signer address, message and signature to debug.</p>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '1200px',
            minWidth: '360px',
            justifyContent: 'start',
            alignItems: 'center',
            fontSize: '20px',
            padding: '20px'
          }}>
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h3>Signer address:</h3>
              <input
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="0x..."
                style={{ padding: '10px', width: '90%' }}
                name="signerAddress"
              />
              <h3 style={{ marginTop: '10px' }}>Message:</h3>
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder=""
                style={{ padding: '10px', width: '90%' }}
                name="message"
              />
              <h3 style={{ marginTop: '10px' }}>Signature:</h3>
              <input
                value={signature}
                onChange={e => setSignature(e.target.value)}
                placeholder=""
                style={{ padding: '10px', width: '90%' }}
                name="signature"
              />
              <h3 style={{ marginTop: '10px' }}>Network:</h3>
              <select
                value={network}
                onChange={e => {
                  setNetwork(e.target.value)
                  checkWalletType()
                }}>
                {networks.map(network => (
                  <option key={network.name} value={network.nodePath}>
                    {network.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <button
              onClick={() => {
                if (!ethers.utils.isAddress(address) || message === '' || signature === '') {
                  return
                }

                debug(address, message, signature, 'polygon')
              }}>
              Debug
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

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

// For invalid sig, check for cases (to see if it actually matches this way):
// 1. prefixEIP191Message missing
// 2. digest hashed as string instead of bytes

// If above are not helpful, then check address (if smart contract or EOA) and
// give suggestion on how to sign it correctly

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
