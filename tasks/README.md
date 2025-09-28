# Exchange合约测试任务说明

本目录包含基于 viem 库编写的 Exchange 合约测试任务。

## 可用任务

### 1. exchange-test

基础功能测试，包括：

- 合约基本信息查询
- ETH 和代币的存取功能
- 用户余额查询

```bash
pnpm hardhat exchange-test
```

### 2. exchange-orders

高级订单功能测试，包括：

- 订单创建和查询
- 订单成交和手续费计算
- 订单取消功能
- 多用户交易场景

```bash
pnpm hardhat exchange-orders
```

### 3. simple-test

简单的连接测试，验证 hardhat 和 viem 配置是否正确

```bash
pnpm hardhat simple-test
```

## 前置要求

1. 确保本地区块链节点正在运行：

   ```bash
   pnpm hardhat node
   ```

2. 确保合约已部署到本地网络。如果没有，可以运行：
   ```bash
   pnpm hardhat ignition deploy ignition/modules/exchange.ts --network localhost
   ```

## 测试场景

测试任务会自动：

1. 设置测试用户和代币余额
2. 测试 ETH 和 RTK 代币的存取
3. 创建和管理订单
4. 验证交易和手续费计算
5. 输出详细的执行结果

## 注意事项

- 所有金额都使用 wei 为单位进行计算
- 手续费按照合约中设置的比例自动计算
- 测试使用的是已部署的合约地址，如果重新部署需要更新任务文件中的地址
