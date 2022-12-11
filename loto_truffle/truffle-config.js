const HDWalletProvider = require("@truffle/hdwallet-provider") ;
const mnemonic = '9fa28a6745b737ad861ee52cb6b534df8a89450cd0d657c15b4881165a0cdd46'

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 5000000
    },

    georli: {
      provider: () => new HDWalletProvider(mnemonic, `https://goerli.infura.io/v3/8eee0c711e3940ca855451a96c97c35a`),
      network_id: 5,
      gas: 5000000,
    },

  },
  compilers: {
    solc: {
      version: "0.8.17",
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200      // Default: 200
        },
      }
    }
  }
};
