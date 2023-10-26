import { useState } from 'react'
import { Box, Button, Image, Text, TextArea } from '@0xsequence/design-system'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useNavigate } from 'react-router-dom'
import { isValidMessageSignature } from 'ethsigning'

import logoUrl from './assets/logo.png'
import { ethers } from 'ethers'

export default function Guide() {
  const navigate = useNavigate()

  // Code Snippet - create wallet
  const [pk, setPk] = useState<string | undefined>()
  const [address, setAddress] = useState<string | undefined>(undefined)

  const codeSnippet_createWallet = `import { ethers } from 'ethers'
import { isValidMessageSignature } from 'ethsigning'
  
const wallet = ethers.Wallet.createRandom()
  
console.log('Your address:', wallet.address)
// Your address: ${address ?? 'Log will appear here once you run the snippet!'}`

  const run_codeSnippet_createWallet = async () => {
    const wallet = ethers.Wallet.createRandom()
    setPk(wallet.privateKey)
    setAddress(wallet.address)
  }

  // Code Snippet - enter and sign message
  const [messageToSign, setMessageToSign] = useState<string | undefined>()
  const [signature, setSignature] = useState<string | undefined>(undefined)

  const codeSnippet_SignMessage = `${messageToSign ? '' : '// '}const message = ${
    messageToSign
      ? `'` + messageToSign + `'`
      : `You didn't set a message yet, add it to input on left.`
  }

const signature = await wallet.signMessage(message)

