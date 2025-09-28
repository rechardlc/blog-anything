import { task } from 'hardhat/config';
import { parseEther, formatEther, getContract, type Address } from 'viem';

// 已部署的合约地址
const EXCHANGE_ADDRESS =
  '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address;
const TOKEN_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' as Address;

// Exchange合约ABI (主要函数)
const EXCHANGE_ABI = [
  {
    type: 'constructor',
    inputs: [
      { name: '_feeAccount', type: 'address' },
      { name: '_feePercentage', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'depositEther',
    inputs: [],
    outputs: [],
    payable: true,
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'depositToken',
    inputs: [
      { name: '_token', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdrawEther',
    inputs: [{ name: '_amount', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdrawToken',
    inputs: [
      { name: '_token', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [
      { name: '_token', type: 'address' },
      { name: '_user', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'makeOrder',
    inputs: [
      { name: '_tokenGet', type: 'address' },
      { name: '_tokenGetAmount', type: 'uint256' },
      { name: '_tokenGive', type: 'address' },
      { name: '_tokenGiveAmount', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'cancelOrder',
    inputs: [{ name: '_orderHash', type: 'bytes32' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'fillOrder',
    inputs: [{ name: '_orderHash', type: 'bytes32' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getOrder',
    inputs: [{ name: '_orderHash', type: 'bytes32' }],
    outputs: [
      { name: 'id', type: 'uint256' },
      { name: 'user', type: 'address' },
      { name: 'tokenGet', type: 'address' },
      { name: 'tokenGetAmount', type: 'uint256' },
      { name: 'tokenGive', type: 'address' },
      { name: 'tokenGiveAmount', type: 'uint256' },
      { name: 'timestamp', type: 'uint256' },
      { name: 'filled', type: 'bool' },
      { name: 'cancelled', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'orderExists',
    inputs: [{ name: '_orderHash', type: 'bytes32' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'feeAccount',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'feePercentage',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'ETHER',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'Deposit',
    inputs: [
      { name: 'token', type: 'address', indexed: true },
      { name: 'user', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'balance', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'OrderCreated',
    inputs: [
      { name: 'orderHash', type: 'bytes32', indexed: true },
      { name: 'user', type: 'address', indexed: true },
      { name: 'tokenGet', type: 'address', indexed: false },
      { name: 'tokenGetAmount', type: 'uint256', indexed: false },
      { name: 'tokenGive', type: 'address', indexed: false },
      { name: 'tokenGiveAmount', type: 'uint256', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'OrderFilled',
    inputs: [
      { name: 'orderHash', type: 'bytes32', indexed: true },
      { name: 'user', type: 'address', indexed: true },
      { name: 'filler', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
] as const;

// RichardToken合约ABI (主要函数)
const TOKEN_ABI = [
  {
    type: 'function',
    name: 'transfer',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    outputs: [{ name: 'success', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    outputs: [{ name: 'success', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalSupply',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

task('exchange-test', '基于viem的Exchange合约功能测试')
  // @ts-expect-error - Hardhat 3类型定义问题的临时解决方案
  .setAction(async function (taskArgs, hre) {
    console.log('🚀 开始Exchange合约测试...\n');

    try {
      // 获取viem客户端和账户
      const publicClient = await hre.viem.getPublicClient();
      const [deployer, user1, user2] = await hre.viem.getWalletClients();

      console.log('📋 账户信息:');
      console.log(`部署者地址: ${deployer.account.address}`);
      console.log(`用户1地址: ${user1.account.address}`);
      console.log(`用户2地址: ${user2.account.address}\n`);

      // 获取合约实例
      const exchangeContract = getContract({
        address: EXCHANGE_ADDRESS,
        abi: EXCHANGE_ABI,
        client: { public: publicClient, wallet: deployer },
      }) as any;

      const tokenContract = getContract({
        address: TOKEN_ADDRESS,
        abi: TOKEN_ABI,
        client: { public: publicClient, wallet: deployer },
      }) as any;

      // 1. 查询合约基本信息
      console.log('📊 合约基本信息:');
      const feeAccount = await exchangeContract.read.feeAccount();
      const feePercentage = await exchangeContract.read.feePercentage();
      const etherAddress = await exchangeContract.read.ETHER();

      console.log(`收费账户: ${feeAccount}`);
      console.log(
        `收费比例: ${feePercentage}bp (${Number(feePercentage) / 100}%)`
      );
      console.log(`ETH地址常量: ${etherAddress}\n`);

      // 2. 测试代币相关功能
      console.log('🪙 测试代币功能:');

      // 查询代币总供应量和初始余额
      const totalSupply = await tokenContract.read.totalSupply();
      const deployerTokenBalance = await tokenContract.read.balanceOf([
        deployer.account.address,
      ]);

      console.log(`代币总供应量: ${formatEther(totalSupply)} RTK`);
      console.log(`部署者代币余额: ${formatEther(deployerTokenBalance)} RTK`);

      // 给user1转一些代币用于测试
      const transferAmount = parseEther('1000');
      console.log(`\n转账 ${formatEther(transferAmount)} RTK 给 user1...`);

      const transferHash = await tokenContract.write.transfer([
        user1.account.address,
        transferAmount,
      ]);
      await publicClient.waitForTransactionReceipt({ hash: transferHash });

      const user1TokenBalance = await tokenContract.read.balanceOf([
        user1.account.address,
      ]);
      console.log(`user1代币余额: ${formatEther(user1TokenBalance)} RTK ✅\n`);

      // 3. 测试ETH存取功能
      console.log('💰 测试ETH存取功能:');

      // 存入ETH
      const ethDepositAmount = parseEther('1');
      console.log(`user1存入 ${formatEther(ethDepositAmount)} ETH...`);

      const user1ExchangeContract = getContract({
        address: EXCHANGE_ADDRESS,
        abi: EXCHANGE_ABI,
        client: { public: publicClient, wallet: user1 },
      }) as any;

      const depositEthHash = await user1ExchangeContract.write.depositEther({
        value: ethDepositAmount,
      });
      await publicClient.waitForTransactionReceipt({ hash: depositEthHash });

      // 查询余额
      const user1EthBalance = await exchangeContract.read.balanceOf([
        etherAddress,
        user1.account.address,
      ]);
      console.log(
        `user1在交易所的ETH余额: ${formatEther(user1EthBalance)} ETH ✅`
      );

      // 4. 测试代币存取功能
      console.log(`\n🏦 测试代币存取功能:`);

      // 首先user1需要授权Exchange合约
      const approveAmount = parseEther('500');
      console.log(`user1授权Exchange合约 ${formatEther(approveAmount)} RTK...`);

      const user1TokenContract = getContract({
        address: TOKEN_ADDRESS,
        abi: TOKEN_ABI,
        client: { public: publicClient, wallet: user1 },
      }) as any;

      const approveHash = await user1TokenContract.write.approve([
        EXCHANGE_ADDRESS,
        approveAmount,
      ]);
      await publicClient.waitForTransactionReceipt({ hash: approveHash });
      console.log('授权成功 ✅');

      // 存入代币
      const tokenDepositAmount = parseEther('100');
      console.log(`user1存入 ${formatEther(tokenDepositAmount)} RTK...`);

      const depositTokenHash = await user1ExchangeContract.write.depositToken([
        TOKEN_ADDRESS,
        tokenDepositAmount,
      ]);
      await publicClient.waitForTransactionReceipt({ hash: depositTokenHash });

      const user1TokenBalanceInExchange = await exchangeContract.read.balanceOf(
        [TOKEN_ADDRESS, user1.account.address]
      );
      console.log(
        `user1在交易所的RTK余额: ${formatEther(user1TokenBalanceInExchange)} RTK ✅`
      );

      console.log('\n🎉 基础功能测试完成！Exchange合约存取功能正常运行。');
    } catch (error) {
      console.error('❌ 测试过程中出现错误:', error);
      throw error;
    }
  });
