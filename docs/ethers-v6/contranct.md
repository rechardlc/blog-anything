# Ethers.js v6 Contract 完全指南

## 概述

在以太坊开发中，`Contract` 是 ethers.js 库中最重要的类之一，它提供了与智能合约交互的完整接口。本文将深入探讨 Contract 的用法、注意事项和业务常用逻辑。

## 目录

- [基本概念](#基本概念)
- [创建 Contract 实例](#创建-contract-实例)
- [读取合约数据](#读取合约数据)
- [发送交易](#发送交易)
- [事件监听](#事件监听)
- [错误处理](#错误处理)
- [业务常用逻辑](#业务常用逻辑)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)

## 基本概念

### Contract 类的作用

`Contract` 类是一个 JavaScript 对象，它：

- 封装了智能合约的地址和 ABI
- 提供了调用合约方法的接口
- 处理交易发送和事件监听
- 管理 gas 费用和交易确认

### 核心组件

```typescript
import { Contract, BrowserProvider } from 'ethers';

// Contract 的三个核心参数
const contract = new Contract(
  address, // 合约地址
  abi, // 合约 ABI (Application Binary Interface)
  provider, // Provider 或 Signer
);
```

## 创建 Contract 实例

### 1. 使用 Provider（只读操作）

```typescript
import { Contract, BrowserProvider } from 'ethers';
import TokenArtifact from '@/artifacts/contracts/RichardToken.sol/RichardToken.json';

// 创建只读合约实例
const provider = new BrowserProvider(window.ethereum);
const tokenContract = new Contract('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', TokenArtifact.abi, provider);

// 只能调用 view/pure 函数
const balance = await tokenContract.balanceOf(userAddress);
const totalSupply = await tokenContract.totalSupply();
```

### 2. 使用 Signer（可写操作）

```typescript
import { Contract, BrowserProvider } from 'ethers';

// 创建可写合约实例
const provider = new BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const tokenContract = new Contract(CONTRACT_ADDRESSES.RICHARD_TOKEN, TokenArtifact.abi, signer);

// 可以调用所有函数，包括需要 gas 的函数
const tx = await tokenContract.transfer(toAddress, amount);
await tx.wait(); // 等待交易确认
```

### 3. 工厂函数模式

```typescript
// 创建合约工厂函数
export function getContracts(provider: BrowserProvider) {
  const exchange = new Contract(CONTRACT_ADDRESSES.EXCHANGE, ExchangeArtifact.abi, provider);
  const token = new Contract(CONTRACT_ADDRESSES.RICHARD_TOKEN, TokenArtifact.abi, provider);
  return { exchange, token };
}

// 使用工厂函数
const { exchange, token } = getContracts(provider);
```

## 读取合约数据

### 1. 基本读取操作

```typescript
// 读取 ERC20 代币余额
export async function erc20Balance(ctx: Ctx, tokenAddr: string, user: string, decimals = 18) {
  const token = new Contract(getAddress(tokenAddr), TokenArtifact.abi, ctx.provider);
  const bal = await token.balanceOf(getAddress(user));
  return {
    raw: bal,
    display: formatUnits(bal, decimals),
  };
}

// 读取合约状态变量
const name = await tokenContract.name();
const symbol = await tokenContract.symbol();
const decimals = await tokenContract.decimals();
const totalSupply = await tokenContract.totalSupply();
```

### 2. 批量读取操作

```typescript
// 获取多个账户的余额
const fetchAllBalances = async (provider: BrowserProvider, address: string) => {
  // 获取 ETH 余额
  const ethBalance = await provider?.getBalance(address);
  const ethBalanceFormatted = ethers.formatUnits(ethBalance, 'ether');

  // 构造合约对象
  const tokenContract = new Contract(CONTRACT_ADDRESSES.RICHARD_TOKEN, TokenArtifact.abi, provider);

  // 获取 RTK 余额
  const rtkBalance = await tokenContract.balanceOf(address);
  const decimals = await tokenContract.decimals();
  const rtkBalanceFormatted = ethers.formatUnits(rtkBalance, decimals);

  return {
    eth: ethBalanceFormatted,
    rtk: rtkBalanceFormatted,
  };
};
```

## 发送交易

### 1. 基本交易操作

```typescript
// ERC20 代币转账
export async function transferToken(ctx: Ctx, to: string, amount: string, decimals = 18) {
  const { provider } = ctx;
  const signer = await provider.getSigner();
  const token = new Contract(CONTRACT_ADDRESSES.RICHARD_TOKEN, TokenArtifact.abi, signer);

  const tx = await token.transfer(to, parseUnits(amount, decimals));
  const receipt = await tx.wait();

  return receipt;
}
```

### 2. 授权操作

```typescript
// 授权代币给交易所
export async function approveToken(ctx: Ctx, amount: string, decimals = 18) {
  const { provider } = ctx;
  const signer = await provider.getSigner();
  const token = new Contract(CONTRACT_ADDRESSES.RICHARD_TOKEN, TokenArtifact.abi, signer);

  const tx = await token.approve(CONTRACT_ADDRESSES.EXCHANGE, parseUnits(amount, decimals));
  return await tx.wait();
}
```

### 3. 复杂交易操作

```typescript
// 创建交易订单
export async function makeOrder_RTK_for_ETH(ctx: Ctx, tokenGetAmountEth: string, tokenGiveAmountRTK: string) {
  const { provider } = ctx;
  const signer = await provider.getSigner();
  const exchange = new Contract(CONTRACT_ADDRESSES.EXCHANGE, ExchangeArtifact.abi, signer);

  const ETHER = '0x0000000000000000000000000000000000000000';
  const tx = await exchange.makeOrder(
    ETHER,
    parseUnits(tokenGetAmountEth, 18),
    CONTRACT_ADDRESSES.RICHARD_TOKEN,
    parseUnits(tokenGiveAmountRTK, 18),
  );

  const receipt = await tx.wait();

  // 解析事件获取 orderHash
  const created = receipt.logs
    .map((l: any) => {
      try {
        return exchange.interface.parseLog(l);
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .find((x: any) => x!.name === 'OrderCreated') as any | undefined;

  return { receipt, orderHash: created?.args?.orderHash as string | undefined };
}
```

## 事件监听

### 1. 基本事件监听

```typescript
// 监听代币转账事件
const tokenContract = new Contract(address, abi, provider);

tokenContract.on('Transfer', (from, to, value, event) => {
  console.log(`Transfer: ${from} -> ${to}, amount: ${value}`);
});

// 移除事件监听
tokenContract.off('Transfer');
```

### 2. 高级事件监听

```typescript
// 监听特定条件的转账事件
tokenContract.on('Transfer', (from, to, value, event) => {
  if (to.toLowerCase() === userAddress.toLowerCase()) {
    toast.info(`收到转账: ${formatUnits(value, 18)} 代币`);
  }
});

// 监听多个事件
const onDeposit = (token: string, user: string, amount: bigint) => {
  if (address && user.toLowerCase() === address.toLowerCase()) {
    toast.info(`Deposit: token=${token} amount=${amount.toString()}`);
  }
};

const onOrderCreated = (orderHash: string) => {
  toast.message(`OrderCreated: ${orderHash}`);
};

exchange.on('Deposit', onDeposit);
exchange.on('OrderCreated', onOrderCreated);

// 清理事件监听
return () => {
  exchange.off('Deposit', onDeposit);
  exchange.off('OrderCreated', onOrderCreated);
};
```

## 错误处理

### 1. 交易错误处理

```typescript
export async function safeTransfer(ctx: Ctx, to: string, amount: string) {
  try {
    const { provider } = ctx;
    const signer = await provider.getSigner();
    const token = new Contract(CONTRACT_ADDRESSES.RICHARD_TOKEN, TokenArtifact.abi, signer);

    // 检查余额
    const balance = await token.balanceOf(await signer.getAddress());
    const transferAmount = parseUnits(amount, 18);

    if (balance < transferAmount) {
      throw new Error('余额不足');
    }

    const tx = await token.transfer(to, transferAmount);
    const receipt = await tx.wait();

    return { success: true, receipt };
  } catch (error) {
    console.error('转账失败:', error);

    // 处理不同类型的错误
    if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error('Gas 费用不足');
    } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
      throw new Error('交易可能失败，请检查参数');
    } else {
      throw new Error('转账失败，请重试');
    }
  }
}
```

### 2. 读取错误处理

```typescript
export async function safeGetBalance(contract: Contract, address: string): Promise<string> {
  try {
    const balance = await contract.balanceOf(address);
    return formatUnits(balance, 18);
  } catch (error) {
    console.error('获取余额失败:', error);
    return '0';
  }
}
```

## 业务常用逻辑

### 1. 代币余额管理

```typescript
// 获取多种代币余额
export class TokenBalanceManager {
  private contracts: Map<string, Contract> = new Map();

  constructor(private provider: BrowserProvider) {}

  async addToken(address: string, abi: any) {
    const contract = new Contract(address, abi, this.provider);
    this.contracts.set(address, contract);
  }

  async getAllBalances(userAddress: string) {
    const balances: Record<string, string> = {};

    for (const [address, contract] of this.contracts) {
      try {
        const balance = await contract.balanceOf(userAddress);
        const decimals = await contract.decimals();
        balances[address] = formatUnits(balance, decimals);
      } catch (error) {
        balances[address] = '0';
      }
    }

    return balances;
  }
}
```

### 2. 交易状态管理

```typescript
export class TransactionManager {
  private pendingTransactions: Map<string, any> = new Map();

  async executeTransaction(contract: Contract, method: string, args: any[], options?: any) {
    const txId = `${method}_${Date.now()}`;

    try {
      // 估算 gas
      const gasEstimate = await contract[method].estimateGas(...args);

      // 发送交易
      const tx = await contract[method](...args, {
        ...options,
        gasLimit: (gasEstimate * 120n) / 100n, // 增加 20% 缓冲
      });

      this.pendingTransactions.set(txId, tx);

      // 等待确认
      const receipt = await tx.wait();
      this.pendingTransactions.delete(txId);

      return { success: true, receipt, txId };
    } catch (error) {
      this.pendingTransactions.delete(txId);
      throw error;
    }
  }

  getPendingTransactions() {
    return Array.from(this.pendingTransactions.keys());
  }
}
```

### 3. 合约交互封装

```typescript
export class ERC20Contract {
  private contract: Contract;

  constructor(address: string, abi: any, provider: BrowserProvider | Signer) {
    this.contract = new Contract(address, abi, provider);
  }

  // 读取操作
  async balanceOf(address: string): Promise<string> {
    const balance = await this.contract.balanceOf(address);
    const decimals = await this.contract.decimals();
    return formatUnits(balance, decimals);
  }

  async allowance(owner: string, spender: string): Promise<string> {
    const allowance = await this.contract.allowance(owner, spender);
    const decimals = await this.contract.decimals();
    return formatUnits(allowance, decimals);
  }

  // 写入操作
  async transfer(to: string, amount: string): Promise<any> {
    const decimals = await this.contract.decimals();
    const tx = await this.contract.transfer(to, parseUnits(amount, decimals));
    return await tx.wait();
  }

  async approve(spender: string, amount: string): Promise<any> {
    const decimals = await this.contract.decimals();
    const tx = await this.contract.approve(spender, parseUnits(amount, decimals));
    return await tx.wait();
  }

  // 事件监听
  onTransfer(callback: (from: string, to: string, value: bigint) => void) {
    this.contract.on('Transfer', callback);
  }

  offTransfer(callback: (from: string, to: string, value: bigint) => void) {
    this.contract.off('Transfer', callback);
  }
}
```

## 最佳实践

### 1. 合约实例管理

```typescript
// ✅ 好的做法：复用合约实例
class ContractManager {
  private contracts: Map<string, Contract> = new Map();

  getContract(address: string, abi: any, provider: BrowserProvider): Contract {
    const key = `${address}_${provider.constructor.name}`;

    if (!this.contracts.has(key)) {
      this.contracts.set(key, new Contract(address, abi, provider));
    }

    return this.contracts.get(key)!;
  }
}

// ❌ 不好的做法：每次都创建新实例
const contract1 = new Contract(address, abi, provider);
const contract2 = new Contract(address, abi, provider); // 重复创建
```

### 2. 错误处理模式

```typescript
// ✅ 好的做法：统一的错误处理
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorMessage: string,
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    console.error(errorMessage, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
}

// 使用示例
const result = await withErrorHandling(() => tokenContract.transfer(to, amount), '转账失败');

if (result.success) {
  console.log('转账成功:', result.data);
} else {
  console.error('转账失败:', result.error);
}
```

### 3. 类型安全

```typescript
// ✅ 好的做法：使用 TypeScript 类型
interface TokenContract {
  balanceOf(address: string): Promise<bigint>;
  transfer(to: string, amount: bigint): Promise<any>;
  approve(spender: string, amount: bigint): Promise<any>;
  decimals(): Promise<number>;
  name(): Promise<string>;
  symbol(): Promise<string>;
}

const tokenContract = new Contract(address, abi, provider) as Contract & TokenContract;
```

## 常见问题

### 1. Gas 估算失败

```typescript
// 问题：UNPREDICTABLE_GAS_LIMIT 错误
// 解决：手动设置 gas limit
const tx = await contract.transfer(to, amount, {
  gasLimit: 100000n, // 手动设置 gas limit
});
```

### 2. 事件监听内存泄漏

```typescript
// 问题：忘记移除事件监听器
// 解决：在组件卸载时清理
useEffect(() => {
  const handleTransfer = (from, to, value) => {
    console.log('Transfer:', { from, to, value });
  };

  contract.on('Transfer', handleTransfer);

  return () => {
    contract.off('Transfer', handleTransfer);
  };
}, [contract]);
```

### 3. 合约地址格式问题

```typescript
// 问题：地址格式不一致
// 解决：使用 getAddress 标准化地址
import { getAddress } from 'ethers';

const normalizedAddress = getAddress(userInputAddress);
const balance = await contract.balanceOf(normalizedAddress);
```

### 4. 大数处理

```typescript
// 问题：JavaScript 数字精度丢失
// 解决：使用 ethers 的 parseUnits 和 formatUnits
import { parseUnits, formatUnits } from 'ethers';

const amount = parseUnits('1000.123', 18); // 转换为 bigint
const display = formatUnits(amount, 18); // 转换为字符串
```

## 总结

Ethers.js 的 `Contract` 类是与智能合约交互的核心工具。掌握其用法需要注意：

1. **正确使用 Provider 和 Signer**：只读操作用 Provider，写入操作用 Signer
2. **妥善处理错误**：区分不同类型的错误并给出合适的提示
3. **管理事件监听**：及时清理事件监听器避免内存泄漏
4. **优化性能**：复用合约实例，合理设置 gas 参数
5. **类型安全**：使用 TypeScript 确保类型安全

通过遵循这些最佳实践，你可以构建出稳定、高效的 Web3 应用程序。

---

_本文基于 ethers.js v6 版本编写，涵盖了 Contract 类的核心功能和实际应用场景。_
