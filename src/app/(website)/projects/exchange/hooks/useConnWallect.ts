import { BrowserProvider, Signer, ethers } from 'ethers';
import { useState, useEffect } from 'react';
export const useConnWallect = (walletType = 'ethereum') => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
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
    setLoading(true);
    try {
      const provider = new BrowserProvider(wallet);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const wei = await provider.getBalance(address);
      const net = await provider.getNetwork();
      setAddress(address);
      setSigner(signer);
      setProvider(provider);
      setIsConnected(true);
      console.log(ethers.formatEther(wei), net.chainId, net.name, 'wallet-info');
      // setBalance(ethers.formatEther(wei));
      // setNetwork({ chainId: Number(net.chainId), name: net.name });
      // console.log({ balance: ethers.formatEther(wei), network: net }, 'wallet-info');
      window[walletType as keyof Window].on('accountsChanged', handleAccountsChanged);
      window[walletType as keyof Window].on('chainChanged', handleChainChanged);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setSigner(null);
    setProvider(null);
    setError(null);
  };
  const refreshWallet = () => {
    disconnectWallet();
    connectWallet();
  };
  const handleAccountsChanged = (accounts: string[]) => {
    try {
      const next = accounts?.[0] ?? null;
      setAddress(next);
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
