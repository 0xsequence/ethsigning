import { useState } from 'react'
import {
  ArrowRightIcon,
  Box,
  Button,
  Divider,
  Image,
  Text,
  TextArea
} from '@0xsequence/design-system'
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

// 1. Preparing the digest
const EIP191Prefix = "\\x19Ethereum Signed Message:\\n";
  
const messageBytes = toUtf8Bytes(message)
const digest = keccak256(concat([
    toUtf8Bytes(EIP191Prefix),
    toUtf8Bytes(String(messageBytes.length)),
    messageBytes
]));
  
// 2. Signing digest
const digestBytes = arrayify(digest);
if (digestBytes.length !== 32) {
  throw("bad digest length", "digest", digest);
}
const keyPair = getCurve().keyFromPrivate(arrayify(this.privateKey));
const signedDigest = keyPair.sign(digestBytes, ...);
const splitSig = splitSignature({
    recoveryParam: signedDigest.recoveryParam,
    r: hexZeroPad("0x" + signedDigest.r.toString(16), 32),
    s: hexZeroPad("0x" + signedDigest.s.toString(16), 32),
})

const signature = hexlify(concat([
    splitSig.r,
    splitSig.s,
    (splitSig.recoveryParam ? "0x1c": "0x1b")
]))
`

  const codeSnippet_ethsigningInnerFlattened = `const provider = new ethers.providers.JsonRpcProvider('...')
const signerAddress = "0x..."
const message = 'Test'
const signature = "0x..."

const EIP_6492_OFFCHAIN_DEPLOY_CODE = "..."

// 1. Preparing the digest
const EIP191Prefix = "\\x19Ethereum Signed Message:\\n";
  
const messageBytes = toUtf8Bytes(message)
const digest = keccak256(concat([
    toUtf8Bytes(EIP191Prefix),
    toUtf8Bytes(String(messageBytes.length)),
    messageBytes
]));

const digestBytes = arrayify(digest)

