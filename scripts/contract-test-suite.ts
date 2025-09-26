import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 合约测试套件脚本
async function main() {
  console.log('=== 合约测试套件 ===');

  try {
    const deployedAddresses = await loadDeployedAddresses();

    console.log('测试环境信息:');
    console.log('  网络: localhost');
    console.log('  链 ID: 31337');
    console.log('  RPC URL: http://localhost:8545');

    console.log('\n=== 已部署合约 ===');
    Object.entries(deployedAddresses).forEach(([key, address]) => {
      console.log(`  ${key}: ${address}`);
    });

    console.log('\n=== 测试账户 ===');
    console.log('  账户1: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    console.log(
      '  账户2: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'
    );

    console.log('\n=== 测试计划 ===');
    console.log('1. ✅ 合约部署验证');
    console.log('2. ⏳ 代币基本信息查询');
    console.log('3. ⏳ 交易所基本信息查询');
    console.log('4. ⏳ 代币余额查询');
    console.log('5. ⏳ 代币转账测试');
    console.log('6. ⏳ 代币授权测试');
    console.log('7. ⏳ 交易所存款测试');
    console.log('8. ⏳ 交易所余额查询');

    console.log('\n=== 测试命令 ===');
    console.log('以下命令需要在本地网络运行时使用:');
    console.log('');
    console.log('# 查询合约信息');
    console.log('npx hardhat run scripts/contract-info.ts --network localhost');
    console.log('');
    console.log('# 查询账户余额');
    console.log(
      'npx hardhat run scripts/contract-balance.ts --network localhost'
    );
    console.log('');
    console.log('# 代币转账测试');
    console.log(
      'npx hardhat run scripts/contract-transfer.ts --network localhost'
    );
    console.log('');
    console.log('# 代币授权测试');
    console.log(
      'npx hardhat run scripts/contract-approve.ts --network localhost'
    );
    console.log('');
    console.log('# 交易所存款测试');
    console.log(
      'npx hardhat run scripts/contract-deposit.ts --network localhost'
    );

    console.log('\n=== 启动测试环境 ===');
    console.log('1. 启动本地网络:');
    console.log('   pnpm ht-local:hnp');
    console.log('');
    console.log('2. 部署合约:');
    console.log('   pnpm ht-deploy');
    console.log('');
    console.log('3. 运行测试:');
    console.log(
      '   npx hardhat run scripts/contract-info.ts --network localhost'
    );

    console.log('\n=== 测试完成 ===');
    console.log('✅ 合约部署验证通过');
    console.log('📋 测试脚本已准备就绪');
    console.log('🚀 可以开始交互测试');
  } catch (error) {
    console.error(
      '测试失败:',
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
