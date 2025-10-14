import { ethers, formatEther } from 'ethers';
import { useEffect, useMemo } from 'react';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import exchangeAbi from '@/artifacts/contracts/Exchange.sol/Exchange.json';
import { BrowserProvider, Contract, WebSocketProvider } from 'ethers';
import { toast } from 'sonner';

const useExchange = (provider: BrowserProvider) => {
  // 创建合约实例
  const exchangeContract = useMemo(() => {
    // 创建合约实例，传入地址，abi，provider
    return new Contract(CONTRACT_ADDRESSES.EXCHANGE, exchangeAbi.abi, provider);
  }, [provider]);
  useEffect(() => {
    if (!exchangeContract) return;
    // exchangeContract.on('Deposit', (token: string, user: string, amount: string, balance: string) => {
    //   console.log('Deposit', token, user, formatEther(amount), formatEther(balance));
    // });
    return () => {
      // exchangeContract.off('Deposit');
    };
  }, [exchangeContract]);
  // 转账ETH不授权，因为不需要授权
  const transferEther = async (amount: string = '1') => {
    try {
      // 获取签名器
      const signer = await provider.getSigner();
      // connect方法返回一个合约实例，可以调用合约方法
      const exchangeWithSigner = exchangeContract.connect(signer) as any;
      // 转换为wei： parseEther 方法将 ETH 转换为 wei
      const value = ethers.parseEther(amount);
      // 调用合约方法，发送交易，传入金额
      const tx = await exchangeWithSigner.depositEther({ value: value });
      // 等待交易确认： wait 方法等待交易确认,会阻塞线程，直到交易确认
      // 如果发生阻塞的解决方案：
      // 1.使用 React Query/SWR（推荐）：等待交易完成，再更新UI
      const receipt = await tx.wait();
      console.log('Deposit', '交易hash:', receipt.blockHash);
      toast.success('转入ETH成功', {
        description: amount + ' ETH',
        duration: 3000,
        position: 'top-center',
      });
    } catch (error) {
      toast.error('转入ETH失败', {
        description: error instanceof Error ? error.message : '未知错误',
        duration: 3000,
        position: 'top-center',
      });
    }
  };
  const transferToken = async (to: string, amount: string) => {
    const signer = await provider.getSigner();
    await exchangeContract.transferToken(to, amount, { from: signer });
  };
  return {
    transferEther,
    transferToken,
  };
};

export default useExchange;
