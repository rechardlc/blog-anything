import hre from 'hardhat';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 合约测试脚本系统
async function main() {
  // 从环境变量或命令行参数获取命令
  const command = process.env.COMMAND || process.argv[2];

  console.log('=== 合约测试脚本系统 ===');
  console.log('命令:', command);

  switch (command) {
    case 'info':
      await contractInfo();
      break;
    case 'balance':
      await contractBalance(process.env.ACCOUNT || process.argv[3]);
      break;
    case 'transfer':
      await contractTransfer(
        process.env.TO || process.argv[3],
        process.env.AMOUNT || process.argv[4],
        process.env.FROM || process.argv[5]
      );
      break;
    case 'approve':
      await contractApprove(
        process.env.SPENDER || process.argv[3],
        process.env.AMOUNT || process.argv[4],
        process.env.OWNER || process.argv[5]
      );
      break;
    case 'deposit':
      await contractDeposit(
        process.env.AMOUNT || process.argv[3],
        process.env.ACCOUNT || process.argv[4]
      );
      break;
    case 'test':
      await contractTest();
      break;
    default:
      console.log('可用命令:');
      console.log('  info                    - 查询合约基本信息');
      console.log('  balance [account]      - 查询账户余额');
      console.log('  transfer <to> <amount> [from] - 代币转账');
      console.log('  approve <spender> <amount> [owner] - 代币授权');
      console.log('  deposit <amount> [account] - 交易所存款');
      console.log('  test                    - 运行完整测试套件');
      console.log('');
      console.log('示例:');
      console.log('  npx hardhat run scripts/contract-test.ts info');
      console.log('  npx hardhat run scripts/contract-test.ts balance');
      console.log(
        '  npx hardhat run scripts/contract-test.ts transfer 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d 1000'
      );
      console.log('  npx hardhat run scripts/contract-test.ts test');
  }
}

// 查询合约基本信息
async function contractInfo() {
  console.log('=== 合约基本信息查询 ===');

  try {
    const deployedAddresses = await loadDeployedAddresses();

    console.log('合约地址:');
    Object.entries(deployedAddresses).forEach(([key, address]) => {
      console.log(`  ${key}: ${address}`);
    });

    // 查询 RichardToken 信息
    if (deployedAddresses['TokenModule#Token']) {
      console.log('\n=== RichardToken 信息 ===');
      await queryTokenInfo(deployedAddresses['TokenModule#Token']);
    }

    // 查询 Exchange 信息
    if (deployedAddresses['ExchangeModule#Exchange']) {
      console.log('\n=== Exchange 信息 ===');
      await queryExchangeInfo(deployedAddresses['ExchangeModule#Exchange']);
    }
  } catch (error) {
    console.error(
      '查询失败:',
      error instanceof Error ? error.message : String(error)
    );
  }
}

// 查询账户余额
async function contractBalance(accountAddress: string) {
  console.log('=== 账户余额查询 ===');

  try {
    const deployedAddresses = await loadDeployedAddresses();

    // 获取账户地址
    if (!accountAddress) {
      const accounts = hre.config.networks[hre.network.name]?.accounts;
      if (Array.isArray(accounts) && accounts.length > 0) {
        accountAddress = accounts[0];
      } else {
        throw new Error('未找到账户地址');
      }
    }

    console.log('查询账户:', accountAddress);

    // 查询代币余额
    if (deployedAddresses['TokenModule#Token']) {
      const tokenContract = await hre.viem.getContractAt(
        'RichardToken',
        deployedAddresses['TokenModule#Token']
      );
      const balance = await tokenContract.read.balanceOf([accountAddress]);
      console.log('代币余额:', balance.toString());
    }

    // 查询交易所余额
    if (
      deployedAddresses['ExchangeModule#Exchange'] &&
      deployedAddresses['TokenModule#Token']
    ) {
      const exchangeContract = await hre.viem.getContractAt(
        'Exchange',
        deployedAddresses['ExchangeModule#Exchange']
      );
      const exchangeBalance = await exchangeContract.read.balanceOf([
        deployedAddresses['TokenModule#Token'],
        accountAddress,
      ]);
      console.log('交易所代币余额:', exchangeBalance.toString());
    }
  } catch (error) {
    console.error(
      '查询失败:',
      error instanceof Error ? error.message : String(error)
    );
  }
}

