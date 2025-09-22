## 去中心化代币与撮合所 DApp 产品需求文档（PRD）

### 版本信息

- **文档版本**: v1.0.0
- **最后更新**: 2025-09-22
- **适用代码**: `contracts/richardToken.sol`, `contracts/exchange.sol`

### 1. 背景与目标

- **背景**: 基于自研 ERC20 简化实现（RichardToken）与托管撮合型交易所（Exchange）两份合约，交付一个最小可用（MVP）的链上交易 DApp。
- **目标**: 实现代币充值/提现、授权、链上下单、撤单、成交的闭环，并在前端提供直观、可靠的操作与状态展示。
- **成功标准**: 用户可在本地链/测试网完成从授权、充值、下单到成交、提现的全流程，且关键事件与余额同步准确。

### 2. 用户与场景

- **用户画像**:
  - 有一定加密钱包使用经验的开发者/早期用户
  - 具备基本链上交互知识（授权、Gas、交易确认）
- **核心场景**:
  - 连接钱包 → 授权 `Exchange` 代用户划转 `RTK` → 充值 `RTK/ETH` → 下单 → 由他人撮合成交 → 查询订单与托管余额 → 提现

### 3. 术语与定义

- **RTK**: RichardToken，简化 ERC20 代币实现。
- **托管余额**: 用户在 `Exchange` 合约内的资产，独立于钱包余额。
- **订单哈希（orderHash）**: 订单唯一键，由合约基于多种上下文生成。
- **基点**: 费用比率单位，10000 基点 = 100%。

### 4. 范围（Scope）

- **在范围内**:
  - 钱包连接、网络与合约地址配置
  - 代币授权（approve/increase/decrease）、转账（合约内部使用）
  - 充值/提现（ETH/RTK）
  - 下单、撤单、成交（含部分成交）
  - 成交手续费扣除与分发（按基点制，收取 tokenGet 侧手续费并划转给 feeAccount）
  - 事件监听与状态刷新
- **不在范围内（本期不做）**:
  - 价格撮合引擎、订单簿排序与撮合规则
  - K 线、深度图、做市策略

### 5. 功能需求

#### 5.1 钱包与环境

- 连接/断开钱包，显示当前账户与网络信息。
- 配置并持久化合约地址（`RichardToken` 与 `Exchange`）。

#### 5.2 代币模块（RTK）

- 展示基础信息：`NAME/SYMBOL/DECIMALS/totalSupply`。
- 展示并刷新钱包内 `RTK` 余额与授权额度。
- 操作：`approve`、`increaseAllowance`、`decreaseAllowance`（前置校验与反馈）。

#### 5.3 托管账户（Exchange）

- 展示托管余额：`balanceOf(ETHER/RTK, user)`。
- 充值：
  - ETH：`depositEther()`，输入金额，发起 payable 交易。
  - RTK：`depositToken(token, amount)`，需先 `approve`，再充值。
- 提现：
  - ETH：`withdrawEther(amount)`。
  - RTK：`withdrawToken(token, amount)`。

#### 5.4 订单与撮合

- 下单：`makeOrder(tokenGet, tokenGetAmount, tokenGive, tokenGiveAmount)`。
- 撤单：`cancelOrder(orderHash)`（仅限订单所有者、未成交/未取消）。
- 成交：`fillOrder(orderHash, amount)`（允许部分成交，不得自成交）。
  - 手续费（基点制）：
    - 费率：`feePercentage`（单位：基点，10000 = 100%）
    - 成交额（以 tokenGet 计）：`amount`
    - 手续费：`feeAmount = amount * feePercentage / 10000`
    - 记账：从成交者（filler）支付的 tokenGet 中扣除 `feeAmount` 划转至 `feeAccount`，其余净额划转给订单创建者（maker）。
- 订单展示：我的订单（前端缓存/索引事件）、订单状态（filled/cancelled）。

#### 5.5 事件与通知

- 监听并处理：`Deposit`、`Withdraw`、`OrderCreated`、`OrderCancelled`、`OrderFilled`、`Transfer`、`Approval`。
- 基于事件增量刷新 UI，提供交易状态与错误提示。

### 6. 非功能需求

- **可用性**: 表单校验完善、错误友好提示、交易状态清晰（Pending/Success/Failed）。
- **性能**: 列表本地分页；事件订阅去抖/合并更新。
- **安全性**: 前端防重复提交；金额与地址严格校验；不展示助记词等敏感信息。
- **兼容性**: 推荐使用 Chrome + MetaMask；支持本地链与测试网。

### 7. 合约接口摘要（对接规范）

> 以下为前端/服务对接的最小必要集合，完整实现以源码为准。

#### 7.1 RichardToken（ERC20 简化）

- 只读：
  - `getTotalSupply() view -> uint256`
  - `getBalance(address) view -> uint256`
  - `getAllowance(owner, spender) view -> uint256`
