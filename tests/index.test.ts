import {
  TypedData,
  isValidMessageSignature,
  isValidTypedDataSignature
} from './../src/isValidSignature'
import { ethers } from 'ethers'

const SMART_CONTRACT_WALLET_ADDR = '0x08FFc248A190E700421C0aFB4135768406dCebfF'
const EOA_WALLET_ADDR = '0xb016e66D421261FD0078a3b8dd4db640184B93fc'

const providerEthereum = new ethers.providers.JsonRpcProvider('https://nodes.sequence.app/mainnet')
const providerPolygon = new ethers.providers.JsonRpcProvider('https://nodes.sequence.app/polygon')

// Message signature tests

const MESSAGE = `1915 Robert Frost
The Road Not Taken
  
Two roads diverged in a yellow wood,
And sorry I could not travel both
And be one traveler, long I stood
And looked down one as far as I could
To where it bent in the undergrowth
  
Then took the other, as just as fair,
And having perhaps the better claim,
Because it was grassy and wanted wear
Though as for that the passing there
Had worn them really about the same,
  
And both that morning equally lay
In leaves no step had trodden black.
Oh, I kept the first for another day!
Yet knowing how way leads on to way,
I doubted if I should ever come back.
  
I shall be telling this with a sigh
Somewhere ages and ages hence:
Two roads diverged in a wood, and I—
I took the one less traveled by,
And that has made all the difference.
  
\u2601 \u2600 \u2602`

// Signed using Sequence
const SMART_CONTRACT_WALLET_MESSAGE_SIG_VALID =
  '0x0300017d00050000011a0103930409e5d710f8ea7b64ff37e04a2b67bcee3da80203761f5e29944d79d76656323f106cf2efbf5f09e90000620100010000000000019897ab78ccc38c854198ac3ae224fe9eb35819892a75bea08c7852e7137fbb1a086abf3bcc868c977c2ab1ed68c966a92a56487beccb5bea2d4810767944cf651c02010190d62a32d1cc65aa3e80b567c8c0d3ca0f411e6103034476054ac7655d8e017b78f64ab50c19bf16d147847831941f96d00519cadce5035faece493d0d810627ff6322bcd096c709a0d2d2b1841fe79f487d90602b3256038a41f9174355eea6167ccfa738b5fc8a6eba6be6b8aa3e2baedf4294292520a60400007f037c6165bf9298e60495fbbc7f09655e641fe96fd5418890ae95d4db20b5a8ff8a0400005a0102bbabf36081a5a19a29af60db9935b1a647be74820002bf27da8a1cd6be6c656f09d4b0577b7a6952c927b367dfe2c3bca795170634cb2989f243c38793adb804179ad4b06c5952670233a8e3fe28979ea330739991f41b02000203020005000000090384b62ef72b80c874d1fc8fe058058297e53d64d1eb4799ef85bd5f7039009323040001d70348f7aceeb8a3223426fc4a62cdc312226882e51997c3e2431ec6ee7a77a80fe0040000e20310b0510f26b119770d210b3f6c0e3675afc2b3359b6d915295834fd9c051f8fb0400007b0102913eb03d20f1b8de7e46cd1d63f620ecaa6df68e00032b7b007a4492b1177628d8608d9d5241dde881ac1088b368795cc54b49871e663cca61334021884f991e6146c02c86311a239dfa6118706e6596ff6cdf5fecea1c0203708c265ef579013757b9b004afe89915f1c326d330174629df74d6c10a4a394503cd608db99b5ea8319151a176c51dfc6b7905b7a74bae52f2e2b2c3c581ce1df403250cb21c66220d13132886c3e495ad69d2a89e69c1bf500c629e4eacec9e4a40040000cc033b389ab6dcae990322d929e73db515f0b063aa1de4b4630cdfd2da035c867543040000a70102ab0cbf03e8a81492d75f2bd79af63705e9fcd60f0203761f5e29944d79d76656323f106cf2efbf5f09e90000620200010000000000015fb60dfa280da553da3ad9f2b0ffa447d057eb12fdd98fc0ba6bfad2fffab3db563210235d0527692ee432fa19501eb8db4ec9eb17e48a513e94c9ef3c82b2361c02010190d62a32d1cc65aa3e80b567c8c0d3ca0f411e6103010242a3cd79b74eb008345207e207f513f32926589d'

