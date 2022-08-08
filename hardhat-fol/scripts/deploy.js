const { ethers } = require('hardhat');

async function main() {
  // create contract factory
  const whitelistContract = await ethers.getContractFactory('Whitelist');
  // deploy contract, set maxAddresses to 10
  const deployedContract = await whitelistContract.deploy(10);

  // wait for deployment
  await deployedContract.deployed();

  // print address of deployed contract
  console.log('Whitelist contract deployed at ', deployedContract.address);
}

// call the main fn properly
main()
  .then(() => process.exit(1))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
