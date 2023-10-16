---
slug: /
---

# EOAs vs. Smart Contract Wallets

In Ethereum, signing messages is a mechanism to prove ownership of a particular address without the need to perform a transaction on the blockchain. This document explains the differences between signing messages with Externally Owned Accounts (EOAs) and smart contract wallets, with a focus on EIP-1271 and EIP-6492 standards.

## Externally Owned Accounts (EOAs) vs. Smart Contract Wallets

- **EOAs**:

  - Simple accounts controlled by private keys.
  - Can easily sign messages using their private keys which can then be verified by anyone using the corresponding public key.

- **Smart Contract Wallets**:
  - Contracts that own and control assets.
  - Can be controlled by EOAs or other contracts.
  - Unlike EOAs, they don’t have private keys to sign messages, and need a method within the contract to verify signatures.

## EIP-1271 (Standard Signature Validation Method for Contracts)

- Proposes a standard method for smart contract wallets to verify signatures.
- Introduces a `isValidSignature` function that can be implemented within the smart contract.
- This function can be called to verify a signature on behalf of the contract, enabling other contracts and off-chain entities to verify signatures as if they were made by EOAs.

## EIP-6492 (Signature Validation for Predeploy Contracts)

- Addresses a limitation where smart contract wallets, which are not yet deployed on the blockchain, can't sign messages.
- Introduces a wrapper signature format for contracts before they are deployed.
- The signature verifier needs to perform a contract deployment before attempting to call the `isValidSignature` function if the wrapper signature format is detected.
- Designed to work well with CREATE2 contracts, as their deploy address is always predictable.
- Extends ERC-1271's functionality to include predeploy contracts, allowing for signature verification before the contract is actually deployed on the blockchain.

## Interaction Between EIP-1271 and EIP-6492

- EIP-6492 is essentially an extension of EIP-1271, designed to handle cases where the smart contract is not yet deployed.
- Utilizes the same `isValidSignature` function defined in EIP-1271 but adds a new wrapper signature format for the pre-deployed contracts.
