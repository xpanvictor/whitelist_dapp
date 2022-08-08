require('@nomiclabs/hardhat-waffle');
require('dotenv').config({ path: '.env' });

const API_KEY_URL = process.env.API_KEY_URL;

const RINKEBY_KEY = process.env.RINKEBY_KEY;

module.exports = {
  solidity: '0.8.9',
  networks: {
    rinkeby: {
      url: API_KEY_URL,
      accounts: [RINKEBY_KEY],
    },
  },
};