- 写入：
  - `approve(spender, value) -> bool`
  - `increaseAllowance(spender, addedValue) -> bool`
  - `decreaseAllowance(spender, subtractedValue) -> bool`
  - `transfer(to, value) nonReentrant -> bool`
  - `transferFrom(from, to, value) nonReentrant -> bool`
- 事件：`Transfer`, `Approval`

#### 7.2 Exchange（托管撮合）

- 只读：
  - `balanceOf(token, user) view -> uint256`
  - `getOrder(orderHash) view -> (id, user, tokenGet, tokenGetAmount, tokenGive, tokenGiveAmount, timestamp, filled, cancelled)`
  - `orderExists(orderHash) view -> bool`
- 写入：
  - `depositEther() payable`
  - `depositToken(token, amount)`
  - `withdrawEther(amount)`
  - `withdrawToken(token, amount)`
  - `makeOrder(tokenGet, tokenGetAmount, tokenGive, tokenGiveAmount)`
  - `cancelOrder(orderHash)`
  - `fillOrder(orderHash, amount)`
- 事件：`Deposit`, `Withdraw`, `OrderCreated`, `OrderCancelled`, `OrderFilled`, `FeeCharged(orderHash, feeAccount, feeAmount)`
  - 费用约定：以 tokenGet 为计费资产，单位与精度与 tokenGet 一致。

### 8. 业务流程（UML 简述）

1. 授权与充值（RTK）
   - 用户 → RTK.approve(Exchange, X) → 成功
   - 用户 → Exchange.depositToken(RTK, X) → 托管余额 +X → 事件 `Deposit`
2. 下单
   - 用户 → Exchange.makeOrder(tokenGet, amountGet, tokenGive, amountGive) → 订单创建 → 事件 `OrderCreated`
3. 成交
   - 其他用户充值所需资产 → Exchange.fillOrder(orderHash, amount) → 部分或全部成交 → 事件 `OrderFilled`
4. 撤单
   - 订单所有者 → Exchange.cancelOrder(orderHash) → 事件 `OrderCancelled`
5. 提现
   - 用户 → Exchange.withdrawEther/withdrawToken(amount) → 事件 `Withdraw`

### 9. 数据模型（前端视角）

- `WalletState`: { address, chainId, connected }
- `ContractConfig`: { rtkAddress, exchangeAddress }
- `Balances`: { walletRTK, walletETH, escrowRTK, escrowETH }
- `Allowance`: { rtkForExchange }
- `Order`: { orderHash, user, tokenGet, tokenGetAmount, tokenGive, tokenGiveAmount, timestamp, filled, cancelled }
- `TxState`: { hash, status: Pending|Success|Failed, error? }

### 10. 界面信息架构（IA）

- 顶部：钱包连接区（地址、网络、连接按钮）
- 代币：RTK 基本信息、钱包余额、授权操作
- 托管：充值/提现（ETH/RTK）、托管余额展示
- 订单：下单表单、我的订单列表（状态、操作：撤单/成交）
- 通知：交易状态、事件通知、错误提示

### 11. 表单与校验

- 金额：必须为正数；小数位不超过 `DECIMALS`；余额与授权额度预校验。
- 地址：EVM 地址格式校验，拒绝 `0x000...000`。
- 订单：`tokenGet != tokenGive`；`amount > 0`。

### 12. 指标与验收

- 功能通过率：授权、充值/提现、下单/成交/撤单全链路通过。
- 事件准确率：事件与状态一致，UI 在 2s 内刷新。
- 失败可解释性：链上错误信息在 UI 内可读展示（含 require 文案）。
- 费用正确性：`FeeCharged` 事件与账本一致；`feeAmount = amount * feePercentage / 10000` 精确落地（整数向下取整）。

### 13. 边界与风险

- 手续费精度：整数除法向下取整，可能导致极小“尘埃”未计；不影响资金安全。
- 订单哈希：区块上下文参与生成，碰撞概率极低但非零；代码已做存在性校验。
- 重入安全：关键写入路径含 `nonReentrant`；前端仍需做防抖和禁重复提交。

### 14. 路线图（Roadmap）

- v1.1：加入手续费扣除与分发；事件补充（FeeCharged）。
- v1.2：加入链下订单索引与订单簿 UI；筛选/搜索。
- v1.3：订单过期、最小成交量、批量成交。

### 15. 交付清单

- 前端页面（Next.js）：钱包连接、授权、充值/提现、下单、撤单、成交、订单与余额视图。
- 环境配置：合约地址、RPC、链 ID、区块浏览器链接（可选）。
- 使用说明：README/WEB3.md 增补操作指引与常见问题。

### 16. 测试要点（抽样）

- 授权：approve/increase/decrease 边界（0 值、相等、自授权）。
- 充值/提现：余额不足、0 值、失败回滚信息可见性。
- 下单：参数非法、余额不足、同 token 下单拒绝。
- 成交：部分/全部成交、余额与状态一致；自成交应失败。
- 撤单：非拥有者/已撤单/已成交路径应失败。
- 事件：监听准确、UI 刷新及时；断网/切链恢复策略。
