import {
  BrowserProvider,
  Signer,
  ethers,
  JsonRpcProvider,
  StaticJsonRpcProvider,
  IpcProvider,
  Eip1193Provider,
  WebSocketProvider,
  AlchemyProvider,
  InfuraProvider,
  FallbackProvider,
  WalletConnectProvider,
  Web3Provider,
} from 'ethers';
import { useState, useEffect } from 'react';
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
  const [balance, setBalance] = useState<string>('0');
  const [network, setNetwork] = useState<{ chainId: number; name?: string } | null>(null);
  const connectWallet = async () => {
    // 是否需要捕获异常，nextjs开发需要捕获异常// 通过errorBoundary捕获异常
    const wallet = window[walletType as keyof Window];
    if (!wallet) {
      setError(`${walletType} is not supported`);
      return;
    }
    setWalletConnect({ address: '', loading: true, provider: null, signer: null });
    try {
      const provider = new BrowserProvider(wallet);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletConnect({ address, loading: false, provider, signer });
      window[walletType as keyof Window].on('accountsChanged', handleAccountsChanged);
      window[walletType as keyof Window].on('chainChanged', handleChainChanged);
    } catch (error) {
      console.error(error);
    } finally {
      setWalletConnect({ address: '', loading: false, provider: null, signer: null });
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
  const handleAccountsChanged = (accounts: string[]) => {
    try {
      const next = accounts?.[0] ?? null;
      setWalletConnect({ address: next, loading: false, provider: null, signer: null });
      if (next && provider) {
        provider.getBalance(next).then((wei) => setBalance(ethers.formatEther(wei)));
      } else {
        setBalance('0');
      }
    } catch (err) {
      // noop
    }
  };
  const handleChainChanged = (chain: string) => {
    try {
      const chainId = Number(chain);
      setNetwork((prev) => ({ ...(prev ?? {}), chainId }));
    } catch (err) {
      // noop
    }
  };
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
  }, []);
  return {
    isConnected,
    address,
    balance,
    network,
    loading,
    error,
    provider,
    signer,
    connectWallet,
    disconnectWallet,
    refreshWallet,
    fetchBalance: async () => {
      if (!provider || !address) return '0';
      const wei = await provider.getBalance(address);
      const eth = ethers.formatEther(wei);
      setBalance(eth);
      return eth;
    },
    getWalletInfo: async () => {
      if (!provider) return null;
      const accounts = address ? [address] : [];
      const net = await provider.getNetwork();
      const eth = address ? ethers.formatEther(await provider.getBalance(address)) : '0';
      const info = {
        accounts,
        address: address ?? undefined,
        balance: eth,
        network: { chainId: Number(net.chainId), name: net.name },
      };
      return info;
    },
  };
};
export default useConnWallect;
