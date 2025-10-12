# Ethers.js v6 Signer 完全指南

## 概述

在以太坊开发中，`Signer` 是 ethers.js 库中负责签名和发送交易的核心组件。与 `Provider`（只读）不同，`Signer` 具备签名能力，可以代表用户执行需要授权的操作。本文将深入探讨 Signer 的核心特点、主要用法、注意事项和最佳实践。

## 目录

- [核心特点](#核心特点)
- [Signer 类型](#signer-类型)
- [主要用法](#主要用法)
- [交易管理](#交易管理)
- [错误处理](#错误处理)
- [安全注意事项](#安全注意事项)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)

## 核心特点

### 1. 签名能力

Signer 的核心功能是能够对交易和消息进行数字签名，这是与 Provider 的主要区别：

```typescript
import { BrowserProvider, Wallet } from 'ethers';

// Provider 只能读取数据
const provider = new BrowserProvider(window.ethereum);
const balance = await provider.getBalance(address); // ✅ 可以

// Signer 可以签名和发送交易
const signer = await provider.getSigner();
const tx = await signer.sendTransaction({
  to: '0x...',
  value: parseEther('0.1'),
}); // ✅ 可以
```

### 2. 账户管理

Signer 代表一个具体的以太坊账户，可以获取账户地址和相关信息：

```typescript
// 获取账户地址
const address = await signer.getAddress();
console.log('账户地址:', address);

// 获取账户余额
const balance = await signer.provider.getBalance(address);
console.log('账户余额:', formatEther(balance));

// 获取 nonce
const nonce = await signer.getNonce();
console.log('当前 nonce:', nonce);
```

### 3. 网络感知

Signer 与 Provider 关联，能够感知当前网络状态：

```typescript
// 获取网络信息
const network = await signer.provider.getNetwork();
console.log('网络 ID:', network.chainId);
console.log('网络名称:', network.name);

// 获取 gas 价格
const gasPrice = await signer.provider.getFeeData();
console.log('Gas 价格:', gasPrice);
```

## Signer 类型

### 1. BrowserProvider.getSigner() - 浏览器钱包

最常用的 Signer 类型，通过浏览器钱包（如 MetaMask）获取：

```typescript
import { BrowserProvider } from 'ethers';

// 创建浏览器 Provider
const provider = new BrowserProvider(window.ethereum);

// 请求账户连接
await provider.send('eth_requestAccounts', []);

// 获取 Signer
const signer = await provider.getSigner();
const address = await signer.getAddress();

console.log('连接的账户:', address);
```

**特点：**

- 用户通过钱包界面授权
- 支持多账户切换
- 自动处理私钥安全
- 需要用户交互确认

### 2. Wallet - 私钥钱包

使用私钥直接创建的钱包，适用于服务器端或测试环境：

```typescript
import { Wallet, JsonRpcProvider } from 'ethers';

// 创建 Provider
const provider = new JsonRpcProvider('http://127.0.0.1:8545');

// 从私钥创建钱包
const privateKey = '0x...'; // 生产环境不要硬编码
const wallet = new Wallet(privateKey, provider);

// 或者从助记词创建
const mnemonic = 'abandon abandon abandon...';
const walletFromMnemonic = Wallet.fromPhrase(mnemonic, provider);

console.log('钱包地址:', wallet.address);
```

**特点：**

- 直接控制私钥
- 无需用户交互
- 适合自动化脚本
- 需要妥善保管私钥

### 3. HDNodeWallet - 分层确定性钱包

支持从助记词派生多个账户的钱包：

```typescript
import { HDNodeWallet, Mnemonic } from 'ethers';

// 创建助记词
const mnemonic = Mnemonic.entropyToPhrase('0x...');
const hdNode = HDNodeWallet.fromPhrase(mnemonic.phrase);

// 派生多个账户
const account0 = hdNode.derivePath("m/44'/60'/0'/0/0");
const account1 = hdNode.derivePath("m/44'/60'/0'/0/1");

console.log('账户 0:', account0.address);
console.log('账户 1:', account1.address);
```

### 4. VoidSigner - 只读 Signer

不能发送交易，但可以获取账户信息的 Signer：

```typescript
import { VoidSigner } from 'ethers';

const voidSigner = new VoidSigner(address, provider);

// 可以获取地址
const addr = await voidSigner.getAddress();

// 不能发送交易
// await voidSigner.sendTransaction(...); // ❌ 会抛出错误
```

## 主要用法

### 1. 发送 ETH 转账

```typescript
import { parseEther } from 'ethers';

async function sendETH(signer: any, to: string, amount: string) {
  try {
    // 检查余额
    const balance = await signer.provider.getBalance(await signer.getAddress());
    const sendAmount = parseEther(amount);

    if (balance < sendAmount) {
      throw new Error('余额不足');
    }

    // 发送交易
    const tx = await signer.sendTransaction({
      to: to,
      value: sendAmount,
      // gasLimit: 21000n, // 可选：手动设置 gas limit
    });

    console.log('交易哈希:', tx.hash);

    // 等待确认
    const receipt = await tx.wait();
    console.log('交易确认:', receipt.blockNumber);

    return receipt;
  } catch (error) {
    console.error('转账失败:', error);
    throw error;
  }
}

// 使用示例
const receipt = await sendETH(signer, '0x...', '0.1');
```

### 2. 合约交互

```typescript
import { Contract, parseUnits } from 'ethers';

async function interactWithContract(signer: any, contractAddress: string, abi: any) {
  // 创建合约实例
  const contract = new Contract(contractAddress, abi, signer);

  // 读取合约数据
  const name = await contract.name();
  const symbol = await contract.symbol();
  const decimals = await contract.decimals();

  console.log(`代币: ${name} (${symbol}), 精度: ${decimals}`);

  // 发送交易
  const tx = await contract.transfer(
    '0x...', // 接收地址
    parseUnits('100', decimals), // 转账数量
  );

  const receipt = await tx.wait();
  return receipt;
}
```

### 3. 消息签名

```typescript
import { toUtf8Bytes } from 'ethers';

async function signMessage(signer: any, message: string) {
  // 签名消息
  const signature = await signer.signMessage(message);
  console.log('消息签名:', signature);

  // 验证签名
  const recoveredAddress = ethers.verifyMessage(message, signature);
  const signerAddress = await signer.getAddress();

  console.log('签名验证:', recoveredAddress === signerAddress);

  return signature;
}

// 使用示例
const message = 'Hello, Web3!';
const signature = await signMessage(signer, message);
```

### 4. 类型化数据签名（EIP-712）

```typescript
async function signTypedData(signer: any) {
  const domain = {
    name: 'MyDApp',
    version: '1',
    chainId: 31337,
    verifyingContract: '0x...',
  };

  const types = {
    Person: [
      { name: 'name', type: 'string' },
      { name: 'wallet', type: 'address' },
    ],
    Mail: [
      { name: 'from', type: 'Person' },
      { name: 'to', type: 'Person' },
      { name: 'contents', type: 'string' },
    ],
  };

  const value = {
    from: {
      name: 'Alice',
      wallet: '0x...',
    },
    to: {
      name: 'Bob',
      wallet: '0x...',
    },
    contents: 'Hello, Bob!',
  };

  const signature = await signer.signTypedData(domain, types, value);
  return signature;
}
```

## 交易管理

### 1. Gas 费用管理

```typescript
async function sendTransactionWithGasControl(signer: any, to: string, value: bigint) {
  // 获取当前 gas 价格
  const feeData = await signer.provider.getFeeData();

  // 估算 gas
  const gasEstimate = await signer.estimateGas({
    to: to,
    value: value,
  });

  // 发送交易，手动设置 gas 参数
  const tx = await signer.sendTransaction({
    to: to,
    value: value,
    gasLimit: (gasEstimate * 120n) / 100n, // 增加 20% 缓冲
    maxFeePerGas: feeData.maxFeePerGas,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
  });

  return tx;
}
```

### 2. 交易状态跟踪

```typescript
class TransactionTracker {
  private pendingTransactions = new Map<string, any>();

  async trackTransaction(signer: any, txPromise: Promise<any>) {
    const tx = await txPromise;
    const txId = tx.hash;

    this.pendingTransactions.set(txId, {
      hash: txId,
      status: 'pending',
      startTime: Date.now(),
    });

    // 监听交易状态
    tx.wait()
      .then((receipt) => {
        this.pendingTransactions.set(txId, {
          ...this.pendingTransactions.get(txId),
          status: 'confirmed',
          receipt: receipt,
          endTime: Date.now(),
        });
      })
      .catch((error) => {
        this.pendingTransactions.set(txId, {
          ...this.pendingTransactions.get(txId),
          status: 'failed',
          error: error,
          endTime: Date.now(),
        });
      });

    return txId;
  }

  getTransactionStatus(txId: string) {
    return this.pendingTransactions.get(txId);
  }

  getAllPendingTransactions() {
    return Array.from(this.pendingTransactions.values()).filter((tx) => tx.status === 'pending');
  }
}
```

### 3. 批量交易处理

```typescript
async function batchTransactions(signer: any, transactions: any[]) {
  const results = [];

  for (let i = 0; i < transactions.length; i++) {
    try {
      const tx = await signer.sendTransaction(transactions[i]);
      results.push({ index: i, status: 'sent', hash: tx.hash });

      // 等待确认
      await tx.wait();
      results[i].status = 'confirmed';
    } catch (error) {
      results.push({ index: i, status: 'failed', error: error.message });
    }
  }

  return results;
}
```

## 错误处理

### 1. 常见错误类型

```typescript
class SignerErrorHandler {
  static handleError(error: any): string {
    // 用户拒绝签名
    if (error.code === 4001) {
      return '用户拒绝了交易签名';
    }

    // 余额不足
    if (error.code === 'INSUFFICIENT_FUNDS') {
      return '账户余额不足，无法支付 gas 费用';
    }

    // 网络错误
    if (error.code === 'NETWORK_ERROR') {
      return '网络连接错误，请检查网络设置';
    }

    // 交易失败
    if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
      return '交易可能失败，请检查参数或合约状态';
    }

    // 非ce 错误
    if (error.code === 'NONCE_EXPIRED') {
      return '交易 nonce 已过期，请重试';
    }

    // 默认错误
    return `交易失败: ${error.message}`;
  }

  static async safeTransaction(signer: any, transaction: any) {
    try {
      const tx = await signer.sendTransaction(transaction);
      const receipt = await tx.wait();
      return { success: true, receipt };
    } catch (error) {
      const message = this.handleError(error);
      return { success: false, error: message };
    }
  }
}
```

### 2. 重试机制

```typescript
async function retryTransaction(signer: any, transaction: any, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const tx = await signer.sendTransaction(transaction);
      return await tx.wait();
    } catch (error) {
      console.log(`尝试 ${attempt} 失败:`, error.message);

      if (attempt === maxRetries) {
        throw error;
      }

      // 等待一段时间后重试
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}
```

## 安全注意事项

### 1. 私钥安全

```typescript
// ❌ 错误做法：硬编码私钥
const privateKey = '0x1234567890abcdef...';
const wallet = new Wallet(privateKey);

// ✅ 正确做法：从环境变量读取
const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  throw new Error('PRIVATE_KEY 环境变量未设置');
}
const wallet = new Wallet(privateKey);

// ✅ 更好的做法：使用硬件钱包或浏览器钱包
const signer = await provider.getSigner();
```

### 2. 交易验证

```typescript
async function validateTransaction(signer: any, transaction: any) {
  const address = await signer.getAddress();

  // 验证发送地址
  if (transaction.from && transaction.from.toLowerCase() !== address.toLowerCase()) {
    throw new Error('交易发送地址与签名者地址不匹配');
  }

  // 验证余额
  const balance = await signer.provider.getBalance(address);
  const totalCost = (transaction.value || 0n) + (transaction.gasLimit || 0n) * (transaction.gasPrice || 0n);

  if (balance < totalCost) {
    throw new Error('余额不足');
  }

  return true;
}
```

### 3. 网络验证

```typescript
async function validateNetwork(signer: any, expectedChainId: number) {
  const network = await signer.provider.getNetwork();

  if (Number(network.chainId) !== expectedChainId) {
    throw new Error(`网络不匹配，期望: ${expectedChainId}，实际: ${network.chainId}`);
  }

  return true;
}
```

## 最佳实践

### 1. Signer 工厂模式

```typescript
class SignerFactory {
  static async createBrowserSigner(): Promise<any> {
    if (!window.ethereum) {
      throw new Error('未检测到钱包');
    }

    const provider = new BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);

    return await provider.getSigner();
  }

  static createWalletSigner(privateKey: string, provider: any): any {
    return new Wallet(privateKey, provider);
  }

  static createHDWalletSigner(mnemonic: string, provider: any, index = 0): any {
    const hdNode = HDNodeWallet.fromPhrase(mnemonic);
    return hdNode.derivePath(`m/44'/60'/0'/0/${index}`).connect(provider);
  }
}
```

### 2. 统一的交易接口

```typescript
interface TransactionRequest {
  to: string;
  value?: bigint;
  data?: string;
  gasLimit?: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
}

class TransactionManager {
  constructor(private signer: any) {}

  async sendTransaction(request: TransactionRequest) {
    // 验证交易
    await this.validateTransaction(request);

    // 发送交易
    const tx = await this.signer.sendTransaction(request);

    // 跟踪交易
    return this.trackTransaction(tx);
  }

  private async validateTransaction(request: TransactionRequest) {
    // 实现验证逻辑
  }

  private async trackTransaction(tx: any) {
    // 实现交易跟踪逻辑
    return tx.wait();
  }
}
```

### 3. 错误恢复机制

```typescript
class ResilientSigner {
  constructor(private signer: any) {}

  async executeWithRetry<T>(operation: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (attempt < maxRetries) {
          console.log(`操作失败，${delay}ms 后重试 (${attempt}/${maxRetries})`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // 指数退避
        }
      }
    }

    throw lastError;
  }
}
```

## 常见问题

### 1. 用户拒绝签名

```typescript
// 问题：用户点击拒绝按钮
// 解决：优雅处理用户拒绝
try {
  const tx = await signer.sendTransaction(transaction);
} catch (error) {
  if (error.code === 4001) {
    // 用户拒绝，不显示错误，静默处理
    console.log('用户取消了交易');
    return;
  }
  throw error;
}
```

### 2. Nonce 冲突

```typescript
// 问题：并发交易导致 nonce 冲突
// 解决：使用队列管理交易
class TransactionQueue {
  private queue: any[] = [];
  private processing = false;

  async addTransaction(transaction: any) {
    return new Promise((resolve, reject) => {
      this.queue.push({ transaction, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const { transaction, resolve, reject } = this.queue.shift();

      try {
        const result = await signer.sendTransaction(transaction);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }

    this.processing = false;
  }
}
```

### 3. Gas 估算失败

```typescript
// 问题：UNPREDICTABLE_GAS_LIMIT 错误
// 解决：手动设置 gas limit 或使用静态 gas
async function sendTransactionWithFallbackGas(signer: any, transaction: any) {
  try {
    // 尝试估算 gas
    const gasEstimate = await signer.estimateGas(transaction);
    transaction.gasLimit = (gasEstimate * 120n) / 100n;
  } catch (error) {
    // 估算失败，使用默认值
    console.log('Gas 估算失败，使用默认值');
    transaction.gasLimit = 21000n; // ETH 转账的默认值
  }

  return await signer.sendTransaction(transaction);
}
```

### 4. 网络切换问题

```typescript
// 问题：用户在交易过程中切换网络
// 解决：监听网络变化
function setupNetworkListener(signer: any, expectedChainId: number) {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', (chainId: string) => {
      const newChainId = parseInt(chainId, 16);

      if (newChainId !== expectedChainId) {
        alert(`请切换到正确的网络 (Chain ID: ${expectedChainId})`);
        window.location.reload();
      }
    });
  }
}
```

## 总结

Ethers.js v6 的 `Signer` 是 Web3 开发中处理用户授权和交易发送的核心组件。关键要点：

1. **选择合适的 Signer 类型**：浏览器环境用 `BrowserProvider.getSigner()`，服务器端用 `Wallet`
2. **妥善处理错误**：区分不同类型的错误并给出合适的用户提示
3. **管理交易状态**：跟踪交易进度，处理失败和重试
4. **注意安全**：保护私钥，验证交易参数，检查网络状态
5. **优化用户体验**：提供清晰的错误信息，实现重试机制
6. **遵循最佳实践**：使用工厂模式，统一接口，实现错误恢复

通过掌握这些概念和技巧，你可以构建出安全、稳定、用户友好的 Web3 应用程序。

---

_本文基于 ethers.js v6 版本编写，涵盖了 Signer 的完整使用指南和实际应用场景。_
