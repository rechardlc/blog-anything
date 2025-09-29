## Hardhat 3 初级上手指南（含 Solidity 与 TypeScript 测试）

本文带你从 0 到 1 使用 Hardhat 3：初始化项目、编写与编译合约、运行本地区块链、用 Solidity 和 TypeScript 编写测试，并简单了解部署脚本与 Ignition。参考与延伸阅读见文末官方文档。

### 什么是 Hardhat 3

- **Hardhat** 是以太坊智能合约的开发环境，集成编译、测试、脚本、部署等能力。
- **Hardhat 3** 原生支持在 Solidity 中编写测试（.t.sol），并默认集成 viem，支持 TypeScript 测试与脚本。

参考： [Hardhat 3 入门官方指南](https://hardhat.org/docs/getting-started#getting-started-with-hardhat-3)

### 环境准备

- Node.js ≥ 22
- 包管理器：建议使用 pnpm（项目也使用了 pnpm）

### 初始化项目

在一个空目录中初始化（已有项目可跳过）：

```bash
pnpm dlx hardhat --init
# 按提示选择默认模板即可（包含示例合约、测试、脚本与 Ignition）
```

完成后可以验证：

```bash
pnpm hardhat --help
```

### 项目结构速览

官方模板（与你当前项目类似）大致如下：

```
hardhat.config.ts
contracts
  ├─ Counter.sol
  └─ Counter.t.sol        # Solidity 测试示例
test
  └─ Counter.ts           # TypeScript 测试示例
ignition
  └─ modules
     └─ Counter.ts        # Ignition 部署模块
scripts
  └─ send-op-tx.ts        # 脚本示例（使用 viem）
```

- `hardhat.config.ts`：编译器、网络、插件等配置。
- `contracts`：Solidity 合约与 `.t.sol` 测试。
- `test`：TypeScript 测试。
- `ignition/modules`：声明式部署模块。
- `scripts`：交互或自动化脚本。

你的项目中也包含这些目录与文件，可直接沿用。

### 编写与编译合约

示例（计数器）：

```solidity
pragma solidity ^0.8.28;

contract Counter {
  uint public x;

  event Increment(uint by);

  function inc() public {
    x++;
    emit Increment(1);
  }

  function incBy(uint by) public {
    require(by > 0, "incBy: increment should be positive");
    x += by;
    emit Increment(by);
  }
}
```

编译：

```bash
pnpm hardhat build
```

Hardhat 会根据 `pragma` 和配置自动选择编译器版本。

### 运行本地区块链（Hardhat Node）

启动内存链：

```bash
npx hardhat node --port 9999 --chain-id 31337
```

- URL：`http://127.0.0.1:9999`
- ChainId：`31337`（可自定义）
- 日志会打印预置账户与私钥，便于本地开发。

可用 JSON-RPC 快速自检：

```bash
curl http://127.0.0.1:9999 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
```

### 用 Solidity 编写测试（.t.sol）

Hardhat 3 原生支持 Solidity 测试：将测试合约放在 `contracts/*.t.sol` 或 `test/*.sol` 中，所有以 `test` 开头的函数都会被执行。

示例（思路）：

```solidity
import { Test } from "forge-std/Test.sol";
import { Counter } from "./Counter.sol";

contract CounterTest is Test {
  Counter counter;

  function setUp() public { counter = new Counter(); }

  function test_InitialValue() public view {
    require(counter.x() == 0, "initial should be 0");
  }

  function testFuzz_Inc(uint8 n) public {
    for (uint8 i = 0; i < n; i++) counter.inc();
    require(counter.x() == n, "x should equal n");
  }

  function test_IncByZero() public {
    vm.expectRevert();
    counter.incBy(0);
  }
}
```

仅运行 Solidity 测试：

```bash
pnpm hardhat test solidity
```

运行全部测试（Solidity + TypeScript）：

```bash
pnpm hardhat test
```

更多细节见： [Hardhat 3 入门官方指南](https://hardhat.org/docs/getting-started#getting-started-with-hardhat-3)

### 用 TypeScript 编写测试（Node.js 环境）

示例（节选，默认模板已提供 `test/Counter.ts`）：

```ts
it('events 累加值应等于当前 x', async function () {
  const counter = await viem.deployContract('Counter');
  for (let i = 1n; i <= 10n; i++) {
    await counter.write.incBy([i]);
  }
  const events = await publicClient.getContractEvents({
    address: counter.address,
    abi: counter.abi,
    eventName: 'Increment',
    fromBlock: 0n,
    strict: true,
  });
  let total = 0n;
  for (const e of events) total += e.args.by;
  assert.equal(total, await counter.read.x());
});
```

仅运行 Node.js（TypeScript）测试：

```bash
pnpm hardhat test nodejs
```

### 编写脚本与交互（scripts）

你可以在 `scripts` 中使用 viem/TypeScript 与合约交互，例如发送交易、查询事件或链上状态：

```bash
pnpm hardhat run scripts/send-op-tx.ts
```

### 使用 Ignition 部署（声明式）

Ignition 让你用模块化、可恢复的方式声明部署流程：

```ts
// ignition/modules/Counter.ts
import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('CounterModule', (m) => {
  const counter = m.contract('Counter');
  m.call(counter, 'incBy', [5n]);
  return { counter };
});
```

在本地模拟网络上部署：

```bash
pnpm hardhat ignition deploy ignition/modules/Counter.ts
```

### 常见问题与小贴士

- 如果你需要固定链 ID 或端口，本地节点可用 `--chain-id`、`--port` 指定。
- 如果你在 `hardhat.config.ts` 使用了 `configVariable("...")`，请在项目根创建 `.env` 并写入同名变量，或在文件顶部 `import "dotenv/config";`。
- Windows 下建议用 PowerShell/`cross-env` 注入临时环境变量。

### 参考

- 官方文档： [Hardhat 3 入门官方指南](https://hardhat.org/docs/getting-started#getting-started-with-hardhat-3)