console.log('Signature:', signature)
// Signature: ${signature ?? 'Log will appear here once you run the snippet!'}`

  const run_codeSnippet_signMessage = async () => {
    if (!pk || !messageToSign) {
      return
    }
    const wallet = new ethers.Wallet(pk)
    const sig = await wallet.signMessage(messageToSign)
    setSignature(sig)
  }

  // Code Snippet - validate message
  const provider = new ethers.providers.JsonRpcProvider('https://nodes.sequence.app/mainnet')
  const [isValidSig, setIsValidSig] = useState<boolean | undefined>()

  const codeSnippet_validateSignature = `const provider = new ethers.providers.JsonRpcProvider('https://nodes.sequence.app/mainnet')
const isValid = await isValidMessageSignature(wallet.address, message, signature, provider)

console.log('isValid:', isValid)
// isValid: ${isValidSig ?? 'Log will appear here once you run the snippet!'}`

  const run_codeSnippet_validateSignature = async () => {
    if (!pk || !messageToSign || !signature) {
      return
    }
    const wallet = new ethers.Wallet(pk)
    const isValid = await isValidMessageSignature(
      wallet.address,
      messageToSign,
      signature,
      provider
    )
    setIsValidSig(isValid)
  }

  return (
    <Box className="container" paddingBottom="16">
      <Box alignItems="center" marginBottom="16">
        <Image
          style={{ width: '60px', height: '60px' }}
          src={logoUrl}
          borderRadius="md"
          marginRight="4"
        />
        <Text className="logo-title" fontSize="large" fontWeight="bold">
          ethsigning.guide
        </Text>

        <Text
          onClick={() => {
            navigate('/debugger')
          }}
          cursor="pointer"
          className="underline-text"
          marginLeft="auto">
          Signature Debugger
        </Text>
      </Box>

      <Box paddingY="16" textAlign="center" fontSize="xlarge" fontWeight="normal">
        <Text
          as="a"
          href="https://github.com/0xsequence/ethsigning"
          target="_blank"
          rel="noreferrer"
          className="underline-text">
          A library to make signature validation easier
        </Text>
        <Text
          fontSize="large"
          color="text100"
          style={{
            fontStyle: 'italic',
            display: 'block',
            marginTop: '20px',
            marginBottom: '10px'
          }}>
          +
        </Text>
        <Text>
          An interactive guide on Ethereum signatures{' '}
          <Text
            fontSize="xlarge"
            marginLeft="2"
            style={{ position: 'relative', top: '4px' }}
            className="text-gradient-clip">
            ⤵
          </Text>
        </Text>
      </Box>

      <Box marginTop="10" flexDirection="column">
        <Text fontSize="xlarge" fontWeight="semibold">
          What are signatures?
        </Text>

        <Text marginTop="4" lineHeight="6">
          In Ethereum, a signature is a cryptographic proof used to verify the identity of the
          sender and ensure that a message or transaction remains unchanged during transit, which is
          fundamental for the secure operation of the network. <br />
          In the following sections, we'll walk through each step of signature creation and
          validation interactively using popular front-end libraries. We will use{' '}
          <Text
            as="a"
            className="underline-text"
            href="https://github.com/ethers-io/ethers.js"
            target="_blank"
            rel="noreferrer">
            ethers.js
          </Text>{' '}
          for{' '}
          <Text
            as="a"
            className="underline-text"
            href="https://ethereum.org/en/whitepaper/#ethereum-accounts"
            target="_blank"
            rel="noreferrer">
            EOA
          </Text>{' '}
          example and{' '}
          <Text
            as="a"
            className="underline-text"
            href="https://github.com/0xsequence/sequence.js"
            target="_blank"
            rel="noreferrer">
            Sequence
          </Text>{' '}
          for smart contract wallet example, and then validate the messages using{' '}
          <Text
            as="a"
            className="underline-text"
            href="https://github.com/0xsequence/ethsigning"
            target="_blank"
            rel="noreferrer">
            ethsigning
          </Text>{' '}
          validation helper library. <br />
          We will also touch on some of{' '}
          <Text
            as="a"
            className="underline-text"
            href="https://eips.ethereum.org/"
            target="_blank"
            rel="noreferrer">
            EIPs
          </Text>{' '}
          related to signing messages like EIP-191, EIP-1271, and EIP-6492. For a ground-zero
          understanding and the math behind signatures, you can refer to this{' '}
          <Text
            as="a"
            className="underline-text"
            href="https://medium.com/mycrypto/the-magic-of-digital-signatures-on-ethereum-98fe184dc9c7"
            target="_blank"
            rel="noreferrer">
            article by MyCrypto
          </Text>{' '}
          and this{' '}
          <Text
            as="a"
            className="underline-text"
            href="https://medium.com/coinmonks/ethereum-signatures-for-hackers-and-auditors-101-4da766cd6344"
            target="_blank"
            rel="noreferrer">
            article by Coinmonks
          </Text>
          .
        </Text>
      </Box>

      <Box marginTop="10" flexDirection="column">
        <Text fontSize="xlarge" fontWeight="semibold">
          How do you sign a message?
        </Text>
        <Text marginTop="4" lineHeight="6">
          Well, you need a wallet and a message! Normally you would use a connector like{' '}
          <Text
            as="a"
            className="underline-text"
            href="https://github.com/0xsequence/kit"
            target="_blank"
            rel="noreferrer">
            Sequence Kit
          </Text>{' '}
          and interact with user's wallet via that. For EOA part of this guide let's generate a
          wallet using{' '}
          <Text
            as="a"
            className="underline-text"
            href="https://github.com/ethers-io/ethers.js"
            target="_blank"
            rel="noreferrer">
            ethers.js
          </Text>{' '}
          with a random seed.
        </Text>

        <Text fontSize="large" fontWeight="semibold" marginTop="6" lineHeight="6">
          For EOAs
        </Text>

        <Text fontSize="large" marginTop="3" lineHeight="6">
          1. Let's start with generating a wallet using ethers.js (version 5.7.2)
        </Text>

        <Box flexDirection="row" alignItems="center" marginTop="6">
          <Box paddingRight="5">
            <Button
              marginTop="4"
              label="Run ⚒️"
              onClick={() => {
                run_codeSnippet_createWallet()
              }}></Button>
          </Box>
          <SyntaxHighlighter
            wrapLines
            showLineNumbers={true}
            startingLineNumber={1}
            customStyle={{ borderRadius: '10px', margin: '0', flexGrow: '1' }}
            language="typescript"
            style={oneDark}>
            {codeSnippet_createWallet}
          </SyntaxHighlighter>
        </Box>

        <Text fontSize="large" marginTop="4" lineHeight="6">
          2. Add your message here and run the snippet to sign your message.
        </Text>

        <Box flexDirection="row" marginTop="6">
          <Box
            flexDirection="column"
            width="1/3"
            minWidth="1/3"
            paddingRight="5"
            alignItems="center"
            justifyContent="center">
            <TextArea
              labelLocation="hidden"
              background="backgroundContrast"
              value={messageToSign}
              onChange={e => setMessageToSign(e.target.value)}
              placeholder="Your message"
              name="message"
            />
            <Button
              marginTop="4"
              label="Run ⚒️"
              onClick={() => {
                run_codeSnippet_signMessage()
              }}></Button>
          </Box>
          <SyntaxHighlighter
            lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
            wrapLines={true}
            showLineNumbers={true}
            startingLineNumber={8}
            customStyle={{ borderRadius: '10px', margin: '0', flexGrow: '1' }}
            language="typescript"
            style={oneDark}>
            {codeSnippet_SignMessage}
          </SyntaxHighlighter>
        </Box>

        <Text fontSize="large" marginTop="4" lineHeight="6">
          3. Validate the message using "isValidMessageSignature" function from ethsigning package
        </Text>

        <Box flexDirection="row" alignItems="center" marginTop="6">
          <Box paddingRight="5">
            <Button
              marginTop="4"
              label="Run ⚒️"
              onClick={() => {
                run_codeSnippet_validateSignature()
              }}></Button>
          </Box>
          <SyntaxHighlighter
            wrapLines
            showLineNumbers={true}
            startingLineNumber={14}
            customStyle={{ borderRadius: '10px', margin: '0', flexGrow: '1' }}
            language="typescript"
            style={oneDark}>
            {codeSnippet_validateSignature}
          </SyntaxHighlighter>
        </Box>
      </Box>
    </Box>
  )
}
