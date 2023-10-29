import { useState } from 'react'
import { Box, Button, Divider, Image, Text, TextArea } from '@0xsequence/design-system'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useNavigate } from 'react-router-dom'
import { isValidMessageSignature } from 'ethsigning'
import { sequence } from '0xsequence'

import logoUrl from './assets/logo.png'
import { ethers } from 'ethers'

export default function Guide() {
  const navigate = useNavigate()

  // Common
  const provider = new ethers.providers.JsonRpcProvider('https://nodes.sequence.app/mainnet')

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

  // Code snippet - create wallet sequence
  const [connectDetails, setConnectDetails] = useState<
    sequence.provider.ConnectDetails | undefined
  >()

  const codeSnippet_createWalletSequence = `import { sequence } from '0xsequence'
import { isValidMessageSignature } from 'ethsigning'

const wallet = await sequence.initWallet({ defaultNetwork: 'mainnet' })
const connectDetails = await wallet.connect({ app: 'ethsigning.guide' })

console.log('connected:', connectDetails.connected)
console.log('address:', connectDetails.session.accountAddress)
// connected: ${connectDetails?.connected ?? 'Log will appear here once you run the snippet!'}
// address: ${
    connectDetails?.session?.accountAddress ?? 'Log will appear here once you run the snippet!'
  }`

  const run_codeSnippet_createWalletSequence = async () => {
    const wallet = sequence.initWallet({ defaultNetwork: 'mainnet' })
    const connectDetails = await wallet.connect({ app: 'ethsigning.guide' })
    setConnectDetails(connectDetails)
  }

  // Code Snippet - enter and sign message Sequence
  const [messageToSignSequence, setMessageToSignSequence] = useState<string | undefined>()
  const [signatureSequence, setSignatureSequence] = useState<string | undefined>(undefined)

  const codeSnippet_SignMessageSequence = `${messageToSignSequence ? '' : '// '}const message = ${
    messageToSignSequence
      ? `'` + messageToSignSequence + `'`
      : `You didn't set a message yet, add it to input on left.`
  }

const signature = await wallet.getSigner().signMessage(message)

