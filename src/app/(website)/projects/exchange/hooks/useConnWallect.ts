import {
  BrowserProvider,
  Signer,
  ethers,
  Contract,
  JsonRpcProvider,
  Eip1193Provider,
  WebSocketProvider,
  AlchemyProvider,
  InfuraProvider,
  FallbackProvider,
} from 'ethers';
import { toast } from 'sonner';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
// import ExchangeArtifact from '@/artifacts/contracts/Exchange.sol/Exchange.json';
import TokenArtifact from '@/artifacts/contracts/RichardToken.sol/RichardToken.json';
type wallectConnect = {
  address: string;
  loading: boolean;
  provider: BrowserProvider | null;
  signer: Signer | null;
};
export const useConnWallect = (walletType = 'ethereum') => {
  const [walletConnect, setWalletConnect] = useState<wallectConnect>({
    address: '',
    loading: false,
    provider: null,
    signer: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [network, setNetwork] = useState<{ chainId: number; name?: string } | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [tokenBalance, setTokenBalance] = useState({
    ethBanlance: '0',
    rtkBanlance: '0',
  });

  // 使用 ref 来获取最新的 walletConnect 状态
  const walletConnectRef = useRef(walletConnect);
  walletConnectRef.current = walletConnect;

  // const isConnected = useMemo(() => walletConnect.address !== '', [walletConnect.address]);

  const connectWallet = async () => {
    // 防止重复点击
    if (walletConnect.loading) {
      toast.warning('正在连接中，请稍候...', {
        duration: 2000,
        position: 'top-center',
      });
      return;
    }

    // 是否需要捕获异常，nextjs开发需要捕获异常// 通过errorBoundary捕获异常
    const wallet = window[walletType as keyof Window];
    if (!wallet) {
      setError(`${walletType} is not supported`);
      return;
    }
    setWalletConnect({ address: '', loading: true, provider: null, signer: null });
    try {
      // 通过钱包类型获取provider
      const provider = new BrowserProvider(wallet);
      // 获取钱包账户
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletConnect({ address, loading: false, provider, signer });
      // 监听钱包账户变化
      window[walletType as keyof Window].on('accountsChanged', handleAccountsChanged);
      // 监听钱包链变化
      window[walletType as keyof Window].on('chainChanged', handleChainChanged);
    } catch (error) {
      setWalletConnect((prev) => ({ ...prev, loading: false }));
      const errorObj = JSON.parse(JSON.stringify(error));
      // 提取错误信息
      const errorMessage = errorObj.error?.message || '连接钱包失败';
      toast.error('连接钱包失败', {
        description: errorMessage,
        duration: 5000,
        position: 'top-center',
      });

      // console.error('钱包连接错误详情:', error);
      setError(errorMessage);
    }
  };
  const disconnectWallet = () => {
    setWalletConnect({ address: '', loading: false, provider: null, signer: null });
    setError(null);
  };
  const refreshWallet = () => {
    disconnectWallet();
    connectWallet();
  };
  const fetchAllBalances = async (provider: BrowserProvider, address: string) => {
    // 获取ETH余额
    const ethBalance = await provider?.getBalance(address);
    // 转换ETH余额
    const ethBalanceFormatted = ethers.formatUnits(ethBalance, 'ether');
    // 构造一个合约对象
    const tokenContract = new Contract(CONTRACT_ADDRESSES.RICHARD_TOKEN, TokenArtifact.abi, provider);
    // 获取RTK余额
    const rtkBalance = await tokenContract.balanceOf(address);
    // 获取RTK的decimals
    const decimals = await tokenContract.DECIMALS();
    // 转化RTK余额
    const rtkBalanceFormatted = ethers.formatUnits(rtkBalance, decimals);
    setTokenBalance((prev) => ({
      ...prev,
      ethBanlance: ethBalanceFormatted,
      rtkBanlance: rtkBalanceFormatted,
    }));
  };
  const handleAccountsChanged = useCallback(async (accounts: string[]) => {
    try {
      const next = accounts?.[0] ?? null;
      const currentWalletConnect = walletConnectRef.current; // 使用 ref 获取最新状态
      console.log(next, currentWalletConnect);

      if (next && currentWalletConnect.provider) {
        // 账户切换：更新 signer 和地址，保持 provider
        const signer = await currentWalletConnect.provider.getSigner();
        const address = await signer.getAddress();
        fetchAllBalances(currentWalletConnect.provider, address);
        setWalletConnect((prev) => ({
          ...prev,
          address,
          loading: false,
          signer,
        }));
      } else if (!next) {
        // 账户断开：清空所有状态
        disconnectWallet();
      }
    } catch (err) {
      console.error('账户切换失败:', err);
      setWalletConnect((prev) => ({ ...prev, loading: false }));
      toast.error('账户切换失败');
    }
  }, []);
  const handleChainChanged = useCallback((chain: string) => {
    console.log('chain|||||:', chain);
    try {
      const chainId = Number(chain);
      setNetwork((prev) => ({ ...(prev ?? {}), chainId }));
    } catch (err) {
      // noop
    }
  }, []);
  // 组件卸载/页面离开时移除事件监听，防止内存泄漏和重复绑定
  useEffect(() => {
    return () => {
      try {
        window[walletType as keyof Window].removeListener('accountsChanged', handleAccountsChanged);
        window[walletType as keyof Window].removeListener('chainChanged', handleChainChanged);
      } catch (err) {
        // 忽略移除异常，保证卸载不抛错
      }
    };
  }, [walletType, handleAccountsChanged, handleChainChanged]);
  useEffect(() => {
    if (walletConnect.provider && walletConnect.address) {
      fetchAllBalances(walletConnect.provider, walletConnect.address);
    }
    setIsConnected(walletConnect.address !== '');
  }, [walletConnect.provider, walletConnect.address]);
  return {
    ...walletConnect,
    isConnected,
    // balance,
    network,
    error,
    tokenBalance,
    connectWallet,
    disconnectWallet,
    refreshWallet,
    // fetchBalance: async () => {
    //   if (!provider || !address) return '0';
    //   const wei = await provider.getBalance(address);
    //   const eth = ethers.formatEther(wei);
    //   setBalance(eth);
    //   return eth;
    // },
    // getWalletInfo: async () => {
    //   if (!provider) return null;
    //   const accounts = address ? [address] : [];
    //   const net = await provider.getNetwork();
    //   const eth = address ? ethers.formatEther(await provider.getBalance(address)) : '0';
    //   const info = {
    //     accounts,
    //     address: address ?? undefined,
    //     balance: eth,
    //     network: { chainId: Number(net.chainId), name: net.name },
    //   };
    //   return info;
    // },
  };
};
export default useConnWallect;
