import '@typechain/hardhat'

import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import 'hardhat-watcher'

import '@solarity/hardhat-migrate'

import * as dotenv from 'dotenv'
dotenv.config()

const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : undefined

const LOW_OPTIMIZER_COMPILER_SETTINGS = {
  version: '0.7.6',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 2_000,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
}

const LOWEST_OPTIMIZER_COMPILER_SETTINGS = {
  version: '0.7.6',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 1_000,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
}

const DEFAULT_COMPILER_SETTINGS = {
  version: '0.7.6',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 1_000_000,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
}

export default {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: false,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    arbitrumRinkeby: {
      url: `https://arbitrum-rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    arbitrum: {
      url: `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    optimismKovan: {
      url: `https://optimism-kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    optimism: {
      url: `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    piccadilly: {
      url: `https://rpc1.piccadilly.autonity.org/`,
      accounts,
    },
    qdevnet: {
      url: `https://rpc.qdevnet.org`,
      accounts,
    },
    qtestnet: {
      url: `https://rpc.qtestnet.org`,
      accounts,
    },
    qmainnet: {
      url: `https://rpc.q.org`,
      accounts,
    },
  },
  etherscan: {
    apiKey: {
      piccadilly: 'abc',
      qdevnet: 'abc',
      qtestnet: 'abc',
      qmainnet: 'abc',
    },
    customChains: [
      {
        network: 'qdevnet',
        chainId: 35442,
        urls: {
          apiURL: 'http://54.73.188.73:8080/api',
          browserURL: 'http://54.73.188.73:8080',
        },
      },
      {
        network: 'qtestnet',
        chainId: 35443,
        urls: {
          apiURL: 'https://explorer-old.qtestnet.org/api',
          browserURL: 'https://explorer-old.qtestnet.org',
        },
      },
      {
        network: 'qmainnet',
        chainId: 35441,
        urls: {
          apiURL: 'https://explorer.q.org/api',
          browserURL: 'https://explorer.q.org',
        },
      },
      {
        network: `piccadilly`,
        chainId: 65100001,
        urls: {
          apiURL: 'https://piccadilly.autonity.org/api',
          browserURL: 'https://piccadilly.autonity.org',
        },
      },
    ],
  },
  solidity: {
    compilers: [DEFAULT_COMPILER_SETTINGS],
    overrides: {
      'contracts/NonfungiblePositionManager.sol': LOW_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/test/MockTimeNonfungiblePositionManager.sol': LOW_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/test/NFTDescriptorTest.sol': LOWEST_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/NonfungibleTokenPositionDescriptor.sol': LOWEST_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/libraries/NFTDescriptor.sol': LOWEST_OPTIMIZER_COMPILER_SETTINGS,
    },
  },
  watcher: {
    test: {
      tasks: [{ command: 'test', params: { testFiles: ['{path}'] } }],
      files: ['./test/**/*'],
      verbose: true,
    },
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
    alwaysGenerateOverloads: true,
    discriminateTypes: true,
  },
}
