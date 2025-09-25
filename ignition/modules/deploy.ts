const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ehters.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  const MyToken = await hre.ethers.getContractFactory('MyToken');
  const myToken = await MyToken.deploy();

  await myToken.waitForDeployment();
  console.log('MyToken deployed to:', await myToken.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