// 代币转账
async function contractTransfer(
  toAddress: string,
  amount: string,
  fromAddress: string
) {
  console.log('=== 代币转账 ===');

  try {
    const deployedAddresses = await loadDeployedAddresses();

    // 获取发送方地址
    if (!fromAddress) {
      const accounts = hre.config.networks[hre.network.name]?.accounts;
      if (Array.isArray(accounts) && accounts.length > 0) {
        fromAddress = accounts[0];
      } else {
        throw new Error('未找到发送方账户地址');
      }
    }

    const transferAmount = BigInt(amount) * BigInt(10 ** 18); // 转换为 wei

    console.log('发送方:', fromAddress);
    console.log('接收方:', toAddress);
    console.log('转账数量:', amount, '代币');

    if (!deployedAddresses['TokenModule#Token']) {
      throw new Error('TokenModule#Token 合约地址未找到');
    }

    const tokenContract = await hre.viem.getContractAt(
      'RichardToken',
      deployedAddresses['TokenModule#Token']
    );
    const publicClient = await hre.viem.getPublicClient();

    // 查询转账前余额
    const fromBalanceBefore = await tokenContract.read.balanceOf([fromAddress]);
    const toBalanceBefore = await tokenContract.read.balanceOf([toAddress]);

    console.log('转账前余额:');
    console.log('  发送方:', fromBalanceBefore.toString());
    console.log('  接收方:', toBalanceBefore.toString());

    // 执行转账
    const transferTx = await tokenContract.write.transfer([
      toAddress,
      transferAmount,
    ]);

    console.log('转账交易哈希:', transferTx);

    // 等待交易确认
    await publicClient.waitForTransactionReceipt({ hash: transferTx });
    console.log('转账成功！');

    // 查询转账后余额
    const fromBalanceAfter = await tokenContract.read.balanceOf([fromAddress]);
    const toBalanceAfter = await tokenContract.read.balanceOf([toAddress]);

    console.log('转账后余额:');
    console.log('  发送方:', fromBalanceAfter.toString());
    console.log('  接收方:', toBalanceAfter.toString());
  } catch (error) {
    console.error(
      '转账失败:',
      error instanceof Error ? error.message : String(error)
    );
  }
}

// 代币授权
async function contractApprove(
  spenderAddress: string,
  amount: string,
  ownerAddress: string
) {
  console.log('=== 代币授权 ===');

  try {
    const deployedAddresses = await loadDeployedAddresses();

    // 获取授权方地址
    if (!ownerAddress) {
      const accounts = hre.config.networks[hre.network.name]?.accounts;
      if (Array.isArray(accounts) && accounts.length > 0) {
        ownerAddress = accounts[0];
      } else {
        throw new Error('未找到授权方账户地址');
      }
    }

    const approveAmount = BigInt(amount) * BigInt(10 ** 18); // 转换为 wei

    console.log('授权方:', ownerAddress);
    console.log('被授权方:', spenderAddress);
    console.log('授权数量:', amount, '代币');

    if (!deployedAddresses['TokenModule#Token']) {
      throw new Error('TokenModule#Token 合约地址未找到');
    }

    const tokenContract = await hre.viem.getContractAt(
      'RichardToken',
      deployedAddresses['TokenModule#Token']
    );
    const publicClient = await hre.viem.getPublicClient();

    // 执行授权
    const approveTx = await tokenContract.write.approve([
      spenderAddress,
      approveAmount,
    ]);

    console.log('授权交易哈希:', approveTx);

    // 等待交易确认
    await publicClient.waitForTransactionReceipt({ hash: approveTx });
    console.log('授权成功！');

    // 查询授权额度
    const allowance = await tokenContract.read.allowance([
      ownerAddress,
      spenderAddress,
    ]);
    console.log('当前授权额度:', allowance.toString());
  } catch (error) {
    console.error(
      '授权失败:',
      error instanceof Error ? error.message : String(error)
    );
  }
}

// 交易所存款
async function contractDeposit(amount: string, accountAddress: string) {
  console.log('=== 交易所存款 ===');

  try {
    const deployedAddresses = await loadDeployedAddresses();

    // 获取账户地址
    if (!accountAddress) {
      const accounts = hre.config.networks[hre.network.name]?.accounts;
      if (Array.isArray(accounts) && accounts.length > 0) {
        accountAddress = accounts[0];
      } else {
        throw new Error('未找到账户地址');
      }
    }

    const depositAmount = BigInt(amount) * BigInt(10 ** 18); // 转换为 wei

    console.log('存款账户:', accountAddress);
    console.log('存款数量:', amount, '代币');

    if (
      !deployedAddresses['TokenModule#Token'] ||
      !deployedAddresses['ExchangeModule#Exchange']
    ) {
      throw new Error('合约地址未找到');
    }

    const tokenContract = await hre.viem.getContractAt(
      'RichardToken',
      deployedAddresses['TokenModule#Token']
    );
    const exchangeContract = await hre.viem.getContractAt(
      'Exchange',
      deployedAddresses['ExchangeModule#Exchange']
    );
    const publicClient = await hre.viem.getPublicClient();

    // 先授权交易所使用代币
    console.log('授权交易所使用代币...');
    const approveTx = await tokenContract.write.approve([
      deployedAddresses['ExchangeModule#Exchange'],
      depositAmount,
    ]);
    await publicClient.waitForTransactionReceipt({ hash: approveTx });
    console.log('授权成功！');

    // 查询存款前余额
    const balanceBefore = await exchangeContract.read.balanceOf([
      deployedAddresses['TokenModule#Token'],
      accountAddress,
    ]);
    console.log('存款前交易所余额:', balanceBefore.toString());

    // 执行存款
    const depositTx = await exchangeContract.write.depositToken([
      deployedAddresses['TokenModule#Token'],
      depositAmount,
    ]);

    console.log('存款交易哈希:', depositTx);

    // 等待交易确认
    await publicClient.waitForTransactionReceipt({ hash: depositTx });
    console.log('存款成功！');

    // 查询存款后余额
    const balanceAfter = await exchangeContract.read.balanceOf([
      deployedAddresses['TokenModule#Token'],
      accountAddress,
    ]);
    console.log('存款后交易所余额:', balanceAfter.toString());
  } catch (error) {
    console.error(
      '存款失败:',
      error instanceof Error ? error.message : String(error)
    );
  }
}

