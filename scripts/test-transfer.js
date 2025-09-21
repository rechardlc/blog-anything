// 在测试阶段，artifacts,web3没有引入，也可以直接使用
const RichardToken = artifacts.require('RichardToken');

function toWei(amount, decimals) {
  return web3.utils.toWei(amount, decimals);
}
function fromWei(amount, decimals) {
  return web3.utils.fromWei(amount, decimals);
}
module.exports = async function (callback) {
  try {
    // 获取合约实例
    const richardToken = await RichardToken.deployed();

    // 获取账户列表
    const accounts = await web3.eth.getAccounts();

    // 查询第一个账户的余额
    const balance = await richardToken.balanceOf(accounts[0]);
    console.log(`账户 ${accounts[0]} 的余额: ${fromWei(balance, 'ether')} RTK`);

    await richardToken.transfer(
      '0xF4Cd06F4EF86F97717625A4DE097AD6De177b532',
      toWei('100', 'ether'),
      {
        from: accounts[0],
      }
    );

    // 查询代币基本信息
    const name = await richardToken.NAME();
    const symbol = await richardToken.SYMBOL();
    const decimals = await richardToken.DECIMALS();
    const totalSupply = await richardToken.totalSupply();

    console.log(`代币名称: ${name}`);
    console.log(`代币符号: ${symbol}`);
    console.log(`小数位数: ${decimals}`);
    console.log(`总供应量: ${fromWei(totalSupply, 'ether')} RTK`);

    // 查询第一个账户的余额
    const balance2 = await richardToken.balanceOf(accounts[1]);
    console.log(
      `账户 ${accounts[1]} 的余额: ${fromWei(balance2, 'ether')} RTK`
    );
    console.log(`--------------------------------`);
  } catch (error) {
    console.error('测试失败:', error);
  }

  callback();
};