// 2. Validating signature
const isValidSignature = '0x01' ===
(await provider.call({
  data: concat([
    EIP_6492_OFFCHAIN_DEPLOY_CODE,
    new AbiCoder().encode(
      ['address', 'bytes32', 'bytes'],
      [signerAddress, digestBytes, signature]
    )
  ])
}))`

  return (
    <Box className="container" paddingBottom="16">
      <Box alignItems="center" justifyContent="space-between">
        <Box alignItems="center">
          <Image
            style={{ width: '60px', height: '60px' }}
            src={logoUrl}
            borderRadius="md"
            marginRight="4"
          />
          <Text className="logo-title" fontSize="large" fontWeight="bold">
            ethsigning.guide
          </Text>
        </Box>

        <Button
          variant="feature"
          label="Signature Debugger"
          onClick={() => {
            navigate('/debugger')
          }}
        />
      </Box>

      <Box
        paddingY="16"
        textAlign="center"
        fontSize="xlarge"
        fontWeight="normal"
        background="backgroundSecondary"
        borderRadius="lg"
        marginY="10">
        <Text
          as="a"
          variant="xlarge"
          color="text100"
          href="https://github.com/0xsequence/ethsigning"
          target="_blank"
          rel="noreferrer"
          className="underline-text">
          A library to make signature validation easier
        </Text>

        <Text as="div" variant="xlarge" color="text100" marginY="4">
          +
        </Text>

        <Text variant="xlarge" color="text100">
          An interactive guide on Ethereum signatures{' '}
          <Text
            marginLeft="2"
            style={{ position: 'relative', top: '4px' }}
            className="text-gradient-clip">
            ⤵
          </Text>
        </Text>
      </Box>

      <Box flexDirection="column">
        <Text as="h2" variant="large" color="text100" fontWeight="bold">
          What are signatures?
        </Text>

        <Text as="p" variant="normal" color="text80">
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
          validation helper package.
          <br />
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

      <Divider marginY="8" />

      <Box flexDirection="column">
        <Text as="h2" variant="large" color="text100" fontWeight="bold">
          How do you sign a message?
        </Text>

        <Text as="p" variant="normal" color="text80">
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

        <Text as="h3" variant="medium" color="text50">
          With EOAs
        </Text>

        <Text as="h4" variant="normal" color="text100" fontWeight="bold">
          1. Let's start with generating a wallet using ethers.js (version 5.7.2)
        </Text>

        <Box marginBottom="6">
          <SyntaxHighlighter
            wrapLines
            showLineNumbers={true}
            startingLineNumber={1}
            customStyle={{ borderRadius: '10px', margin: '0', flexGrow: '1' }}
            language="typescript"
            style={oneDark}>
            {codeSnippet_createWallet}
          </SyntaxHighlighter>

          <Box justifyContent="flex-end" marginTop="4">
            <Button
              variant="primary"
              label="Run"
              rightIcon={ArrowRightIcon}
              onClick={() => {
                run_codeSnippet_createWallet()
              }}
            />
          </Box>
        </Box>

        <Text as="h4" variant="normal" color="text100" fontWeight="bold">
          2. Add your message here and run the snippet to sign your message.
        </Text>

        <Box marginBottom="6">
          <TextArea
            labelLocation="hidden"
            background="backgroundContrast"
            value={messageToSign}
            onChange={e => setMessageToSign(e.target.value)}
            placeholder="Your message"
            name="message"
            marginBottom="4"
          />

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

          <Box justifyContent="flex-end" marginTop="4">
            <Button
              variant="primary"
              label="Run"
              rightIcon={ArrowRightIcon}
              onClick={() => {
                run_codeSnippet_signMessage()
              }}
            />
          </Box>
        </Box>

        <Text as="h4" variant="normal" color="text100" fontWeight="bold">
          3. Validate the message using "isValidMessageSignature" function from ethsigning package
        </Text>

        <Box marginBottom="6">
          <SyntaxHighlighter
            wrapLines
            showLineNumbers={true}
            startingLineNumber={14}
            customStyle={{ borderRadius: '10px', margin: '0', flexGrow: '1' }}
            language="typescript"
            style={oneDark}>
            {codeSnippet_validateSignature}
          </SyntaxHighlighter>
          <Box justifyContent="flex-end" marginTop="4">
            <Button
              variant="primary"
              label="Run"
              rightIcon={ArrowRightIcon}
              onClick={() => {
                run_codeSnippet_validateSignature()
              }}
            />
          </Box>
        </Box>

        <Divider marginY="8" />

        <Text as="h2" variant="large" color="text100" font-weight="bold">
          With a Smart Contract Wallet
        </Text>

        <Text as="h4" variant="normal" color="text100" fontWeight="bold">
          1. Let's start with connecting to wallet using Sequence
        </Text>

        <Box marginBottom="6">
          <SyntaxHighlighter
            wrapLines
            showLineNumbers={true}
            startingLineNumber={1}
            customStyle={{ borderRadius: '10px', margin: '0', flexGrow: '1' }}
            language="typescript"
            style={oneDark}>
            {codeSnippet_createWalletSequence}
          </SyntaxHighlighter>

          <Box justifyContent="flex-end" marginTop="4">
            <Button
              variant="primary"
              label="Run"
              rightIcon={ArrowRightIcon}
              onClick={() => {
                run_codeSnippet_createWalletSequence()
              }}
            />
          </Box>
        </Box>

        <Text as="h4" variant="normal" color="text100" fontWeight="bold">
          2. Add your message here and run the snippet to sign your message.
        </Text>

        <Box marginBottom="6">
          <TextArea
            labelLocation="hidden"
            background="backgroundContrast"
            value={messageToSignSequence}
            onChange={e => setMessageToSignSequence(e.target.value)}
            placeholder="Your message"
            name="message"
            marginBottom="4"
          />

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

          <Box justifyContent="flex-end" marginTop="4">
            <Button
              variant="primary"
              label="Run"
              rightIcon={ArrowRightIcon}
              onClick={() => {
                run_codeSnippet_signMessageSequence()
              }}
            />
          </Box>
        </Box>

        <Text as="h4" variant="normal" color="text100" fontWeight="bold">
          3. Validate the message using "isValidMessageSignature" function from ethsigning package
        </Text>

        <Box marginBottom="6">
          <SyntaxHighlighter
            wrapLines
            showLineNumbers={true}
            startingLineNumber={17}
            customStyle={{ borderRadius: '10px', margin: '0', flexGrow: '1' }}
            language="typescript"
            style={oneDark}>
            {codeSnippet_validateSignatureSequence}
          </SyntaxHighlighter>

          <Box justifyContent="flex-end" marginTop="4">
            <Button
              variant="primary"
              label="Run"
              rightIcon={ArrowRightIcon}
              onClick={() => {
                run_codeSnippet_validateSignatureSequence()
              }}
            />
          </Box>
        </Box>

        <Text as="p" variant="normal" color="text80">
          Now that we have an idea on what pieces and tools to use to sign and validate a message,
          next let's dive a bit deeper on what's happening behind the interface.
        </Text>
      </Box>

      <Divider marginY="8" />

      <Box marginTop="10" flexDirection="column">
        <Text as="h2" variant="large" fontWeight="bold" color="text100">
          Behind the Interface
        </Text>

        <Text as="p" variant="normal" color="text80">
          In this section, for EOAs we'll look into the methods we used above work in a lower level
          (since this process is standardized), and for Smart Contract wallets we will see what
          makes it possible for the contracts to validate signatures. Finally, we will see how{' '}
          <strong>ethsigning</strong> package allows us to use the same validation method for both
          kind of wallets. Through it we will touch on the related ERCs.
        </Text>

        <Box>
          <Text as="h3" variant="medium" color="text50">
            EOAs
          </Text>

          <Text as="p" variant="normal" color="text80">
            Below is the <strong>signMessage</strong> method from ethers.js presented in an expanded
            line-by-line format (and partly pseudo-code since it skips some setup for brevity). We
            used it in its original form in the first part of the previous section. <br /> Give it a
            look! Next, we will explain what each part does.
          </Text>
        </Box>

        <Box marginBottom="6">
          <SyntaxHighlighter
            wrapLines
            showLineNumbers={true}
            startingLineNumber={1}
            customStyle={{ borderRadius: '10px', margin: '0', flexGrow: '1' }}
            language="typescript"
            style={oneDark}>
            {codeSnippet_ethersInnerFlattened}
          </SyntaxHighlighter>
        </Box>

        <Text as="h4" variant="normal" color="text100" fontWeight="bold">
          Part 1: Preparing the Digest
        </Text>

        <Text as="p" variant="normal" color="text80">
          In this part, we are preparing the message 'Test' for signing by creating a hash digest:
        </Text>

        <Text as="p" variant="normal" color="text80">
          <Text fontWeight="bold">Preparing the Message (Lines 7-12):</Text> Here we see{' '}
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
          Message:\n". <br />
          The message and the prefix are converted to byte arrays, concatenated together along with
          the message length, and then hashed using the keccak256 function to create a digest of the
          message.
        </Text>

        <Text as="h4" variant="normal" color="text100" fontWeight="bold">
          Part 2: Signing the Digest
        </Text>

        <Text as="p" variant="normal" color="text80">
          In this part, we sign the generated digest using the private key:
        </Text>

        <Text as="p" variant="normal" color="text80">
          <Text fontWeight="bold">Creating a Key Pair (Line 15):</Text> A key pair object is created
          from the private key which will be used for signing the digest. Preparing the Digest
          (Lines 16-19): The digest is converted to a byte array and its length is checked to ensure
          it is 32 bytes, which is the required length for signing.
        </Text>

        <Text as="p" variant="normal" color="text80">
          <Text fontWeight="bold">Signing the Digest (Lines 20-25):</Text>
          The digest is signed using the sign method of the key pair object to generate the r, s,
          and recoveryParam values of the signature.
        </Text>

        <Text as="p" variant="normal" color="text80">
          <Text fontWeight="bold">Formatting the Signature (Lines 27-31):</Text> The signature is
          formatted by concatenating the r, s, and recoveryParam values into a single hexadecimal
          string. The recoveryParam is encoded as 0x1c if it's 1, and 0x1b if it's 0.
        </Text>

        <Text as="p" variant="normal" color="text80">
          Now we have a complete Ethereum signature for the message 'Test' generated using a private
          key. This signature can be shared with others who can use it to verify that it was indeed
          created by the private key associated with your Ethereum address.
        </Text>

        <Divider marginY="8" />

        <Text as="h2" variant="large" color="text100" fontWeight="bold">
          Smart Contract Wallets
        </Text>

        <Text as="p" variant="normal" color="text80">
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

        <Text as="p" variant="normal" color="text80">
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

        <Text as="p" variant="normal" color="text80">
          The core of this standard extends the ERC-1271 standard to handle predeploy contracts. It
          adds a wrapper signature format that signing contracts may use before they're deployed,
          allowing for signature verification. This involves a unique wrapper format detected via a
          specific sequence of magic bytes at the end of the signature. If wrapper signature format
          is detected, it suggests that the verifier needs to perform some actions to ensure the
          contract is deployed before proceeding with the <strong>isValidSignature</strong> function
          call. Specifically, the verifier should make an <strong>eth_call</strong> to a multicall
          contract that first calls the factory with <strong>factoryCalldata</strong> to deploy the
          contract if it isn't already deployed, and then calls <strong>isValidSignature</strong> on
          the contract with the unwrapped signature.
        </Text>

        <Text as="p" variant="normal" color="text80">
          ERC-6492 also facilitates both on-chain and off-chain validation, and is backward
          compatible with previous work on signature validation, and allows for easy verification of
          all signature types, including EOA signatures and typed data providing flexibility in
          signature verification processes.
        </Text>

        <Divider marginY="8" />

        <Text as="h2" variant="large" color="text100" fontWeight="bold">
          Validation
        </Text>

        <Text as="p" variant="normal" color="text80">
          As you've seen, we've used <strong>ethsigning</strong> package for validating both EOA and
          smart contract wallet signatures. This capability of the package is implemented easily
          thanks to ERC-6492 we mentioned above.
        </Text>

        <Text as="p" variant="normal" color="text80">
          Now let's take a look under the hood. We will again go over the source code in an expanded
          line-by-line format (and partly pseudo-code since it skips some setup for brevity) to get
          a better understanding.
        </Text>

        <Box marginBottom="6">
          <SyntaxHighlighter
            wrapLines
            showLineNumbers={true}
            startingLineNumber={1}
            customStyle={{ borderRadius: '10px', margin: '0', flexGrow: '1' }}
            language="typescript"
            style={oneDark}>
            {codeSnippet_ethsigningInnerFlattened}
          </SyntaxHighlighter>
        </Box>

        <Text as="h4" variant="normal" color="text100" fontWeight="bold">
          Part 1: Preparing the Digest
        </Text>

        <Text as="p" variant="normal" color="text80">
          In this part, we are preparing the message 'Test' for validation comparison by creating a
          hash digest. As you may have noticed this part is exactly same as the first part of the
          section where we created hash digest for the signature.
        </Text>

        <Text as="h4" variant="normal" color="text100" fontWeight="bold">
          Part 2: Validating the Signature
        </Text>

        <Text as="p" variant="normal" color="text80">
          Here we validate the signature by doing an <strong>eth_call</strong> with related params.
        </Text>

        <Text as="p" variant="normal" color="text80">
          We've now seen how the <strong>ethsigning</strong> package is able to validate both EOA
          and smart contract wallet signatures in detail, showcasing the utility and ease brought
          about by adhering to standards like ERC-6492.
        </Text>
      </Box>

      <Divider marginY="8" />

      <Box flexDirection="column">
        <Text as="h2" variant="large" color="text100" fontWeight="bold" marginBottom="6">
          Recap
        </Text>

        <Text as="p" variant="normal" color="text80">
          We've gone through the essentials of Ethereum signatures in this guide, covering the
          basics and diving into some practical examples. We explored how to create signatures with
          ethers.js for EOAs and Sequence for smart contract wallets, and saw how the ethsigning
          package can simplify validation.
        </Text>

        <Text as="p" variant="normal" color="text80">
          We also looked under the hood to understand the mechanisms of signing and validation,
          touching on relevant ERC standards. This hands-on approach aimed to provide a clearer
          picture of how signature operations are carried out in Ethereum.{' '}
        </Text>

        <Text as="p" variant="normal" color="text80">
          The ethsigning package, as demonstrated, is a helpful tool for handling signatures across
          different types of wallets, making the process more straightforward.
        </Text>

        <Text as="p" variant="normal" color="text80">
          Thank you for exploring this guide on Ethereum signatures. Your journey into the world of
          blockchain and Ethereum is an exciting one, and we're glad to have been a part of it. Your
          engagement and curiosity drive the community forward, and we're thankful for that.
        </Text>

        <Divider marginY="8" />

        <Text as="h2" variant="large" color="text100" fontWeight="bold" marginBottom="6">
          Let's Stay Connected! 💜
        </Text>

        <Text as="p" variant="normal" color="text80">
          If you found this guide helpful and wish to delve deeper on what we are building, or if
          you have any questions, feel free to reach out and connect with us via following:
        </Text>

        <Text
          marginTop="4"
          marginBottom="4"
          as="a"
          href="https://github.com/0xsequence"
          target="_blank"
          rel="noreferrer"
          className="underline-text">
          github.com/0xsequence
        </Text>

        <Text
          marginTop="4"
          marginBottom="4"
          as="a"
          href="https://sequence.xyz/"
          target="_blank"
          rel="noreferrer"
          className="underline-text">
          sequence.xyz/
        </Text>

        <Text
          marginTop="4"
          marginBottom="4"
          as="a"
          href="https://discord.gg/sequence"
          target="_blank"
          rel="noreferrer"
          className="underline-text">
          Sequence discord channel
        </Text>
      </Box>
    </Box>
  )
}