const SMART_CONTRACT_WALLET_MESSAGE_SIG_CORRUPTED =
  '0x0310017d00050000011a0103930409e5d710f8ea7b64ff37e04a2b67bcee3da80203761f5e29944d79d76656323f106cf2efbf5f09e90000620100010000000000019897ab78ccc38c854198ac3ae224fe9eb35819892a75bea08c7852e7137fbb1a086abf3bcc868c977c2ab1ed68c966a92a56487beccb5bea2d4810767944cf651c02010190d62a32d1cc65aa3e80b567c8c0d3ca0f411e6103034476054ac7655d8e017b78f64ab50c19bf16d147847831941f96d00519cadce5035faece493d0d810627ff6322bcd096c709a0d2d2b1841fe79f487d90602b3256038a41f9174355eea6167ccfa738b5fc8a6eba6be6b8aa3e2baedf4294292520a60400007f037c6165bf9298e60495fbbc7f09655e641fe96fd5418890ae95d4db20b5a8ff8a0400005a0102bbabf36081a5a19a29af60db9935b1a647be74820002bf27da8a1cd6be6c656f09d4b0577b7a6952c927b367dfe2c3bca795170634cb2989f243c38793adb804179ad4b06c5952670233a8e3fe28979ea330739991f41b02000203020005000000090384b62ef72b80c874d1fc8fe058058297e53d64d1eb4799ef85bd5f7039009323040001d70348f7aceeb8a3223426fc4a62cdc312226882e51997c3e2431ec6ee7a77a80fe0040000e20310b0510f26b119770d210b3f6c0e3675afc2b3359b6d915295834fd9c051f8fb0400007b0102913eb03d20f1b8de7e46cd1d63f620ecaa6df68e00032b7b007a4492b1177628d8608d9d5241dde881ac1088b368795cc54b49871e663cca61334021884f991e6146c02c86311a239dfa6118706e6596ff6cdf5fecea1c0203708c265ef579013757b9b004afe89915f1c326d330174629df74d6c10a4a394503cd608db99b5ea8319151a176c51dfc6b7905b7a74bae52f2e2b2c3c581ce1df403250cb21c66220d13132886c3e495ad69d2a89e69c1bf500c629e4eacec9e4a40040000cc033b389ab6dcae990322d929e73db515f0b063aa1de4b4630cdfd2da035c867543040000a70102ab0cbf03e8a81492d75f2bd79af63705e9fcd60f0203761f5e29944d79d76656323f106cf2efbf5f09e90000620200010000000000015fb60dfa280da553da3ad9f2b0ffa447d057eb12fdd98fc0ba6bfad2fffab3db563210235d0527692ee432fa19501eb8db4ec9eb17e48a513e94c9ef3c82b2361c02010190d62a32d1cc65aa3e80b567c8c0d3ca0f411e6103010242a3cd79b74eb008345207e207f513f32926589d'

// EOA
const EOA_MESSAGE_TO_SIGN = 'test test test'
const EOA_MESSAGE_SIG =
  '0xd2126d0d9366b6dc1789a356dabadebfa6206e9077cce6220f28cc7cc4d337b04dd22016059a98fee7f35609d5138c28b6c3b179b15d8a65b5f0c3adde967f2b1c'
const EOA_MESSAGE_SIG_CORRUPTED =
  '0xd2126d0d9366b6dc1789a356dabadebfa6206e9077cce6220f28cc7cc4d337b04dd22016059a98fee7f35609d5138c28b6c3b179b15d8a65b5f0c3adde917f2b1c'