console.log('Signature:', signature)
// Signature: ${signatureSequence ?? 'Log will appear here once you run the snippet!'}`

  const run_codeSnippet_signMessageSequence = async () => {
    const wallet = sequence.initWallet({ defaultNetwork: 'mainnet' })
    if (!wallet.isConnected || !messageToSignSequence) {
      return
    }

    const sig = await wallet.getSigner().signMessage(messageToSignSequence)
    setSignatureSequence(sig)
  }

  // Code Snippet - validate message Sequence
  const [isValidSigSequence, setIsValidSigSequence] = useState<boolean | undefined>()

  const codeSnippet_validateSignatureSequence = `const provider = new ethers.providers.JsonRpcProvider('https://nodes.sequence.app/mainnet')
const address = await wallet.getSigner().getAddress()  
const isValid = await isValidMessageSignature(address, message, signature, provider)

console.log('isValid:', isValid)
// isValid: ${isValidSigSequence ?? 'Log will appear here once you run the snippet!'}`

  const run_codeSnippet_validateSignatureSequence = async () => {
    const wallet = sequence.initWallet({ defaultNetwork: 'mainnet' })
    if (!wallet.isConnected || !messageToSignSequence || !signatureSequence) {
      return
    }

    const address = await wallet.getSigner().getAddress()

    const isValid = await isValidMessageSignature(
      address,
      messageToSignSequence,
      signatureSequence,
      provider
    )
    setIsValidSigSequence(isValid)
  }

  // Code snippet - ethers inner flattened

  const codeSnippet_ethersInnerFlattened = `const message = 'Test'
const privateKey = '...'

// 1. Create digest
const EIP191Prefix = "\\x19Ethereum Signed Message:\\n";
  
const messageBytes = toUtf8Bytes(message)
const digest = keccak256(concat([
    toUtf8Bytes(EIP191Prefix),
    toUtf8Bytes(String(message.length)),
    message
]));
  
// 2. Sign digest
const keyPair = getCurve().keyFromPrivate(arrayify(this.privateKey));
const digestBytes = arrayify(digest);
if (digestBytes.length !== 32) {
    throw("bad digest length", "digest", digest);
}
const signedDigest = keyPair.sign(digestBytes, ...);
const splittedSignature = splitSignature({
    recoveryParam: signedDigest.recoveryParam,
    r: hexZeroPad("0x" + signedDigest.r.toString(16), 32),
    s: hexZeroPad("0x" + signedDigest.s.toString(16), 32),
})
  
const signature = hexlify(concat([
    splittedSignature.r,
    splittedSignature.s,
    (splittedSignature.recoveryParam ? "0x1c": "0x1b")
]));
`

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

        <Text marginTop="4" lineHeight="7">
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
          We will then take a deeper look on inner workings of the methods used and touch on the{' '}
          <Text
            as="a"
            className="underline-text"
            href="https://eips.ethereum.org/erc"
            target="_blank"
            rel="noreferrer">
            ERCs
          </Text>{' '}
          related to signing messages like ERC-191, ERC-1271, and ERC-6492.
        </Text>
      </Box>

      <Divider />

      <Box marginTop="10" flexDirection="column">
        <Text fontSize="xlarge" fontWeight="semibold">
          How do you sign a message?
        </Text>
        <Text marginTop="4" lineHeight="7">
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

        <Text fontSize="large" fontWeight="semibold" marginTop="6" lineHeight="7">
          With EOAs
        </Text>

        <Text fontSize="large" marginTop="3" lineHeight="7">
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

        <Text fontSize="large" marginTop="4" lineHeight="7">
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

        <Text fontSize="large" marginTop="4" lineHeight="7">
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

        <Divider />

        <Text fontSize="large" fontWeight="semibold" marginTop="12" lineHeight="7">
          With a Smart Contract Wallet
        </Text>

        <Text fontSize="large" marginTop="3" lineHeight="7">
          1. Let's start with connecting to wallet using Sequence
        </Text>

        <Box flexDirection="row" alignItems="center" marginTop="6">
          <Box paddingRight="5">
            <Button
              marginTop="4"
              label="Run ⚒️"
              onClick={() => {
                run_codeSnippet_createWalletSequence()
              }}></Button>
          </Box>
          <SyntaxHighlighter
            wrapLines
            showLineNumbers={true}
            startingLineNumber={1}
            customStyle={{ borderRadius: '10px', margin: '0', flexGrow: '1' }}
            language="typescript"
            style={oneDark}>
            {codeSnippet_createWalletSequence}
          </SyntaxHighlighter>
        </Box>

        <Text fontSize="large" marginTop="4" lineHeight="7">
          2. Add your message here and run the snippet to sign your message.
        </Text>

        <Box flexDirection="row" marginTop="6">
          <Box
            flexDirection="column"
            width="1/3"
            minWidth="1/3"
            paddingRight="5"
            alignItems="center"
            justifyContent="center"
            style={{ maxHeight: '300px' }}>
            <TextArea
              labelLocation="hidden"
              background="backgroundContrast"
              value={messageToSignSequence}
              onChange={e => setMessageToSignSequence(e.target.value)}
              placeholder="Your message"
              name="message"
            />
            <Button
              marginTop="4"
              label="Run ⚒️"
              onClick={() => {
                run_codeSnippet_signMessageSequence()
              }}></Button>
          </Box>
          <SyntaxHighlighter
            lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
            wrapLines={true}
            showLineNumbers={true}
            startingLineNumber={11}
            customStyle={{ maxHeight: '300px', borderRadius: '10px', margin: '0', flexGrow: '1' }}
            language="typescript"
            style={oneDark}>
            {codeSnippet_SignMessageSequence}
          </SyntaxHighlighter>
        </Box>

        <Text fontSize="large" marginTop="4" lineHeight="7">
          3. Validate the message using "isValidMessageSignature" function from ethsigning package
        </Text>

        <Box flexDirection="row" alignItems="center" marginTop="6">
          <Box paddingRight="5">
            <Button
              marginTop="4"
              label="Run ⚒️"
              onClick={() => {
                run_codeSnippet_validateSignatureSequence()
              }}></Button>
          </Box>
          <SyntaxHighlighter
            wrapLines
            showLineNumbers={true}
            startingLineNumber={17}
            customStyle={{ borderRadius: '10px', margin: '0', flexGrow: '1' }}
            language="typescript"
            style={oneDark}>
            {codeSnippet_validateSignatureSequence}
          </SyntaxHighlighter>
        </Box>

        <Text marginTop="8" lineHeight="7">
          Now that we have an idea on what pieces and tools to use to sign and validate a message,
          next let's dive a bit deeper on what's happening behind the interface.
        </Text>
      </Box>

      <Divider />

      <Box marginTop="10" flexDirection="column">
        <Text fontSize="xlarge" fontWeight="semibold">
          Behind the Interface
        </Text>

        <Text marginTop="4" lineHeight="7">
          In this section, we'll look into the methods we used above work in a lower level for EOA
          wallets (since this process is standardized), and for Smart Contract wallet we will
          explain how the related ERCs make it possible for contracts to validate signatures.
          Finally, we will see how <strong>ethsigning</strong> library allows us to use the same
          validation method for both kind of wallets. Through it we will touch on the related ERCs.
        </Text>

        <Text fontSize="large" fontWeight="semibold" marginTop="6" lineHeight="7">
          For EOAs
        </Text>

        <Text marginTop="4" marginBottom="4" lineHeight="7">
          Below is the <strong>signMessage</strong> method from ethers.js presented in an expanded
          line-by-line format (and partly pseudo since we do not have imports etc.). We used it in
          its original form in the first part of the previous section. <br /> Give it a look! Next,
          we will explain what each part does.
        </Text>

        <SyntaxHighlighter
          wrapLines
          showLineNumbers={true}
          startingLineNumber={1}
          customStyle={{ borderRadius: '10px', margin: '0', flexGrow: '1' }}
          language="typescript"
          style={oneDark}>
          {codeSnippet_ethersInnerFlattened}
        </SyntaxHighlighter>

        <Text fontSize="large" marginTop="4" marginBottom="4" lineHeight="7">
          Part 1: Creating Digest
        </Text>
        <Text marginBottom="4" lineHeight="7">
          In this part, we are preparing the message 'Test' for signing by creating a hash digest:
        </Text>
        <Text marginBottom="4" lineHeight="7">
          Preparing the Message (Lines 7-12): <br />- Here we see{' '}
          <Text
            as="a"
            className="underline-text"
            href="https://eips.ethereum.org/EIPS/eip-191"
            target="_blank"
            rel="noreferrer">
            ERC-191 standard
          </Text>{' '}
          in action. This requires a specific prefix for signed messages to ensure signed messages
          cannot be used as valid presigned transaction. This prefix is "\x19Ethereum Signed
          Message:\n". <br />- The message and the prefix are converted to byte arrays, concatenated
          together along with the message length, and then hashed using the keccak256 function to
          create a digest of the message.
        </Text>

        <Text fontSize="large" marginBottom="4" lineHeight="7">
          Part 2: Signing the Digest
        </Text>
        <Text marginBottom="4" lineHeight="7">
          In this part, we sign the generated digest using the private key:
        </Text>
        <Text marginBottom="4" lineHeight="7">
          Creating a Key Pair (Line 15):
          <br />
          - A key pair object is created from the private key which will be used for signing the
          digest. <br />
          Preparing the Digest (Lines 16-19): <br />
          - The digest is converted to a byte array and its length is checked to ensure it is 32
          bytes, which is the required length for signing.
          <br />
          Signing the Digest (Lines 20-25):
          <br />
          - The digest is signed using the sign method of the key pair object to generate the r, s,
          and recoveryParam values of the signature.
          <br />
          Formatting the Signature (Lines 27-31):
          <br />
          - The signature is formatted by concatenating the r, s, and recoveryParam values into a
          single hexadecimal string. The recoveryParam is encoded as 0x1c if it's 1, and 0x1b if
          it's 0. <br />
        </Text>

        <Text marginBottom="4" lineHeight="7">
          Now we have a complete Ethereum signature for the message 'Test' generated using a private
          key. This signature can be shared with others who can use it to verify that it was indeed
          created by the private key associated with your Ethereum address.
        </Text>

        <Divider />

        <Text fontSize="large" fontWeight="semibold" marginTop="6" lineHeight="7">
          For Smart Contract Wallets
        </Text>

        <Text marginTop="4" marginBottom="4" lineHeight="7">
          Smart contract wallets bring about a level of flexibility and customization that is not
          available with EOAs. Unlike EOAs where the signature validation logic is standardized,
          smart contract wallets, by implementing{' '}
          <Text
            as="a"
            className="underline-text"
            href="https://eips.ethereum.org/EIPS/eip-1271"
            target="_blank"
            rel="noreferrer">
            ERC-1271: Standard Signature Validation Method for Contracts
          </Text>{' '}
          , can define their own logic for validating signatures through methods defined within the
          smart contract itself. This allows for a variety of signature schemes and additional
          authorization logic.
        </Text>
        <Text marginBottom="4" lineHeight="7">
          Another important standard for smart contract wallets is{' '}
          <Text
            as="a"
            className="underline-text"
            href="https://eips.ethereum.org/EIPS/eip-6492"
            target="_blank"
            rel="noreferrer">
            ERC-6492: Signature Validation for Predeploy Contracts
          </Text>
          . This standard addresses a crucial challenge with smart contract wallets that have not
          yet been deployed. Unlike EOA wallets that do not require a deployment, smart contract
          wallets (as the name suggests) are contracts living onchain but they may not be deployed
          until they are actually needed, which saves on costs and enhances user experience.
          However, this poses a challenge when such wallets need to provide signatures for dApps,
          for instance, during login or other interactive processes. ERC-6492 brings a systematic
          way to validate signatures from such yet-to-be-deployed smart contract wallets.
        </Text>
        <Text marginBottom="4" lineHeight="7">
          The core of this standard extends the ERC-1271 standard to handle predeploy contracts. It
          adds a wrapper signature format that signing contracts may use before they're deployed,
          allowing for signature verification. This involves a unique wrapper format detected via a
          specific sequence of magic bytes at the end of the signature. If wrapper signature format
          is detected, it suggests that the verifier needs to perform some actions to ensure the
          contract is deployed before proceeding with the <strong>isValidSignature</strong> function
          call. Specifically, the verifier should make an <strong>eth_call</strong> to a multicall
          contract that first calls the factory with <strong>factoryCalldata</strong> to deploy the
          contract if it isn't already deployed, and then calls <strong>isValidSignature</strong> on
          the contract with the unwrapped signature. This process ensures that the contract is
          deployed and ready for signature verification as per the ERC-1271 standard.
        </Text>
        <Text marginBottom="4" lineHeight="7">
          Furthermore, ERC-6492 facilitates both on-chain and off-chain validation, providing
          flexibility in signature verification processes.
        </Text>

        <Divider />

        <Text fontSize="large" fontWeight="semibold" marginTop="6" lineHeight="7">
          Validation
        </Text>
      </Box>
    </Box>
  )
}
