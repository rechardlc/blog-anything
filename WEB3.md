## 测试网络

### ganache + truffle

1. ganache初始化一个本地区块链网络
   - pnpm add ganache
   - npx ganache -d 可以保持区块链不变
2. truffle 本地开发环境
   - pnpm add truffle
   - npx truffle init
   - npx truffle:migrate [ˈtrʌf(ə)l][ˈmaɪˌɡreɪt]

### hardhat + foundry(现在开发中基本都是这种方案)

1. 初始化一个本地网络、开发、测试
   - npx hardhat node --port
   - npx hardhat compile
   - npx hardhat deploy
   - npx hardhat test
2. 关于测试，区块链一旦部署无法改变，所以无法改变代码实现热更新
   - 通过引入console.log插件，可以测试
   - 模拟热更新，通过nodemon实现简单的热更新：nodemon --watch contracts/ --exec 'npx hardhat test'