describe('using isValidMessageSignature for message signed with smart contract wallet', () => {
  test('should return true for valid message signature (signed on Polygon)', async () => {
    expect(
      await isValidMessageSignature(
        SMART_CONTRACT_WALLET_ADDR,
        MESSAGE,
        SMART_CONTRACT_WALLET_MESSAGE_SIG_VALID,
        providerPolygon
      )
    ).toBe(true)
  })

  test('should return false for corrupted message signature (signed on Polygon)', async () => {
    expect(
      await isValidMessageSignature(
        SMART_CONTRACT_WALLET_ADDR,
        MESSAGE,
        SMART_CONTRACT_WALLET_MESSAGE_SIG_CORRUPTED,
        providerPolygon
      )
    ).toBe(false)
  })

  test('should fail with Ethereum provider (originally signed on Polygon)', async () => {
    expect(
      await isValidMessageSignature(
        SMART_CONTRACT_WALLET_ADDR,
        MESSAGE,
        SMART_CONTRACT_WALLET_MESSAGE_SIG_VALID,
        providerEthereum
      )
    ).toBe(false)
  })
})

describe('using isValidMessageSignature for message signed with EOA wallet', () => {
  test('should return true for valid message signature', async () => {
    expect(
      await isValidMessageSignature(
        EOA_WALLET_ADDR,
        EOA_MESSAGE_TO_SIGN,
        EOA_MESSAGE_SIG,
        providerEthereum
      )
    ).toBe(true)
  })

  test('should return false for corrupted message signature', async () => {
    expect(
      await isValidMessageSignature(
        EOA_WALLET_ADDR,
        EOA_MESSAGE_TO_SIGN,
        EOA_MESSAGE_SIG_CORRUPTED,
        providerEthereum
      )
    ).toBe(false)
  })

  test('should work with any provider', async () => {
    expect(
      await isValidMessageSignature(
        EOA_WALLET_ADDR,
        EOA_MESSAGE_TO_SIGN,
        EOA_MESSAGE_SIG,
        providerPolygon
      )
    ).toBe(true)
  })
})

// Typed data tests

