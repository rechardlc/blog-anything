import { task } from 'hardhat/config';
import { parseEther, formatEther, getContract, type Address } from 'viem';

// 已部署的合约地址
const EXCHANGE_ADDRESS =
  '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address;
const TOKEN_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' as Address;

// Exchange合约完整ABI
const EXCHANGE_ABI = [
  {
    type: 'function',
    name: 'depositEther',
    inputs: [],
    outputs: [],
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
    name: 'OrderCancelled',
    inputs: [
      { name: 'orderHash', type: 'bytes32', indexed: true },
      { name: 'user', type: 'address', indexed: true },
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

// RichardToken合约ABI
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
] as const;

task('exchange-orders', '测试Exchange合约的订单功能')
  // @ts-expect-error - Hardhat 3类型定义问题的临时解决方案
  .setAction(async function (taskArgs, hre) {
    console.log('🔄 开始Exchange订单功能测试...\n');

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

      // 查询基本信息
      const feeAccount = await exchangeContract.read.feeAccount();
      const feePercentage = await exchangeContract.read.feePercentage();
      const etherAddress = await exchangeContract.read.ETHER();

      console.log('📊 合约信息:');
      console.log(`收费账户: ${feeAccount}`);
      console.log(
        `收费比例: ${feePercentage}bp (${Number(feePercentage) / 100}%)`
      );

      // 准备测试数据
      console.log('\n🔧 准备测试数据...');

      // 给用户转代币
      await tokenContract.write.transfer([
        user1.account.address,
        parseEther('1000'),
      ]);
      await tokenContract.write.transfer([
        user2.account.address,
        parseEther('1000'),
      ]);

      // 创建用户合约实例
      const user1ExchangeContract = getContract({
        address: EXCHANGE_ADDRESS,
        abi: EXCHANGE_ABI,
        client: { public: publicClient, wallet: user1 },
      }) as any;

      const user2ExchangeContract = getContract({
        address: EXCHANGE_ADDRESS,
        abi: EXCHANGE_ABI,
        client: { public: publicClient, wallet: user2 },
      }) as any;

      const user1TokenContract = getContract({
        address: TOKEN_ADDRESS,
        abi: TOKEN_ABI,
        client: { public: publicClient, wallet: user1 },
      }) as any;

      const user2TokenContract = getContract({
        address: TOKEN_ADDRESS,
        abi: TOKEN_ABI,
        client: { public: publicClient, wallet: user2 },
      }) as any;

      // 用户存入资金
      console.log('💰 用户存入资金...');

      // user1存入ETH和RTK
      await user1ExchangeContract.write.depositEther({
        value: parseEther('2'),
      });
      await user1TokenContract.write.approve([
        EXCHANGE_ADDRESS,
        parseEther('500'),
      ]);
      await user1ExchangeContract.write.depositToken([
        TOKEN_ADDRESS,
        parseEther('200'),
      ]);

      // user2存入ETH和RTK
      await user2ExchangeContract.write.depositEther({
        value: parseEther('2'),
      });
      await user2TokenContract.write.approve([
        EXCHANGE_ADDRESS,
        parseEther('500'),
      ]);
      await user2ExchangeContract.write.depositToken([
        TOKEN_ADDRESS,
        parseEther('200'),
      ]);

      console.log('资金存入完成 ✅\n');

      // 测试订单创建
      console.log('📝 测试订单创建功能:');

      // user1创建卖单：用100 RTK换取0.1 ETH
      const tokenGiveAmount = parseEther('100');
      const tokenGetAmount = parseEther('0.1');

      console.log(
        `user1创建订单: 卖出 ${formatEther(tokenGiveAmount)} RTK，买入 ${formatEther(tokenGetAmount)} ETH`
      );

      const makeOrderTx = await user1ExchangeContract.write.makeOrder([
        etherAddress, // tokenGet (想要获得ETH)
        tokenGetAmount, // tokenGetAmount
        TOKEN_ADDRESS, // tokenGive (给出RTK)
        tokenGiveAmount, // tokenGiveAmount
      ]);

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: makeOrderTx,
      });

      // 从事件日志中获取订单哈希
      const orderCreatedLog = receipt.logs.find(
        (log: any) =>
          log.address.toLowerCase() === EXCHANGE_ADDRESS.toLowerCase() &&
          log.topics[0] // 确保有topic
      );

      if (!orderCreatedLog || !orderCreatedLog.topics[1]) {
        throw new Error('无法找到OrderCreated事件');
      }

      const orderHash = orderCreatedLog.topics[1];
      console.log(`订单创建成功，订单哈希: ${orderHash} ✅`);

      // 验证订单信息
      const orderInfo = await exchangeContract.read.getOrder([orderHash]);
      console.log(`订单详情:`);
      console.log(`  创建者: ${orderInfo[1]}`);
      console.log(`  要获得: ${formatEther(orderInfo[3])} ETH`);
      console.log(`  要给出: ${formatEther(orderInfo[5])} RTK`);
      console.log(`  已成交: ${orderInfo[7]}`);
      console.log(`  已取消: ${orderInfo[8]}`);

      // 测试订单成交功能
      console.log(`\n💱 测试订单成交功能:`);

      // 查询成交前余额
      const user1EthBefore = await exchangeContract.read.balanceOf([
        etherAddress,
        user1.account.address,
      ]);
      const user1TokenBefore = await exchangeContract.read.balanceOf([
        TOKEN_ADDRESS,
        user1.account.address,
      ]);
      const user2EthBefore = await exchangeContract.read.balanceOf([
        etherAddress,
        user2.account.address,
      ]);
      const user2TokenBefore = await exchangeContract.read.balanceOf([
        TOKEN_ADDRESS,
        user2.account.address,
      ]);
      const feeAccountEthBefore = await exchangeContract.read.balanceOf([
        etherAddress,
        feeAccount,
      ]);

      console.log(`成交前余额:`);
      console.log(
        `  user1: ${formatEther(user1EthBefore)} ETH, ${formatEther(user1TokenBefore)} RTK`
      );
      console.log(
        `  user2: ${formatEther(user2EthBefore)} ETH, ${formatEther(user2TokenBefore)} RTK`
      );
      console.log(`  手续费账户: ${formatEther(feeAccountEthBefore)} ETH`);

      // user2成交订单
      console.log(`\nuser2成交订单...`);
      await user2ExchangeContract.write.fillOrder([orderHash]);

      // 查询成交后余额
      const user1EthAfter = await exchangeContract.read.balanceOf([
        etherAddress,
        user1.account.address,
      ]);
      const user1TokenAfter = await exchangeContract.read.balanceOf([
        TOKEN_ADDRESS,
        user1.account.address,
      ]);
      const user2EthAfter = await exchangeContract.read.balanceOf([
        etherAddress,
        user2.account.address,
      ]);
      const user2TokenAfter = await exchangeContract.read.balanceOf([
        TOKEN_ADDRESS,
        user2.account.address,
      ]);
      const feeAccountEthAfter = await exchangeContract.read.balanceOf([
        etherAddress,
        feeAccount,
      ]);

      console.log(`成交后余额:`);
      console.log(
        `  user1: ${formatEther(user1EthAfter)} ETH, ${formatEther(user1TokenAfter)} RTK`
      );
      console.log(
        `  user2: ${formatEther(user2EthAfter)} ETH, ${formatEther(user2TokenAfter)} RTK`
      );
      console.log(`  手续费账户: ${formatEther(feeAccountEthAfter)} ETH`);

      // 计算变化
      const user1EthChange = user1EthAfter - user1EthBefore;
      const user1TokenChange = user1TokenAfter - user1TokenBefore;
      const user2EthChange = user2EthAfter - user2EthBefore;
      const user2TokenChange = user2TokenAfter - user2TokenBefore;
      const feeChange = feeAccountEthAfter - feeAccountEthBefore;

      console.log(`\n💰 余额变化:`);
      console.log(
        `  user1: ${user1EthChange > 0n ? '+' : ''}${formatEther(user1EthChange)} ETH, ${user1TokenChange > 0n ? '+' : ''}${formatEther(user1TokenChange)} RTK`
      );
      console.log(
        `  user2: ${user2EthChange > 0n ? '+' : ''}${formatEther(user2EthChange)} ETH, ${user2TokenChange > 0n ? '+' : ''}${formatEther(user2TokenChange)} RTK`
      );
      console.log(`  手续费: +${formatEther(feeChange)} ETH`);

      // 验证订单状态
      const filledOrderInfo = await exchangeContract.read.getOrder([orderHash]);
      console.log(`\n订单最终状态: 已成交=${filledOrderInfo[7]} ✅`);

      // 测试订单取消功能
      console.log(`\n❌ 测试订单取消功能:`);

      // user1创建另一个订单用于取消测试
      console.log(`user1创建新订单用于取消测试...`);
      const cancelOrderTx = await user1ExchangeContract.write.makeOrder([
        etherAddress,
        parseEther('0.05'),
        TOKEN_ADDRESS,
        parseEther('50'),
      ]);

      const cancelReceipt = await publicClient.waitForTransactionReceipt({
        hash: cancelOrderTx,
      });
      const cancelOrderLog = cancelReceipt.logs.find(
        log => log.address.toLowerCase() === EXCHANGE_ADDRESS.toLowerCase()
      );

      if (!cancelOrderLog || !cancelOrderLog.topics[1]) {
        throw new Error('无法找到OrderCreated事件');
      }

      const cancelOrderHash = cancelOrderLog.topics[1];
      console.log(`新订单创建成功，哈希: ${cancelOrderHash}`);

      // 取消订单
      console.log(`user1取消订单...`);
      await user1ExchangeContract.write.cancelOrder([cancelOrderHash]);

      // 验证取消状态
      const cancelledOrderInfo = await exchangeContract.read.getOrder([
        cancelOrderHash,
      ]);
      console.log(`订单取消状态: 已取消=${cancelledOrderInfo[8]} ✅`);

      console.log('\n🎉 所有订单功能测试完成！Exchange合约运行正常。');
    } catch (error) {
      console.error('❌ 测试过程中出现错误:', error);
      throw error;
    }
  });
