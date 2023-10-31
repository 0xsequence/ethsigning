import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { keccak256, toUtf8Bytes } from 'ethers/lib/utils'
import {
  TypedData,
  isValidMessageSignature,
  isValidTypedDataSignature,
  validateEIP6492Offchain
} from 'ethsigning'
import {
  Box,
  Button,
  CheckmarkIcon,
  Image,
  MoonIcon,
  Select,
  Spinner,
  SunIcon,
  Text,
  TextArea,
  TextInput,
  WarningIcon,
  useTheme
} from '@0xsequence/design-system'
import { useNavigate } from 'react-router-dom'

import logoUrl from './assets/logo.png'
import sequenceLogo from './assets/sequence-logo-horizontal-dark.svg'
import sequenceLogoLight from './assets/sequence-logo-horizontal-light.svg'

type Network = { name: string; nodePath: string }

const networks: readonly Network[] = [
  { name: 'Arbitrum', nodePath: 'arbitrum' },
  { name: 'Arbitrum Nova', nodePath: 'arbitrum-nova' },
  { name: 'Avalanche', nodePath: 'avalanche' },
  { name: 'Base', nodePath: 'base' },
  { name: 'BNB', nodePath: 'bsc' },
  { name: 'Ethereum', nodePath: 'mainnet' },
  { name: 'Gnosis', nodePath: 'gnosis' },
  { name: 'Homeverse', nodePath: 'homeverse' },
  { name: 'Optimism', nodePath: 'optimism' },
  { name: 'Polygon', nodePath: 'polygon' },
  { name: 'Polygon zkEVM', nodePath: 'polygon-zkevm' },
  { name: 'Arbitrum Goerli', nodePath: 'arbitrum-goerli' },
  { name: 'Avalanche Testnet', nodePath: 'avalanche-testnet' },
  { name: 'Base Goerli', nodePath: 'base-goerli' },
  { name: 'BNB Testnet', nodePath: 'bsc-testnet' },
  { name: 'Goerli', nodePath: 'goerli' },
  { name: 'Homeverse Testnet', nodePath: 'homeverse-testnet' },
  { name: 'Mumbai', nodePath: 'mumbai' },
  { name: 'Sepolia', nodePath: 'sepolia' }
] as const

interface Result {
  isValid: boolean
  error?: string
}

type WalletType = 'EOA' | 'smartContract'

type SigningDataFormat = 'message' | 'typedData'

const typedDataPlaceholder = `{
  domain : {...},
  types: {...},
  message: {...}     
}
`