const TYPED_DATA: TypedData = {
  types: {
    Person: [
      { name: 'name', type: 'string' },
      { name: 'wallet', type: 'address' }
    ],
    Mail: [
      { name: 'from', type: 'Person' },
      { name: 'to', type: 'Person' },
      { name: 'cc', type: 'Person[]' },
      { name: 'contents', type: 'string' },
      { name: 'attachements', type: 'string[]' }
    ]
  },
  primaryType: 'Mail',
  domain: {
    name: 'Ether Mail',
    version: '1',
    chainId: 1,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
  },
  message: {
    from: {
      name: 'Cow',
      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
    },
    to: {
      name: 'Bob',
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
    },
    cc: [
      { name: 'Dev Team', wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB' },
      { name: 'Accounting', wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB' }
    ],
    contents: 'Hello, Bob!',
    attachements: ['cat.png', 'dog.png']
  }
}

// Signed using Sequence
const SMART_CONTRACT_WALLET_TYPED_DATA_SIG_VALID =
  '0x0300019e00050000011c0103930409e5d710f8ea7b64ff37e04a2b67bcee3da80203761f5e29944d79d76656323f106cf2efbf5f09e9000062010001000000000001a1402ccf51b6d9ada1e4723b5a86f099fd9498bc173e3bb96888b0f6b8a289d955e2983800edc373aa380dcdecb004932b1ffec98fe4546d0c92353225fee0151c02010190d62a32d1cc65aa3e80b567c8c0d3ca0f411e6103034476054ac7655d8e017b78f64ab50c19bf16d147847831941f96d00519cadce5035faece493d0d810627ff6322bcd096c709a0d2d2b1841fe79f487d90602b3256038a41f9174355eea6167ccfa738b5fc8a6eba6be6b8aa3e2baedf4294292520a6040000a0037c6165bf9298e60495fbbc7f09655e641fe96fd5418890ae95d4db20b5a8ff8a0400005a0102bbabf36081a5a19a29af60db9935b1a647be7482000225d842d96c8d42a8c6792c4faaa1a8d364c6e698c31ffba1a77da1099a2673cd3ebc9ab4c52271c757ab3a0a191dfbae5ffab37aeac520df22cb410a8c2ab7631b02033eb134829847725a7c1eb21f367bedfe7938c14a12d2b4412a92e55f58785935000203020005000000090384b62ef72b80c874d1fc8fe058058297e53d64d1eb4799ef85bd5f7039009323040001d70348f7aceeb8a3223426fc4a62cdc312226882e51997c3e2431ec6ee7a77a80fe0040000e20310b0510f26b119770d210b3f6c0e3675afc2b3359b6d915295834fd9c051f8fb0400007b0102913eb03d20f1b8de7e46cd1d63f620ecaa6df68e00037e4bca56828b54e09ceecdec09e00cd99f7055c7e0ac4b32072643221f6f032c413be2fdbb2024782c5add510496b0d44a41f2e399cd96f146275464eb75bfd21c0203708c265ef579013757b9b004afe89915f1c326d330174629df74d6c10a4a394503cd608db99b5ea8319151a176c51dfc6b7905b7a74bae52f2e2b2c3c581ce1df403250cb21c66220d13132886c3e495ad69d2a89e69c1bf500c629e4eacec9e4a40040000cc033b389ab6dcae990322d929e73db515f0b063aa1de4b4630cdfd2da035c867543040000a70102ab0cbf03e8a81492d75f2bd79af63705e9fcd60f0203761f5e29944d79d76656323f106cf2efbf5f09e90000620200010000000000011a8288fbdf46f7735a52a1e80fe5c566a61a00224ba456df6129b38807c07549523d6be06e2d2b805f60995b6b4aa30cf02f6f47928ee7a2fd49deb383cf72e91b02010190d62a32d1cc65aa3e80b567c8c0d3ca0f411e6103010242a3cd79b74eb008345207e207f513f32926589d'

const SMART_CONTRACT_WALLET_TYPED_DATA_SIG_CORRUPTED =
  '0x0300019e00050000011c0103930409e5d710f8ea7b64ff37e04a2b67bcee3da80203761f5e29944d79d76656323f106cf2efbf9f09e9000062010001000000000001a1402ccf51b6d9ada1e4723b5a86f099fd9498bc173e3bb96888b0f6b8a289d955e2983800edc373aa380dcdecb004932b1ffec98fe4546d0c92353225fee0151c02010190d62a32d1cc65aa3e80b567c8c0d3ca0f411e6103034476054ac7655d8e017b78f64ab50c19bf16d147847831941f96d00519cadce5035faece493d0d810627ff6322bcd096c709a0d2d2b1841fe79f487d90602b3256038a41f9174355eea6167ccfa738b5fc8a6eba6be6b8aa3e2baedf4294292520a6040000a0037c6165bf9298e60495fbbc7f09655e641fe96fd5418890ae95d4db20b5a8ff8a0400005a0102bbabf36081a5a19a29af60db9935b1a647be7482000225d842d96c8d42a8c6792c4faaa1a8d364c6e698c31ffba1a77da1099a2673cd3ebc9ab4c52271c757ab3a0a191dfbae5ffab37aeac520df22cb410a8c2ab7631b02033eb134829847725a7c1eb21f367bedfe7938c14a12d2b4412a92e55f58785935000203020005000000090384b62ef72b80c874d1fc8fe058058297e53d64d1eb4799ef85bd5f7039009323040001d70348f7aceeb8a3223426fc4a62cdc312226882e51997c3e2431ec6ee7a77a80fe0040000e20310b0510f26b119770d210b3f6c0e3675afc2b3359b6d915295834fd9c051f8fb0400007b0102913eb03d20f1b8de7e46cd1d63f620ecaa6df68e00037e4bca56828b54e09ceecdec09e00cd99f7055c7e0ac4b32072643221f6f032c413be2fdbb2024782c5add510496b0d44a41f2e399cd96f146275464eb75bfd21c0203708c265ef579013757b9b004afe89915f1c326d330174629df74d6c10a4a394503cd608db99b5ea8319151a176c51dfc6b7905b7a74bae52f2e2b2c3c581ce1df403250cb21c66220d13132886c3e495ad69d2a89e69c1bf500c629e4eacec9e4a40040000cc033b389ab6dcae990322d929e73db515f0b063aa1de4b4630cdfd2da035c867543040000a70102ab0cbf03e8a81492d75f2bd79af63705e9fcd60f0203761f5e29944d79d76656323f106cf2efbf5f09e90000620200010000000000011a8288fbdf46f7735a52a1e80fe5c566a61a00224ba456df6129b38807c07549523d6be06e2d2b805f60995b6b4aa30cf02f6f47928ee7a2fd49deb383cf72e91b02010190d62a32d1cc65aa3e80b567c8c0d3ca0f411e6103010242a3cd79b74eb008345207e207f513f32926589d'

// EOA
const EOA_TYPED_DATA_SIG =
  '0xe1e06ac525447008eff0177348ce19c4811d6146b29c744de84a66f6acbc80a90a73b0f57bce23ea87bb0813f0fb3eab0850c96a69c0f7600558a629a10279cd1b'
const EOA_TYPED_DATA_SIG_CORRUPTED =
  '0xe1e06ac525447008eff0177348de19c4811d6146b29c744de84a66f6acbc80a90a73b0f57bce23ea87bb0813f0fb3eab0850c96a69c0f7600558a629a10279cd1b'

describe('using isValidTypedDataSignature for typed data signed with smart contract wallet', () => {
  test('should return true for valid typed data signature (signed on Polygon)', async () => {
    expect(
      await isValidTypedDataSignature(
        SMART_CONTRACT_WALLET_ADDR,
        TYPED_DATA,
        SMART_CONTRACT_WALLET_TYPED_DATA_SIG_VALID,
        providerPolygon
      )
    ).toBe(true)
  })

  test('should return false for corrupted message signature (signed on Polygon)', async () => {
    expect(
      await isValidTypedDataSignature(
        SMART_CONTRACT_WALLET_ADDR,
        TYPED_DATA,
        SMART_CONTRACT_WALLET_TYPED_DATA_SIG_CORRUPTED,
        providerPolygon
      )
    ).toBe(false)
  })

  test('should fail with Ethereum provider (originally signed on Polygon)', async () => {
    expect(
      await isValidTypedDataSignature(
        SMART_CONTRACT_WALLET_ADDR,
        TYPED_DATA,
        SMART_CONTRACT_WALLET_TYPED_DATA_SIG_VALID,
        providerEthereum
      )
    ).toBe(false)
  })
})

describe('using isValidTypedDataSignature for message signed with EOA wallet', () => {
  test('should return true for valid message signature', async () => {
    expect(
      await isValidTypedDataSignature(
        EOA_WALLET_ADDR,
        TYPED_DATA,
        EOA_TYPED_DATA_SIG,
        providerEthereum
      )
    ).toBe(true)
  })

  test('should return false for corrupted message signature', async () => {
    expect(
      await isValidTypedDataSignature(
        EOA_WALLET_ADDR,
        TYPED_DATA,
        EOA_TYPED_DATA_SIG_CORRUPTED,
        providerEthereum
      )
    ).toBe(false)
  })

  test('should work with any provider', async () => {
    expect(
      await isValidTypedDataSignature(
        EOA_WALLET_ADDR,
        TYPED_DATA,
        EOA_TYPED_DATA_SIG,
        providerPolygon
      )
    ).toBe(true)
  })
})
