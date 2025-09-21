const Exchange = artifacts.require('Exchange');
const RichardToken = artifacts.require('RichardToken');

module.exports = async function (deployer, network, accounts) {
  // 部署 RichardToken 合约
  await deployer.deploy(RichardToken);

  // 部署 Exchange 合约
  // 使用 accounts[0] 作为收费账户，1000 作为收费比例（0.1%）
  await deployer.deploy(Exchange, accounts[0], 1000);
};
