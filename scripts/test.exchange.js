const Exchange = artifacts.require('Exchange');
module.exports = async function (callback) {
  try {
    const exchange = await Exchange.deployed();
    const accounts = await web3.eth.getAccounts();
    await exchange.depositEther({
      from: accounts[0],
      value: web3.utils.toWei('100', 'ether'),
    });
    const balance = await exchange.tokens(
      '0x0000000000000000000000000000000000000000',
      accounts[0]
    );
    console.log(web3.utils.fromWei(balance, 'ether'));
    console.log('depositEther success');
  } catch (error) {
    console.error(error);
  }
  callback();
};
