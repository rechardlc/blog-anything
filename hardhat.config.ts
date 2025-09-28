// 引入 dotenv 配置环境变量，才可以读取环境变量
import 'dotenv/config';
import type { HardhatUserConfig } from 'hardhat/config';

import hardhatToolboxViemPlugin from '@nomicfoundation/hardhat-toolbox-viem';
import { configVariable } from 'hardhat/config';
// import './tasks/test-simple';

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViemPlugin],
  paths: {
    artifacts: './src/artifacts', // 打包目录修改为react项目目录，方便引入
  },
  solidity: {
    profiles: {
      default: {
        version: '0.8.0',
      },
      production: {
        version: '0.8.0',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    localhost: {
      type: 'http',
      chainType: 'l1',
      chainId: 31337,
      url: configVariable('LOCALHOST_RPC_URL'),
      accounts: [
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
        '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
      ],
    },
    hardhatMainnet: {
      type: 'edr-simulated',
      chainType: 'l1',
    },
    hardhatOp: {
      type: 'edr-simulated',
      chainType: 'op',
    },
    sepolia: {
      type: 'http',
      chainType: 'l1',
      url: configVariable('SEPOLIA_RPC_URL'),
      accounts: [configVariable('SEPOLIA_PRIVATE_KEY')],
    },
  },
};

export default config;
