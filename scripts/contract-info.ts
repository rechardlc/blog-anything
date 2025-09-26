import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 合约信息查询脚本（仅读取地址）
async function main() {
  console.log('=== 合约基本信息查询 ===');

  try {
    const deployedAddresses = await loadDeployedAddresses();

    console.log('合约地址:');
    Object.entries(deployedAddresses).forEach(([key, address]) => {
      console.log(`  ${key}: ${address}`);
    });

    // 显示合约类型
    console.log('\n=== 合约类型 ===');
    console.log('  RichardToken: ERC20 代币合约');
    console.log('  Exchange: 去中心化交易所合约');

    // 显示网络信息
    console.log('\n=== 网络信息 ===');
    console.log('  网络: localhost');
    console.log('  链 ID: 31337');
    console.log('  RPC URL: http://localhost:8545');

    // 显示账户信息
    console.log('\n=== 默认账户 ===');
    console.log('  账户1: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    console.log(
      '  账户2: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'
    );

    console.log('\n=== 使用说明 ===');
    console.log('1. 启动本地网络: pnpm ht-local:hnp');
    console.log('2. 部署合约: pnpm ht-deploy');
    console.log(
      '3. 运行测试: npx hardhat run scripts/contract-test.ts test --network localhost'
    );
  } catch (error) {
    console.error(
      '查询失败:',
      error instanceof Error ? error.message : String(error)
    );
  }
}

// 辅助函数：加载部署地址
async function loadDeployedAddresses() {
  const deployedAddressesPath = path.join(
    __dirname,
    '../ignition/deployments/chain-31337/deployed_addresses.json'
  );

  if (!fs.existsSync(deployedAddressesPath)) {
    throw new Error(`部署文件不存在: ${deployedAddressesPath}`);
  }

  return JSON.parse(fs.readFileSync(deployedAddressesPath, 'utf8'));
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
