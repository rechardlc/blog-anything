const Exchange = artifacts.require('Exchange');
const RichardToken = artifacts.require('RichardToken');

function toWei(amount, decimals) {
  return web3.utils.toWei(amount, decimals);
}

function fromWei(amount, decimals) {
  return web3.utils.fromWei(amount, decimals);
}

module.exports = async function (callback) {
  try {
    console.log('=== Exchange 合约功能测试 ===\n');

    // 获取合约实例
    const exchange = await Exchange.deployed();
    const richardToken = await RichardToken.deployed();
    const accounts = await web3.eth.getAccounts();

    console.log('合约地址:');
    console.log(`Exchange: ${exchange.address}`);
    console.log(`RichardToken: ${richardToken.address}`);
    console.log(`测试账户: ${accounts[0]}\n`);

    // 1. 测试合约基本信息
    console.log('1. 合约基本信息:');
    const feeAccount = await exchange.feeAccount();
    const feePercentage = await exchange.feePercentage();
    const etherAddress = await exchange.ETHER();
    console.log(`收费账户: ${feeAccount}`);
    console.log(`收费比例: ${feePercentage} (${feePercentage / 10000}%)`);
    console.log(`ETH 地址: ${etherAddress}\n`);
    console.log(`合约地址: ${exchange.address}\n`);
    console.log(`代币地址: ${richardToken.address}\n`);

    // 2. 测试 ETH 存款功能
    console.log('2. 测试 ETH 存款功能:');
    const depositAmount = toWei('10', 'ether');
    console.log(`存款金额: ${fromWei(depositAmount, 'ether')} ETH`);

    const tx1 = await exchange.depositEther({
      from: accounts[0],
      value: depositAmount,
    });
    console.log(`交易哈希: ${tx1.tx}`);

    /*
      const tokens = {
         合约地址： {
            发送者地址： 发送额度
         }
      }

    */
    const ethBalance = await exchange.tokens(etherAddress, accounts[0]);
    console.log(`ETH 余额: ${fromWei(ethBalance, 'ether')} ETH\n`);

    // 3. 测试代币存款功能
    console.log('3. 测试代币存款功能:');

    // 首先需要授权 Exchange 合约使用代币
    const tokenAmount = toWei('1000', 'ether');
    console.log(`授权金额: ${fromWei(tokenAmount, 'ether')} RTK`);

    const approveTx = await richardToken.approve(
      exchange.address, // 授权的合约的地址
      tokenAmount,
      {
        from: accounts[0],
      }
    );
    console.log(`授权交易: ${approveTx.tx}`);

    // 然后存款代币
    const depositTokenTx = await exchange.depositToken(
      richardToken.address, // 合约部署地址
      tokenAmount,
      {
        from: accounts[0],
      }
    );
    console.log(`存款交易: ${depositTokenTx.tx}`);

    const tokenBalance = await exchange.tokens(
      richardToken.address,
      accounts[0]
    );
    console.log(`代币余额: ${fromWei(tokenBalance, 'ether')} RTK\n`);

    // 4. 测试 ETH 提取功能
    console.log('4. 测试 ETH 提取功能:');
    const withdrawAmount = toWei('5', 'ether');
    console.log(`提取金额: ${fromWei(withdrawAmount, 'ether')} ETH`);

    const withdrawTx = await exchange.withdrawEther(withdrawAmount, {
      from: accounts[0],
    });
    console.log(`提取交易: ${withdrawTx.tx}`);

    const ethBalanceAfter = await exchange.tokens(etherAddress, accounts[0]);
    console.log(`提取后 ETH 余额: ${fromWei(ethBalanceAfter, 'ether')} ETH\n`);

    // 5. 测试代币提取功能
    console.log('5. 测试代币提取功能:');
    const withdrawTokenAmount = toWei('500', 'ether');
    console.log(`提取代币金额: ${fromWei(withdrawTokenAmount, 'ether')} RTK`);

    // 检查提取前的代币余额
    const tokenBalanceBefore = await exchange.tokens(
      richardToken.address,
      accounts[0]
    );
    console.log(`提取前代币余额: ${fromWei(tokenBalanceBefore, 'ether')} RTK`);

    // 检查用户钱包中的代币余额
    const walletBalanceBefore = await richardToken.balanceOf(accounts[0]);
    console.log(
      `提取前钱包代币余额: ${fromWei(walletBalanceBefore, 'ether')} RTK`
    );

    const withdrawTokenTx = await exchange.withdrawToken(
      richardToken.address,
      withdrawTokenAmount,
      {
        from: accounts[0],
      }
    );
    console.log(`代币提取交易: ${withdrawTokenTx.tx}`);

    // 检查提取后的代币余额
    const tokenBalanceAfter = await exchange.tokens(
      richardToken.address,
      accounts[0]
    );
    console.log(`提取后代币余额: ${fromWei(tokenBalanceAfter, 'ether')} RTK`);

    // 检查用户钱包中的代币余额
    const walletBalanceAfter = await richardToken.balanceOf(accounts[0]);
    console.log(
      `提取后钱包代币余额: ${fromWei(walletBalanceAfter, 'ether')} RTK\n`
    );

    // 6. 测试事件日志
    console.log('6. 检查事件日志:');

    // 获取 Deposit 事件
    const depositEvents = await exchange.getPastEvents('Deposit', {
      fromBlock: 0,
      toBlock: 'latest',
    });
    console.log(`找到 ${depositEvents.length} 个存款事件`);

    // 获取 Withdraw 事件
    const withdrawEvents = await exchange.getPastEvents('Withdraw', {
      fromBlock: 0,
      toBlock: 'latest',
    });
    console.log(`找到 ${withdrawEvents.length} 个提取事件\n`);

    // 7. 测试错误情况
    console.log('7. 测试错误情况:');

    try {
      // 尝试提取超过余额的 ETH
      await exchange.withdrawEther(toWei('100', 'ether'), {
        from: accounts[0],
      });
      console.log('❌ 应该抛出错误但没有');
    } catch (error) {
      console.log('✅ 正确捕获了余额不足错误');
    }

    try {
      // 尝试存款 ETH 到代币地址
      await exchange.depositToken(etherAddress, toWei('1', 'ether'), {
        from: accounts[0],
      });
      console.log('❌ 应该抛出错误但没有');
    } catch (error) {
      console.log('✅ 正确捕获了不允许存款 ETH 的错误');
    }

    try {
      // 尝试提取超过余额的代币
      await exchange.withdrawToken(
        richardToken.address,
        toWei('10000', 'ether'),
        {
          from: accounts[0],
        }
      );
      console.log('❌ 应该抛出错误但没有');
    } catch (error) {
      console.log('✅ 正确捕获了代币余额不足错误');
    }

    try {
      // 尝试提取 ETH 到代币地址
      await exchange.withdrawToken(etherAddress, toWei('1', 'ether'), {
        from: accounts[0],
      });
      console.log('❌ 应该抛出错误但没有');
    } catch (error) {
      console.log('✅ 正确捕获了不允许提取 ETH 的错误');
    }

    try {
      // 尝试提取 0 数量的代币
      await exchange.withdrawToken(richardToken.address, 0, {
        from: accounts[0],
      });
      console.log('❌ 应该抛出错误但没有');
    } catch (error) {
      console.log('✅ 正确捕获了数量必须大于 0 的错误');
    }

    console.log('\n=== 测试完成 ===');
    console.log('✅ Exchange 合约功能验证成功！');
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }

  callback();
};
