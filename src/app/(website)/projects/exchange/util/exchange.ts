'use client';

import { BrowserProvider, Contract, formatUnits, getAddress, parseUnits } from 'ethers';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
// 依赖 Hardhat 产物路径（确保编译产物存在）
import ExchangeArtifact from '@/artifacts/contracts/Exchange.sol/Exchange.json';
import TokenArtifact from '@/artifacts/contracts/RichardToken.sol/RichardToken.json';

type Ctx = {
  provider: BrowserProvider;
  signerAddress: string;
};

export function getContracts(provider: BrowserProvider) {
  const exchange = new Contract(CONTRACT_ADDRESSES.EXCHANGE, ExchangeArtifact.abi, provider);
  const token = new Contract(CONTRACT_ADDRESSES.RICHARD_TOKEN, TokenArtifact.abi, provider);
  return { exchange, token };
}

// 读取余额（交易所内余额）
export async function exBalanceOf(ctx: Ctx, tokenAddr: string, user: string) {
  const { exchange } = getContracts(ctx.provider);
  return await exchange.balanceOf(getAddress(tokenAddr), getAddress(user));
}

// 读取钱包余额（ERC20）
export async function erc20Balance(ctx: Ctx, tokenAddr: string, user: string, decimals = 18) {
  const token = new Contract(getAddress(tokenAddr), TokenArtifact.abi, ctx.provider);
  const bal = await token.balanceOf(getAddress(user));
  return { raw: bal, display: formatUnits(bal, decimals) };
}

// 授权 RTK 给交易所
export async function approveToken(ctx: Ctx, amount: string, decimals = 18) {
  const { provider } = ctx;
  const signer = await provider.getSigner();
  const token = new Contract(CONTRACT_ADDRESSES.RICHARD_TOKEN, TokenArtifact.abi, signer);
  const tx = await token.approve(CONTRACT_ADDRESSES.EXCHANGE, parseUnits(amount, decimals));
  return await tx.wait();
}

// 充值 RTK 到交易所
export async function depositToken(ctx: Ctx, amount: string, decimals = 18) {
  const { provider } = ctx;
  const signer = await provider.getSigner();
  const exchange = new Contract(CONTRACT_ADDRESSES.EXCHANGE, ExchangeArtifact.abi, signer);
  const tx = await exchange.depositToken(CONTRACT_ADDRESSES.RICHARD_TOKEN, parseUnits(amount, decimals));
  return await tx.wait();
}

// 充值 ETH 到交易所
export async function depositEther(ctx: Ctx, amountEth: string) {
  const { provider } = ctx;
  const signer = await provider.getSigner();
  const exchange = new Contract(CONTRACT_ADDRESSES.EXCHANGE, ExchangeArtifact.abi, signer);
  const tx = await exchange.depositEther({ value: parseUnits(amountEth, 18) });
  return await tx.wait();
}

// 创建订单（以 RTK 换 ETH 示例：tokenGet=ETH(0地址), tokenGive=RTK）
export async function makeOrder_RTK_for_ETH(ctx: Ctx, tokenGetAmountEth: string, tokenGiveAmountRTK: string) {
  const { provider } = ctx;
  const signer = await provider.getSigner();
  const exchange = new Contract(CONTRACT_ADDRESSES.EXCHANGE, ExchangeArtifact.abi, signer);
  const ETHER = '0x0000000000000000000000000000000000000000';
  const tx = await exchange.makeOrder(
    ETHER,
    parseUnits(tokenGetAmountEth, 18),
    CONTRACT_ADDRESSES.RICHARD_TOKEN,
    parseUnits(tokenGiveAmountRTK, 18),
  );
  const receipt = await tx.wait();
  // 解析 OrderCreated 获取 orderHash
  const created = receipt.logs
    .map((l: any) => {
      try {
        return exchange.interface.parseLog(l);
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .find((x: any) => x!.name === 'OrderCreated') as any | undefined;

  return { receipt, orderHash: created?.args?.orderHash as string | undefined };
}

// 成交订单（对手方：以 ETH 换 RTK）
export async function fillOrder(ctx: Ctx, orderHash: string) {
  const { provider } = ctx;
  const signer = await provider.getSigner();
  const exchange = new Contract(CONTRACT_ADDRESSES.EXCHANGE, ExchangeArtifact.abi, signer);
  const tx = await exchange.fillOrder(orderHash);
  return await tx.wait();
}

// 提现
export async function withdrawToken(ctx: Ctx, amount: string, decimals = 18) {
  const { provider } = ctx;
  const signer = await provider.getSigner();
  const exchange = new Contract(CONTRACT_ADDRESSES.EXCHANGE, ExchangeArtifact.abi, signer);
  const tx = await exchange.withdrawToken(CONTRACT_ADDRESSES.RICHARD_TOKEN, parseUnits(amount, decimals));
  return await tx.wait();
}

export async function withdrawEther(ctx: Ctx, amountEth: string) {
  const { provider } = ctx;
  const signer = await provider.getSigner();
  const exchange = new Contract(CONTRACT_ADDRESSES.EXCHANGE, ExchangeArtifact.abi, signer);
  const tx = await exchange.withdrawEther(parseUnits(amountEth, 18));
  return await tx.wait();
}

// useEffect(() => {
//   if (!provider) return;
//   const { exchange } = getContracts(provider);

//   const onDeposit = (token: string, user: string, amount: bigint) => {
//     if (address && user.toLowerCase() === address.toLowerCase()) {
//       toast.info(`Deposit: token=${token} amount=${amount.toString()}`);
//     }
//   };
//   const onOrderCreated = (orderHash: string) => {
//     toast.message(`OrderCreated: ${orderHash}`);
//   };
//   exchange.on('Deposit', onDeposit);
//   exchange.on('OrderCreated', onOrderCreated);

//   return () => {
//     exchange.off('Deposit', onDeposit);
//     exchange.off('OrderCreated', onOrderCreated);
//   };
// }, [provider, address]);
