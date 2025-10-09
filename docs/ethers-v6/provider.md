### Ethers v6 Provider 指南（仅 Provider 篇）

#### Provider 是什么？

Provider 是应用与以太坊节点之间的通信层，负责：

- 读取链上数据（余额、区块、交易、日志）
- 调用只读合约方法（view/pure）
- 管理与网络的连接
- 订阅并接收事件（新区块、合约事件）
  注意：Provider 不负责签名或发送交易（需要 Signer）。

#### Provider 类型与场景

- JsonRpcProvider（通用后端/脚本）
  - 直接连到 JSON-RPC 节点（本地或远程服务）
  - 适合服务器端、Node.js 脚本、无需用户授权的读取场景

  ```ts
  import { JsonRpcProvider } from 'ethers';
  const provider = new JsonRpcProvider('https://mainnet.infura.io/v3/KEY');
  ```

- BrowserProvider（前端 DApp 推荐）
  - 通过 EIP-1193（如 MetaMask）与钱包交互
  - 可在浏览器中获取账户和网络信息

  ```ts
  import { BrowserProvider } from 'ethers';
  const provider = new BrowserProvider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const network = await provider.getNetwork();
  ```

- WebSocketProvider（实时事件）
  - 通过 WebSocket 获取实时推送（新区块、日志）

  ```ts
  import { WebSocketProvider } from 'ethers';
  const ws = new WebSocketProvider('wss://.../ws/v3/KEY');
  ws.on('block', (n) => console.log('block', n));
  ```

- FallbackProvider（高可用）
  - 聚合多 Provider，自动切换，提高可靠性

  ```ts
  import { FallbackProvider, JsonRpcProvider } from 'ethers';
  const p1 = new JsonRpcProvider('URL1');
  const p2 = new JsonRpcProvider('URL2');
  const provider = new FallbackProvider([
    { provider: p1, weight: 1 },
    { provider: p2, weight: 1 },
  ]);
  ```

- IpcProvider（本地节点，Node.js）
  - 通过 IPC 连接本地节点（如 Geth）

  ```ts
  import { IpcProvider } from 'ethers';
  const provider = new IpcProvider('/path/to/geth.ipc');
  ```

- AlchemyProvider / InfuraProvider（便捷托管）
  - 针对特定服务商的快捷 Provider
  ```ts
  import { AlchemyProvider, InfuraProvider } from 'ethers';
  const a = new AlchemyProvider('sepolia', 'KEY');
  const i = new InfuraProvider('mainnet', 'KEY');
  ```

#### 常见只读操作

```ts
// 读取余额
const balance = await provider.getBalance('0x...addr');

// 区块与交易
const block = await provider.getBlock('latest');
const tx = await provider.getTransaction('0x...hash');

// 网络信息
const net = await provider.getNetwork(); // { chainId, name }
```

#### 事件与日志订阅

```ts
// 新区块
const offBlock = provider.on('block', (n) => {
  console.log('new block', n);
});

// 合约事件（示例）
// new Contract(addr, abi, provider).on("Event", (...args) => {})

// 取消订阅
offBlock?.();
```

#### 选择建议

- 浏览器前端与钱包交互：BrowserProvider
- 后端/脚本读取：JsonRpcProvider、InfuraProvider、AlchemyProvider
- 实时性要求高：WebSocketProvider
- 生产高可用：FallbackProvider
- 本地节点（服务器）：IpcProvider

#### v6 重要变更（相对 v5）

- Provider 不再位于 `ethers.providers.*` 命名空间
- `Web3Provider` 被 `BrowserProvider` 取代
- 更统一的 Promise API 与改进的事件模型

#### 实战注意事项

- Provider 只读，写操作需使用 Signer 或合约 `.connect(signer)`
- 事件订阅应在组件卸载/退出时及时取消，避免内存泄漏
- 使用受信任的 RPC 端点，生产环境建议使用 FallbackProvider 提高稳健性
