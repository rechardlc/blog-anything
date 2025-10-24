import { ethers, formatEther, formatUnits, parseEther, parseUnits } from 'ethers';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import exchangeAbi from '@/artifacts/contracts/Exchange.sol/Exchange.json';
import RichardTokenArtifact from '@/artifacts/contracts/RichardToken.sol/RichardToken.json';
import { BrowserProvider, Contract, WebSocketProvider } from 'ethers';
import { toast } from 'sonner';

const useExchange = (provider: BrowserProvider) => {
  const [exchangeBalance, setExchangeBalance] = useState<{
    eth: string;
    rtk: string;
  }>({
    eth: '0',
    rtk: '0',
  });
  // 创建合约实例
  const exchangeContract = useMemo(() => {
    // 创建合约实例，传入地址，abi，provider
    return new Contract(CONTRACT_ADDRESSES.EXCHANGE, exchangeAbi.abi, provider);
  }, [provider]);

  // 转账ETH不授权，因为不需要授权
  const transferEther = async (amount: string = '1') => {
    try {
      // 检查provider是否可用
      if (!provider) {
        throw new Error('Provider not available. Please connect your wallet.');
      }

      // 检查网络连接
      const network = await provider.getNetwork();
      console.log('Current network:', network);

      // 检查是否连接到正确的网络
      if (Number(network.chainId) !== 31337) {
        throw new Error(`请切换到本地区块链网络。当前链ID: ${network.chainId}, 需要: 31337`);
      }

      // 获取签名器
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      console.log('User address:', userAddress);

      // 检查用户余额
      const balance = await provider.getBalance(userAddress);
      console.log('User balance:', ethers.formatEther(balance), 'ETH');

      // connect方法返回一个合约实例，可以调用合约方法
      const exchangeWithSigner = exchangeContract.connect(signer) as any;

      // 转换为wei： parseEther 方法将 ETH 转换为 wei
      const value = ethers.parseEther(amount);
      console.log('Depositing amount:', amount, 'ETH (', value.toString(), 'wei)');

      // 检查合约地址
      console.log('Exchange contract address:', CONTRACT_ADDRESSES.EXCHANGE);

      // 调用合约方法，发送交易，传入金额
      const tx = await exchangeWithSigner.depositEther({ value: value });
      console.log('Transaction sent:', tx.hash);

      // 等待交易确认： wait 方法等待交易确认,会阻塞线程，直到交易确认
      // 如果发生阻塞的解决方案：
      // 1.使用 React Query/SWR（推荐）：等待交易完成，再更新UI
      const receipt = await tx.wait();
      const ethBalance = await getExchangeBalance(await exchangeContract.ETHER(), userAddress as string, 18);
      setExchangeBalance((prev) => ({
        ...prev,
        eth: ethBalance,
      }));
      console.log('Deposit', '交易hash:', receipt.blockHash);
      toast.success('转入ETH成功', {
        description: amount + ' ETH',
        duration: 3000,
        position: 'top-center',
      });
    } catch (error: any) {
      console.error('Transfer ether error:', error);

      let errorMessage = '未知错误';

      if (error?.code === 'UNSUPPORTED_OPERATION') {
        errorMessage = '请先连接钱包';
      } else if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('fetch')) {
        errorMessage = '网络连接失败，请检查本地区块链是否运行';
      } else if (error?.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = '余额不足';
      } else if (error?.message?.includes('Internal JSON-RPC error')) {
        errorMessage = '区块链节点错误，请检查MetaMask是否连接到本地区块链网络 (链ID: 31337)';
      } else if (error?.message?.includes('请切换到本地区块链网络')) {
        errorMessage = error.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error('转入ETH失败', {
        description: errorMessage,
        duration: 5000,
        position: 'top-center',
      });
    }
  };
  const transferToken = async (amount: string) => {
    if (!provider) {
      throw new Error('Provider not available');
    }
    const signer = await provider.getSigner();
    const tokenContract = new Contract(CONTRACT_ADDRESSES.RICHARD_TOKEN, RichardTokenArtifact.abi, provider);
    const approveTx = await tokenContract.approve(CONTRACT_ADDRESSES.EXCHANGE, amount, { from: signer });
    console.log(approveTx);
  };

  const getExchangeBalance = useCallback(
    async (tokenAddress: string, userAddress: string, unit: number) => {
      const balance = await exchangeContract.balanceOf(tokenAddress, userAddress);
      return formatUnits(balance, unit);
    },
    [exchangeContract],
  );

  const getAllBalances = useCallback(async () => {
    // 检查 provider 是否存在
    if (!provider) {
      console.warn('Provider not available');
      return;
    }

    try {
      const ethaddr = await exchangeContract.ETHER();
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const ethBalance = await getExchangeBalance(ethaddr, userAddress, 18);
      setExchangeBalance((prev) => ({
        ...prev,
        eth: ethBalance,
      }));
    } catch (error) {
      console.error('Error getting all balances:', error);
    }
  }, [exchangeContract, provider, getExchangeBalance]);

  useEffect(() => {
    // 只有当 provider 存在时才执行
    if (provider) {
      getAllBalances();
    }
  }, [provider, getAllBalances]);

  return {
    transferEther,
    transferToken,
    exchangeBalance,
  };
};

export default useExchange;
