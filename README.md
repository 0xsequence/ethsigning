<p align="center">
    <img src="readme.svg" alt="header">
</p>

Ethsigning helps you validate signatures for both externally owned account (EOA) wallets and smart contract wallets. This includes validation support for:

- [EIP-712: Typed structured data hashing and signing](https://eips.ethereum.org/EIPS/eip-712)
- [ERC-1271: Standard Signature Validation Method for Contracts](https://eips.ethereum.org/EIPS/eip-1271)
- [ERC-6492: Signature Validation for Predeploy Contracts](https://eips.ethereum.org/EIPS/eip-6492)

## Installation

`npm install ethsigning`

or use any package manager you like!

## Usage

Ethsigning package comes with 2 methods, which are

```typescript
isValidMessageSignature: (
  address: string,
  message: string | Uint8Array,
  signature: string,
  provider: ethers.providers.Provider
) => Promise<boolean>
```

and

```typescript
isValidTypedDataSignature: (
  address: string,
  typedData: TypedData,
  signature: string,
  provider: ethers.providers.Provider
) => Promise<boolean>
```

Example:

```typescript
import { ethers } from 'ethers'
import { isValidMessageSignature } from 'ethsigning'

const provider = new ethers.providers.JsonRpcProvider('https://nodes.sequence.app/mainnet')

const isValid = await isValidMessageSignature(
  address, // Address of the signer
  message,
  signature,
  provider
)

console.log('isValid:', isValid)
```

## Notes

- If you are validating a signature that was signed with a smart contract, make sure the provider you pass is for the network the message was signed on.

## Package in action

You can try it [here](https://ethsigning.guide/debugger) to see the package in action.