export default function Debugger() {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  const [address, setAddress] = useState('')
  const [signingData, setSigningData] = useState<string>('')
  const [signature, setSignature] = useState('')
  const [network, setNetwork] = useState('mainnet')

  const [walletType, setWalletType] = useState<WalletType | undefined>()
  const [smartContractWalletDeployedNetworks, setSmartContractWalletDeployedNetworks] = useState<
    Network[]
  >([])

  const [showNetworkPicker, setShowNetworkPicker] = useState(true)

  const [signingDataFormat, setSigningDataFormat] = useState<SigningDataFormat>('message')

  const [isDebugPending, setIsDebugPending] = useState(false)

  const [result, setResult] = useState<Result | undefined>()

  useEffect(() => {
    setResult(undefined)
  }, [address, signingData, signature, network, signingDataFormat])

  useEffect(() => {
    if (ethers.utils.isAddress(address) && signature !== '') {
      setWalletType(undefined)
      setSmartContractWalletDeployedNetworks([])
      setShowNetworkPicker(true)
      checkWalletType(address, signature)
    }
  }, [address, signature])

  useEffect(() => {
    setSigningData('')
  }, [signingDataFormat])

  const checkWalletType = async (address: string, signature: string) => {
    const result = await Promise.allSettled(
      networks.map(network => {
        const provider = providerForNetwork(network.nodePath)
        return provider.getCode(address)
      })
    )

    const deployedNetworks = result
      .map(r => (r.status === 'fulfilled' ? r.value : '0x'))
      .map((r, i) => {
        return { result: r, network: networks[i] }
      })
      .filter(r => r.result !== '0x')
      .map(r => r.network)

    if (deployedNetworks.length > 0) {
      setWalletType('smartContract')
      setSmartContractWalletDeployedNetworks(deployedNetworks)
    } else {
      if (!isCounterfactual(signature)) {
        setShowNetworkPicker(false)
        setWalletType('EOA')
      } else {
        setShowNetworkPicker(true)
        setWalletType('smartContract')
      }
    }
  }

  const runDebug = async () => {
    setResult(undefined)
    setIsDebugPending(true)
    try {
      const result = await debug(
        address,
        signature,
        network,
        signingDataFormat === 'message' ? (signingData as string) : undefined,
        signingDataFormat === 'typedData' ? (JSON.parse(signingData) as TypedData) : undefined
      )
      setResult({ isValid: !!result })
    } catch (error) {
      setResult({ isValid: false, error: String(error) })
    }
    setIsDebugPending(false)
  }

  return (
    <Box className="container" paddingBottom="16">
      <Box className="logo-container" alignItems="center" justifyContent="space-between">
        <Box alignItems="center">
          <Image
            className="logo"
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
          className="theme-switch-button"
          marginLeft="auto"
          marginRight="4"
          variant="base"
          onClick={() => (theme === 'dark' ? setTheme('light') : setTheme('dark'))}
          leftIcon={theme === 'dark' ? SunIcon : MoonIcon}
        />
        <Button
          variant="feature"
          label="Guide"
          onClick={() => {
            navigate('/')
          }}
        />
      </Box>

      <Box marginTop="16">
        <Box alignItems="center" flexDirection="column" textAlign="center" marginBottom="16">
          <Text variant="xlarge" marginBottom="4">
            Signature Debugger
          </Text>
          <Text variant="normal">
            Enter signer address, message and signature to validate/debug. The tool will check
            possible issues if signature is not valid and try to give you direction that can help
            you resolve the issue.
          </Text>
          <Text variant="normal" marginTop="4" color="positive">
            Supports both EOA and smart contract wallet signatures.
          </Text>
        </Box>
        <Box justifyContent="center">
          <Box width="full" flexDirection="column" justifyContent="flex-start" fontSize="medium">
            <Box width="full">
              <Box flexDirection="column">
                <Text variant="medium" marginBottom="2">
                  Signer address
                </Text>
                <TextInput
                  value={address}
                  onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
                    setAddress(e.target.value)
                  }
                  placeholder="0x..."
                  name="signerAddress"
                />
                <Box>
                  {walletType === 'EOA' && (
                    <Text variant="medium" fontSize="small" marginTop="2" color="info">
                      This is an EOA wallet.
                    </Text>
                  )}
                  {walletType === 'smartContract' && (
                    <Text variant="medium" fontSize="small" marginTop="2" color="info">
                      This is a smart contract wallet.{' '}
                      {smartContractWalletDeployedNetworks.length > 0
                        ? `It's currently deployed on: ` +
                          smartContractWalletDeployedNetworks.map(n => n.name).join(', ')
                        : `It is not deployed on any networks yet.`}
                    </Text>
                  )}
                </Box>

                <Box marginTop="6" marginBottom="3">
                  <Button
                    variant={signingDataFormat === 'message' ? 'primary' : 'base'}
                    onClick={() => setSigningDataFormat('message')}
                    size="sm"
                    label="Message"
                    marginRight="2"
                  />
                  <Button
                    variant={signingDataFormat === 'message' ? 'base' : 'primary'}
                    onClick={() => setSigningDataFormat('typedData')}
                    size="sm"
                    label="Typed data"
                  />
                </Box>
                <TextArea
                  style={{
                    minHeight: signingDataFormat === 'message' ? '160px' : '300px'
                  }}
                  resize
                  value={signingData}
                  onChange={e => setSigningData(e.target.value)}
                  placeholder={
                    signingDataFormat === 'message' ? 'Your message' : typedDataPlaceholder
                  }
                  name="message"
                />
                <Text variant="medium" marginTop="6" marginBottom="2">
                  Signature
                </Text>
                <TextArea
                  style={{
                    minHeight: '160px'
                  }}
                  resize
                  value={signature}
                  onChange={e => setSignature(e.target.value)}
                  placeholder="0x..."
                  name="signature"
                />
                {showNetworkPicker && (
                  <Box marginTop="6">
                    <Box paddingBottom="2">
                      <Text variant="medium">Network</Text>
                    </Box>
                    <Select
                      name="network"
                      labelLocation="top"
                      onValueChange={val => {
                        setNetwork(val)
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
                )}
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
                      signingData === '' ||
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
                paddingY="4"
                marginBottom="10">
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
                        <Box>
                          <Text variant="medium">Signature is not valid.</Text>
                          {showNetworkPicker && (
                            <Text variant="medium">
                              <br />
                              If you believe address, message and signature values are correct,
                              please make sure you have selected the correct network.
                            </Text>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Box
        gap="2"
        alignItems="flex-end"
        justifyContent="center"
        flexGrow="1"
        marginTop="16"
        marginBottom="8">
        <Text variant="small" color="text100">
          Made with ❤️ by
        </Text>
        <Image
          src={theme === 'dark' ? sequenceLogo : sequenceLogoLight}
          style={{ height: '16px' }}
        />
      </Box>
    </Box>
  )
}

const isCounterfactual = (signature: string): boolean => {
  const ERC6492_DETECTION_SUFFIX =
    '6492649264926492649264926492649264926492649264926492649264926492'
  ;('6492649264926492649264926492649264926492649264926492649264926492')

  return signature.slice(-ERC6492_DETECTION_SUFFIX.length) === ERC6492_DETECTION_SUFFIX
}

// For invalid sig, check for cases (to see if it actually matches this way):
// 1. prefixEIP191Message missing

// If above are not helpful, then check address (if smart contract or EOA) and
// give suggestion on how to sign it correctly

const debug = async (
  address: string,
  signature: string,
  network: string,
  message?: string,
  typedData?: TypedData
) => {
  const provider = providerForNetwork(network)
  let isValid = false

  if (message !== undefined) {
    isValid = await isValidMessageSignature(address, message, signature, provider)
  } else if (typedData !== undefined) {
    isValid = await isValidTypedDataSignature(address, typedData, signature, provider)
  }

  if (isValid) {
    console.log('Signature is valid!')
    return true
  }

  if (
    message !== undefined &&
    (await checkScenario_NotPrefixedHash(address, message, signature, network))
  ) {
    console.log('not prefixed hash')
  }
}

const providerForNetwork = (network: string) => {
  return new ethers.providers.JsonRpcProvider(`https://nodes.sequence.app/${network}`)
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

// const joinSignature = (signature: ethers.Signature): string => {
//   signature = splitSignature(signature)

//   return hexlify(concat([signature.r, signature.s, signature.recoveryParam ? '0x1c' : '0x1b']))
// }
// Test data:
// ;(async () => {
//   const testPrivKey = '0x465d0d758d8c7664d9e1bfa46fb5fb8e27265cb4bc28c0f7752d596910545028'
//   const testSigningKey = new SigningKey(testPrivKey)
//   const testEthersWallet = new ethers.Wallet(testPrivKey)
//   const testMessage = 'Test Test Test'
//   const testMessageValidSig = await testEthersWallet.signMessage(testMessage)
//   const testMessageInvaliSig_notPrefixed = joinSignature(
//     testSigningKey.signDigest(keccak256(toUtf8Bytes(testMessage)))
//   )

//   console.log('testWalletAddr:', testEthersWallet.address)
//   console.log('testMessage:', testMessage)
//   console.log('testMessageValidSig:', testMessageValidSig)
//   console.log('testMessageInvalidSig_notPrefixed:', testMessageInvaliSig_notPrefixed)
// })()
