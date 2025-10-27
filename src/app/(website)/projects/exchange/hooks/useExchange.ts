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

  const tokenContract = useMemo(() => {
    return new Contract(CONTRACT_ADDRESSES.RICHARD_TOKEN, RichardTokenArtifact.abi, provider);
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
  /**
   * 一个ERC20代币转账流程
   * 1. 创建一个token签名器：signer(主要用于操作合约)
   * 2. 单位转换：parseUnits(amount, 18)
   * 3. 授权交易所合约使用用户的RTK
   * 4. 存入RTK到交易所
   * 5. 更新余额
   * 6. 显示成功消息
   * 7. 显示错误消息
   * 8. 错误处理：
   *    - 网络连接失败
   *    - 余额不足
   *    - 区块链节点错误
   *    - 请切换到本地区块链网络
   *    - 未知错误
   *    - 请先连接钱包
   */
  const transferToken = async (amount: string) => {
    try {
      if (!provider) {
        throw new Error('Provider not available');
      }

      // 检查网络连接
      const network = await provider.getNetwork();
      if (Number(network.chainId) !== 31337) {
        throw new Error(`请切换到本地区块链网络。当前链ID: ${network.chainId}, 需要: 31337`);
      }

      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      // 创建带签名器的token合约实例
      const tokenContractSigner = tokenContract.connect(signer) as any;

      // 转换为正确的单位（假设RTK是18位小数）
      const amountInWei = parseUnits(amount, 18);

      // 授权交易所合约使用用户的RTK
      const tx = await tokenContractSigner.approve(CONTRACT_ADDRESSES.EXCHANGE, amountInWei);
      // 每一次授权需要一次等待，因为授权是一个交易
      await tx.wait();
      toast.success('授权成功', {
        description: amount + ' RTK',
        duration: 3000,
        position: 'top-center',
      });

      // 创建带签名器的exchange合约实例
      const exchangeWithSigner = exchangeContract.connect(signer) as any;

      // 存入RTK到交易所
      const tx2 = await exchangeWithSigner.depositToken(CONTRACT_ADDRESSES.RICHARD_TOKEN, amountInWei);
      await tx2.wait();

      // 更新余额
      const rtkBalance = await getExchangeBalance(CONTRACT_ADDRESSES.RICHARD_TOKEN, userAddress, 18);
      setExchangeBalance((prev) => ({
        ...prev,
        rtk: rtkBalance,
      }));

      toast.success('存入成功', {
        description: amount + ' RTK',
        duration: 3000,
        position: 'top-center',
      });
    } catch (error: any) {
      console.error('Transfer token error:', error);

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

      toast.error('存入RTK失败', {
        description: errorMessage,
        duration: 5000,
        position: 'top-center',
      });
    }
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

      // 获取ETH余额
      const ethBalance = await getExchangeBalance(ethaddr, userAddress, 18);

      // 获取RTK余额
      const rtkBalance = await getExchangeBalance(CONTRACT_ADDRESSES.RICHARD_TOKEN, userAddress, 18);

      setExchangeBalance({
        eth: ethBalance,
        rtk: rtkBalance,
      });
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
    getAllBalances,
  };
};

export default useExchange;