// 运行完整测试套件
async function contractTest() {
  console.log('=== 完整合约测试套件 ===');

  try {
    const deployedAddresses = await loadDeployedAddresses();
    const accounts = hre.config.networks[hre.network.name]?.accounts;

    if (!Array.isArray(accounts) || accounts.length < 2) {
      throw new Error('需要至少 2 个账户来运行测试');
    }

    const account1 = accounts[0];
    const account2 = accounts[1];

    console.log('测试账户:');
    console.log('  账户1:', account1);
    console.log('  账户2:', account2);

    // 测试 1: 查询合约信息
    console.log('\n--- 测试 1: 查询合约信息 ---');
    await queryTokenInfo(deployedAddresses['TokenModule#Token']);
    await queryExchangeInfo(deployedAddresses['ExchangeModule#Exchange']);

    // 测试 2: 代币转账
    console.log('\n--- 测试 2: 代币转账 ---');
    const transferAmount = BigInt(1000) * BigInt(10 ** 18);
    const tokenContract = await hre.viem.getContractAt(
      'RichardToken',
      deployedAddresses['TokenModule#Token']
    );
    const publicClient = await hre.viem.getPublicClient();

    const transferTx = await tokenContract.write.transfer([
      account2,
      transferAmount,
    ]);
    await publicClient.waitForTransactionReceipt({ hash: transferTx });
    console.log('转账测试成功');

    // 测试 3: 代币授权
    console.log('\n--- 测试 3: 代币授权 ---');
    const approveAmount = BigInt(500) * BigInt(10 ** 18);

    const approveTx = await tokenContract.write.approve([
      account2,
      approveAmount,
    ]);
    await publicClient.waitForTransactionReceipt({ hash: approveTx });
    console.log('授权测试成功');

    // 测试 4: 交易所存款
    console.log('\n--- 测试 4: 交易所存款 ---');
    const depositAmount = BigInt(200) * BigInt(10 ** 18);
    const exchangeContract = await hre.viem.getContractAt(
      'Exchange',
      deployedAddresses['ExchangeModule#Exchange']
    );

    // 先授权
    const approveExchangeTx = await tokenContract.write.approve([
      deployedAddresses['ExchangeModule#Exchange'],
      depositAmount,
    ]);
    await publicClient.waitForTransactionReceipt({ hash: approveExchangeTx });

    // 再存款
    const depositTx = await exchangeContract.write.depositToken([
      deployedAddresses['TokenModule#Token'],
      depositAmount,
    ]);
    await publicClient.waitForTransactionReceipt({ hash: depositTx });
    console.log('存款测试成功');

    console.log('\n=== 测试套件完成 ===');
  } catch (error) {
    console.error(
      '测试失败:',
      error instanceof Error ? error.message : String(error)
    );
  }
}

// 辅助函数：加载部署地址
async function loadDeployedAddresses() {
  const deployedAddressesPath = path.join(
    __dirname,
    '../ignition/deployments/chain-31337/deployed_addresses.json'
  );

  if (!fs.existsSync(deployedAddressesPath)) {
    throw new Error(`部署文件不存在: ${deployedAddressesPath}`);
  }

  return JSON.parse(fs.readFileSync(deployedAddressesPath, 'utf8'));
}

// 辅助函数：查询代币信息
async function queryTokenInfo(tokenAddress: string) {
  const tokenContract = await hre.viem.getContractAt(
    'RichardToken',
    tokenAddress
  );

  const name = await tokenContract.read.NAME();
  const symbol = await tokenContract.read.SYMBOL();
  const decimals = await tokenContract.read.DECIMALS();
  const totalSupply = await tokenContract.read.totalSupply();

  console.log('  代币名称:', name);
  console.log('  代币符号:', symbol);
  console.log('  小数位数:', decimals);
  console.log('  总供应量:', totalSupply.toString());
}

// 辅助函数：查询交易所信息
async function queryExchangeInfo(exchangeAddress: string) {
  const exchangeContract = await hre.viem.getContractAt(
    'Exchange',
    exchangeAddress
  );

  const feeAccount = await exchangeContract.read.feeAccount();
  const feePercentage = await exchangeContract.read.feePercentage();

  console.log('  手续费账户:', feeAccount);
  console.log('  手续费比例:', feePercentage.toString(), 'bp');
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
