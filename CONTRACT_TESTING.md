# 合约测试系统

这是一个基于 Hardhat 的合约测试系统，用于测试已部署的 RichardToken 和 Exchange 合约。

## 🚀 快速开始

### 1. 启动测试环境

```bash
# 启动本地网络
pnpm ht-local:hnp

# 部署合约
pnpm ht-deploy
```

### 2. 运行测试

```bash
# 查看测试套件
npx hardhat run scripts/contract-test-suite.ts --network localhost

# 查看合约信息
npx hardhat run scripts/contract-info.ts --network localhost
```

## 📋 测试脚本

| 脚本                     | 功能         | 命令                                                                     |
| ------------------------ | ------------ | ------------------------------------------------------------------------ |
| `contract-test-suite.ts` | 测试套件概览 | `npx hardhat run scripts/contract-test-suite.ts --network localhost`     |
| `contract-info.ts`       | 合约基本信息 | `npx hardhat run scripts/contract-info.ts --network localhost`           |
| `contract-test.ts`       | 交互式测试   | `npx hardhat run scripts/contract-test.ts <command> --network localhost` |

## 🔧 交互式测试命令

使用 `contract-test.ts` 脚本可以进行交互式测试：

```bash
# 查询合约信息
npx hardhat run scripts/contract-test.ts info --network localhost

# 查询账户余额
npx hardhat run scripts/contract-test.ts balance --network localhost

# 代币转账
npx hardhat run scripts/contract-test.ts transfer 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d 1000 --network localhost

# 代币授权
npx hardhat run scripts/contract-test.ts approve 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d 500 --network localhost

# 交易所存款
npx hardhat run scripts/contract-test.ts deposit 200 --network localhost

# 运行完整测试套件
npx hardhat run scripts/contract-test.ts test --network localhost
```

## 📊 测试内容

### 1. 合约部署验证

- ✅ 验证合约地址存在
- ✅ 验证部署文件完整性

### 2. 代币合约测试

- ⏳ 查询代币基本信息（名称、符号、小数位数、总供应量）
- ⏳ 查询账户代币余额
- ⏳ 代币转账功能测试
- ⏳ 代币授权功能测试

### 3. 交易所合约测试

- ⏳ 查询交易所基本信息（手续费账户、手续费比例）
- ⏳ 查询账户在交易所的余额
- ⏳ 交易所存款功能测试
- ⏳ 交易所提取功能测试

## 🌐 网络配置

### 本地网络

- **网络名称**: localhost
- **链 ID**: 31337
- **RPC URL**: http://localhost:8545

### 测试账户

- **账户1**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- **账户2**: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`

## 📁 文件结构

```
scripts/
├── contract-test-suite.ts    # 测试套件概览
├── contract-info.ts          # 合约信息查询
├── contract-test.ts          # 交互式测试脚本
└── check-package-manager.js  # 包管理器检查工具

ignition/
└── deployments/
    └── chain-31337/
        └── deployed_addresses.json  # 部署地址文件
```

## 🔍 故障排除

### 1. 部署文件不存在

```
错误: 部署文件不存在
解决: 运行 pnpm ht-deploy 部署合约
```

### 2. 网络连接失败

```
错误: HTTP request failed
解决: 确保本地网络正在运行 (pnpm ht-local:hnp)
```

### 3. 合约调用失败

```
错误: Cannot read properties of undefined
解决: 确保使用正确的网络参数 --network localhost
```

## 📝 使用示例

### 完整的测试流程

```bash
# 1. 启动环境
pnpm ht-dev:up

# 2. 查看测试套件
npx hardhat run scripts/contract-test-suite.ts --network localhost

# 3. 查看合约信息
npx hardhat run scripts/contract-info.ts --network localhost

# 4. 运行交互测试
npx hardhat run scripts/contract-test.ts test --network localhost
```

### 单独测试功能

```bash
# 查询余额
npx hardhat run scripts/contract-test.ts balance --network localhost

# 执行转账
npx hardhat run scripts/contract-test.ts transfer 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d 1000 --network localhost

# 执行授权
npx hardhat run scripts/contract-test.ts approve 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d 500 --network localhost
```

## 🎯 下一步

1. **启动本地网络**: `pnpm ht-local:hnp`
2. **部署合约**: `pnpm ht-deploy`
3. **运行测试**: `npx hardhat run scripts/contract-test-suite.ts --network localhost`
4. **开始交互**: `npx hardhat run scripts/contract-test.ts test --network localhost`

---

**注意**: 所有交互测试都需要本地网络运行。如果网络未启动，脚本将显示错误信息。
