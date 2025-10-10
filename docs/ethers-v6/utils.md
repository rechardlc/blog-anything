# Ethers.js v6 核心工具方法完全指南

## 概述

Ethers.js 提供了丰富的工具方法来处理以太坊开发中的常见任务，包括单位转换、地址处理、哈希计算等。本文将深入探讨这些核心工具方法的用法、注意事项和最佳实践。

## 目录

- [单位转换工具](#单位转换工具)
- [地址处理工具](#地址处理工具)
- [哈希和签名工具](#哈希和签名工具)
- [数据编码工具](#数据编码工具)
- [网络和链工具](#网络和链工具)
- [时间工具](#时间工具)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)

## 单位转换工具

### 1. formatUnits vs formatEther

#### formatUnits - 通用单位格式化

```typescript
import { formatUnits } from 'ethers';

// 基本用法
const value = 1000000000000000000n; // 1 ETH in wei
const formatted = formatUnits(value, 18); // "1.0"
const formatted2 = formatUnits(value, 6); // "1000000000.0"

// 实际应用：处理不同精度的代币
const usdcBalance = 1000000n; // 1 USDC (6 decimals)
const usdcFormatted = formatUnits(usdcBalance, 6); // "1.0"

const ethBalance = 1000000000000000000n; // 1 ETH (18 decimals)
const ethFormatted = formatUnits(ethBalance, 18); // "1.0"
```

#### formatEther - ETH 专用格式化

```typescript
import { formatEther } from 'ethers';

// 专门用于 ETH，固定 18 位小数
const value = 1000000000000000000n; // 1 ETH in wei
const formatted = formatEther(value); // "1.0"

// 等同于 formatUnits(value, 18)
const formatted2 = formatUnits(value, 18); // "1.0"
```

#### 对比和选择

| 方法          | 精度     | 使用场景               | 性能 | 推荐度     |
| ------------- | -------- | ---------------------- | ---- | ---------- |
| `formatUnits` | 可配置   | 所有代币，需要指定精度 | 稍慢 | ⭐⭐⭐⭐⭐ |
| `formatEther` | 固定18位 | 仅ETH                  | 更快 | ⭐⭐⭐⭐   |

**推荐使用 `formatUnits`**，因为：

- 更灵活，适用于所有代币
- 代码更一致
- 避免硬编码精度

### 2. parseUnits vs parseEther

#### parseUnits - 通用单位解析

```typescript
import { parseUnits } from 'ethers';

// 基本用法
const amount = parseUnits('1.5', 18); // 1500000000000000000n
const usdcAmount = parseUnits('100.50', 6); // 100500000n

// 实际应用：用户输入处理
function handleUserInput(userInput: string, decimals: number) {
  try {
    // 验证输入格式
    if (!/^\d+(\.\d+)?$/.test(userInput)) {
      throw new Error('无效的数字格式');
    }

    const parsed = parseUnits(userInput, decimals);
    return parsed;
  } catch (error) {
    console.error('解析失败:', error);
    return 0n;
  }
}

// 使用示例
const transferAmount = handleUserInput('10.5', 18); // 10500000000000000000n
```

#### parseEther - ETH 专用解析

```typescript
import { parseEther } from 'ethers';

// 专门用于 ETH，固定 18 位小数
const amount = parseEther('1.5'); // 1500000000000000000n

// 等同于 parseUnits("1.5", 18)
const amount2 = parseUnits('1.5', 18); // 1500000000000000000n
```

#### 实际应用示例

```typescript
// ✅ 好的做法：使用 parseUnits 处理所有代币
export class TokenUtils {
  static formatTokenAmount(amount: bigint, decimals: number): string {
    return formatUnits(amount, decimals);
  }

  static parseTokenAmount(amount: string, decimals: number): bigint {
    return parseUnits(amount, decimals);
  }

  // 批量处理多个代币
  static formatMultipleTokens(balances: Record<string, bigint>, decimals: Record<string, number>) {
    const result: Record<string, string> = {};

    for (const [token, balance] of Object.entries(balances)) {
      result[token] = formatUnits(balance, decimals[token]);
    }

    return result;
  }
}

// 使用示例
const balances = {
  ETH: 1000000000000000000n,
  USDC: 1000000n,
  DAI: 1000000000000000000n,
};

const decimals = { ETH: 18, USDC: 6, DAI: 18 };

const formatted = TokenUtils.formatMultipleTokens(balances, decimals);
// { ETH: "1.0", USDC: "1.0", DAI: "1.0" }
```

## 地址处理工具

### 1. getAddress - 地址标准化

```typescript
import { getAddress } from 'ethers';

// 标准化地址格式
const address1 = getAddress('0x1234567890123456789012345678901234567890');
const address2 = getAddress('0x1234567890123456789012345678901234567890'.toLowerCase());
const address3 = getAddress('0x1234567890123456789012345678901234567890'.toUpperCase());

// 所有结果都是: "0x1234567890123456789012345678901234567890"

// 实际应用：用户输入验证
function validateAndNormalizeAddress(input: string): string | null {
  try {
    return getAddress(input);
  } catch (error) {
    console.error('无效的地址格式:', error);
    return null;
  }
}

// 使用示例
const userInput = '0x1234567890123456789012345678901234567890';
const normalized = validateAndNormalizeAddress(userInput);
if (normalized) {
  console.log('有效地址:', normalized);
} else {
  console.log('无效地址');
}
```

### 2. isAddress - 地址验证

```typescript
import { isAddress } from 'ethers';

// 验证地址格式
const valid = isAddress('0x1234567890123456789012345678901234567890'); // true
const invalid = isAddress('invalid-address'); // false
const invalid2 = isAddress('0x123'); // false

// 实际应用：表单验证
function validateAddressInput(input: string): { isValid: boolean; error?: string } {
  if (!input) {
    return { isValid: false, error: '地址不能为空' };
  }

  if (!isAddress(input)) {
    return { isValid: false, error: '无效的地址格式' };
  }

  return { isValid: true };
}
```

### 3. 地址工具对比

| 方法         | 功能        | 性能 | 使用场景     | 推荐度     |
| ------------ | ----------- | ---- | ------------ | ---------- |
| `getAddress` | 标准化+验证 | 快   | 处理用户输入 | ⭐⭐⭐⭐⭐ |
| `isAddress`  | 仅验证      | 更快 | 快速验证     | ⭐⭐⭐⭐   |

**推荐使用 `getAddress`**，因为：

- 一步完成验证和标准化
- 返回标准格式的地址
- 减少后续处理步骤

## 哈希和签名工具

### 1. keccak256 - 哈希计算

```typescript
import { keccak256, toUtf8Bytes } from 'ethers';

// 字符串哈希
const hash1 = keccak256(toUtf8Bytes('Hello World'));
// "0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba"

// 字节数组哈希
const hash2 = keccak256('0x1234');
// "0x56570de287d73cd1cb6092bb8fdee6173974955fdef345ae579ee9f475ea7432"

// 实际应用：消息签名
function hashMessage(message: string): string {
  return keccak256(toUtf8Bytes(message));
}

// 使用示例
const message = 'Transfer 100 tokens to 0x123...';
const messageHash = hashMessage(message);
```

### 2. solidityPackedKeccak256 - 打包哈希

```typescript
import { solidityPackedKeccak256 } from 'ethers';

// 打包多个值并哈希
const hash = solidityPackedKeccak256(
  ['address', 'uint256', 'string'],
  ['0x1234567890123456789012345678901234567890', 100, 'Hello'],
);

// 实际应用：订单哈希
function createOrderHash(
  tokenGet: string,
  amountGet: bigint,
  tokenGive: string,
  amountGive: bigint,
  expires: bigint,
  nonce: bigint,
): string {
  return solidityPackedKeccak256(
    ['address', 'uint256', 'address', 'uint256', 'uint256', 'uint256'],
    [tokenGet, amountGet, tokenGive, amountGive, expires, nonce],
  );
}
```

### 3. 哈希工具对比

| 方法                      | 用途     | 性能 | 使用场景             | 推荐度     |
| ------------------------- | -------- | ---- | -------------------- | ---------- |
| `keccak256`               | 通用哈希 | 快   | 消息哈希、数据完整性 | ⭐⭐⭐⭐⭐ |
| `solidityPackedKeccak256` | 打包哈希 | 快   | 合约交互、订单签名   | ⭐⭐⭐⭐   |

## 数据编码工具

### 1. toUtf8Bytes vs toUtf8String

```typescript
import { toUtf8Bytes, toUtf8String } from 'ethers';

// 字符串转字节数组
const bytes = toUtf8Bytes('Hello World');
// Uint8Array(11) [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]

// 字节数组转字符串
const string = toUtf8String(bytes);
// "Hello World"

// 实际应用：消息处理
function encodeMessage(message: string): string {
  const bytes = toUtf8Bytes(message);
  return `0x${Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')}`;
}

function decodeMessage(hexString: string): string {
  const bytes = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
  const byteArray = new Uint8Array(bytes.length / 2);

  for (let i = 0; i < bytes.length; i += 2) {
    byteArray[i / 2] = parseInt(bytes.substr(i, 2), 16);
  }

  return toUtf8String(byteArray);
}
```

### 2. hexlify vs arrayify

```typescript
import { hexlify, arrayify } from 'ethers';

// 字节数组转十六进制
const bytes = new Uint8Array([72, 101, 108, 108, 111]);
const hex = hexlify(bytes); // "0x48656c6c6f"

// 十六进制转字节数组
const bytes2 = arrayify(hex); // Uint8Array(5) [72, 101, 108, 108, 111]

// 实际应用：数据转换
function convertToHex(data: string | Uint8Array): string {
  if (typeof data === 'string') {
    return hexlify(toUtf8Bytes(data));
  }
  return hexlify(data);
}
```

## 网络和链工具

### 1. getNetwork - 网络信息

```typescript
import { getNetwork } from 'ethers';

// 获取网络信息
const network = await getNetwork(provider);
console.log(network.chainId); // 31337n
console.log(network.name); // "unknown"

// 实际应用：网络验证
async function validateNetwork(provider: any, expectedChainId: number): Promise<boolean> {
  try {
    const network = await getNetwork(provider);
    return Number(network.chainId) === expectedChainId;
  } catch (error) {
    console.error('网络验证失败:', error);
    return false;
  }
}

// 使用示例
const isValid = await validateNetwork(provider, 31337); // 本地网络
if (!isValid) {
  console.log('请切换到正确的网络');
}
```

### 2. 网络工具对比

| 方法         | 功能         | 性能 | 使用场景           | 推荐度   |
| ------------ | ------------ | ---- | ------------------ | -------- |
| `getNetwork` | 获取网络信息 | 中等 | 网络验证、链ID检查 | ⭐⭐⭐⭐ |

## 时间工具

### 1. 时间戳处理

```typescript
// 获取当前时间戳
const now = Math.floor(Date.now() / 1000);

// 时间戳转换
function timestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

function dateToTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

// 实际应用：订单过期时间
function createExpiryTime(minutesFromNow: number): bigint {
  const now = Math.floor(Date.now() / 1000);
  return BigInt(now + minutesFromNow * 60);
}

// 使用示例
const expiryTime = createExpiryTime(30); // 30分钟后过期
```

## 最佳实践

### 1. 统一的工具类封装

```typescript
export class EthersUtils {
  // 单位转换
  static formatToken(amount: bigint, decimals: number): string {
    return formatUnits(amount, decimals);
  }

  static parseToken(amount: string, decimals: number): bigint {
    return parseUnits(amount, decimals);
  }

  // 地址处理
  static normalizeAddress(address: string): string {
    return getAddress(address);
  }

  static isValidAddress(address: string): boolean {
    return isAddress(address);
  }

  // 哈希计算
  static hashMessage(message: string): string {
    return keccak256(toUtf8Bytes(message));
  }

  static hashOrder(params: {
    tokenGet: string;
    amountGet: bigint;
    tokenGive: string;
    amountGive: bigint;
    expires: bigint;
    nonce: bigint;
  }): string {
    return solidityPackedKeccak256(
      ['address', 'uint256', 'address', 'uint256', 'uint256', 'uint256'],
      [params.tokenGet, params.amountGet, params.tokenGive, params.amountGive, params.expires, params.nonce],
    );
  }

  // 数据编码
  static encodeString(str: string): string {
    return hexlify(toUtf8Bytes(str));
  }

  static decodeString(hex: string): string {
    return toUtf8String(arrayify(hex));
  }

  // 网络验证
  static async validateNetwork(provider: any, expectedChainId: number): Promise<boolean> {
    try {
      const network = await getNetwork(provider);
      return Number(network.chainId) === expectedChainId;
    } catch {
      return false;
    }
  }
}
```

### 2. 错误处理模式

```typescript
export class SafeEthersUtils {
  static safeFormatUnits(amount: bigint, decimals: number): string {
    try {
      return formatUnits(amount, decimals);
    } catch (error) {
      console.error('格式化单位失败:', error);
      return '0';
    }
  }

  static safeParseUnits(amount: string, decimals: number): bigint | null {
    try {
      return parseUnits(amount, decimals);
    } catch (error) {
      console.error('解析单位失败:', error);
      return null;
    }
  }

  static safeGetAddress(address: string): string | null {
    try {
      return getAddress(address);
    } catch (error) {
      console.error('地址标准化失败:', error);
      return null;
    }
  }
}
```

### 3. 性能优化

```typescript
// 缓存常用的合约精度
const decimalsCache = new Map<string, number>();

export async function getCachedDecimals(contract: any, tokenAddress: string): Promise<number> {
  if (decimalsCache.has(tokenAddress)) {
    return decimalsCache.get(tokenAddress)!;
  }

  const decimals = await contract.decimals();
  decimalsCache.set(tokenAddress, decimals);
  return decimals;
}

// 批量处理优化
export async function batchFormatBalances(
  balances: Record<string, bigint>,
  getDecimals: (token: string) => Promise<number>,
): Promise<Record<string, string>> {
  const results: Record<string, string> = {};

  // 并行获取所有精度
  const decimalsPromises = Object.keys(balances).map(async (token) => {
    const decimals = await getDecimals(token);
    return { token, decimals };
  });

  const decimalsResults = await Promise.all(decimalsPromises);
  const decimalsMap = Object.fromEntries(decimalsResults.map(({ token, decimals }) => [token, decimals]));

  // 批量格式化
  for (const [token, balance] of Object.entries(balances)) {
    results[token] = formatUnits(balance, decimalsMap[token]);
  }

  return results;
}
```

## 常见问题

### 1. 精度丢失问题

```typescript
// ❌ 错误做法：直接使用 JavaScript 数字
const amount = 1.5;
const wei = amount * 1e18; // 精度丢失！

// ✅ 正确做法：使用 parseUnits
const amount = '1.5';
const wei = parseUnits(amount, 18); // 精确计算
```

### 2. 地址格式不一致

```typescript
// ❌ 错误做法：直接使用用户输入
const balance = await contract.balanceOf(userInputAddress);

// ✅ 正确做法：标准化地址
const normalizedAddress = getAddress(userInputAddress);
const balance = await contract.balanceOf(normalizedAddress);
```

### 3. 大数比较问题

```typescript
// ❌ 错误做法：直接比较
if (balance > amount) {
  // 可能出错
  // ...
}

// ✅ 正确做法：使用 BigInt
if (balance > parseUnits(amount, 18)) {
  // ...
}
```

### 4. 网络验证遗漏

```typescript
// ❌ 错误做法：不验证网络
const tx = await contract.transfer(to, amount);

// ✅ 正确做法：先验证网络
const isValidNetwork = await EthersUtils.validateNetwork(provider, 31337);
if (!isValidNetwork) {
  throw new Error('请切换到正确的网络');
}
const tx = await contract.transfer(to, amount);
```

## 总结

Ethers.js 的工具方法为 Web3 开发提供了强大的支持。关键要点：

1. **优先使用 `formatUnits` 和 `parseUnits`**：更灵活，适用于所有代币
2. **始终使用 `getAddress`**：一步完成地址验证和标准化
3. **合理使用哈希工具**：根据场景选择 `keccak256` 或 `solidityPackedKeccak256`
4. **封装工具类**：提高代码复用性和维护性
5. **添加错误处理**：确保应用的稳定性
6. **注意性能优化**：缓存常用数据，批量处理操作

通过遵循这些最佳实践，你可以构建出更加稳定、高效的 Web3 应用程序。

---

_本文基于 ethers.js v6 版本编写，涵盖了核心工具方法的完整使用指南。_
