require('@nomicfoundation/hardhat-toolbox')
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // Lower runs = smaller bytecode but higher gas costs
      },
    },
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    amoy: {
      allowUnlimitedContractSize: true,
      url: process.env.RPC_URL_AMOY,
      accounts: [process.env.PRIVATE_KEY],
    },
    sepolia: {
      allowUnlimitedContractSize: true,
      url: process.env.RPC_URL_SEPOLIA,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 1000000000, // 1 gwei
      gas: 8000000, // Higher gas limit
    },
    fuji: {
      allowUnlimitedContractSize: true,
      url: process.env.RPC_URL_FUJI,
      accounts: [process.env.PRIVATE_KEY],
    },
    bsc: {
      allowUnlimitedContractSize: true,
      url: process.env.RPC_URL_BSC,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
  contractSizer: {
    runOnCompile: true,
  },
}
