import { BrowserProvider, Signer } from 'ethers';
import { useState, useEffect } from 'react';
export const useConnWallect = (walletType = 'ethereum') => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const connectWallet = async () => {
    console.log('connect wallet ...', window[walletType as keyof Window]);
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
      window[walletType as keyof Window].on('accountsChanged', handleAccountsChanged);
      window[walletType as keyof Window].on('chainChanged', handleChainChanged);
      setAddress(address);
      setSigner(signer);
      setProvider(provider);
      setIsConnected(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleAccountsChanged = (accounts: string[]) => {
    console.log(accounts);
  };
  const handleChainChanged = (chain: string) => {
    console.log(chain, 'chain');
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
    loading,
    error,
    connectWallet,
  };
};
export default useConnWallect;
