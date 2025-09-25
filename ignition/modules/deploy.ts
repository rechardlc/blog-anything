import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import TokenModule from './token';
import ExchangeModule from './exchange';

// 部署模块：部署两份 RichardToken 与一个 Exchange（feeAccount 使用账户0，fee 1%）
export default buildModule('DexModule', m => {
  const { token } = m.useModule(TokenModule);
  const { exchange } = m.useModule(ExchangeModule);

  return { token, exchange };
});
