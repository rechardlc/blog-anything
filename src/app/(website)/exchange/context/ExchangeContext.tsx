'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  createPublicClient,
  createWalletClient,
  http,
  formatEther,
  parseEther,
} from 'viem';
import { localhost } from 'viem/chains';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';

// Exchange.sol ABI
const EXCHANGE_ABI = [
  {
    inputs: [
      { internalType: 'address', name: '_feeAccount', type: 'address' },
      { internalType: 'uint256', name: '_feePercentage', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'depositEther',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_token', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
    ],
    name: 'depositToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
    name: 'withdrawEther',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_token', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
    ],
    name: 'withdrawToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_token', type: 'address' },
      { internalType: 'address', name: '_user', type: 'address' },
    ],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_tokenGet', type: 'address' },
      { internalType: 'uint256', name: '_tokenGetAmount', type: 'uint256' },
      { internalType: 'address', name: '_tokenGive', type: 'address' },
      { internalType: 'uint256', name: '_tokenGiveAmount', type: 'uint256' },
    ],
    name: 'makeOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '_orderHash', type: 'bytes32' }],
    name: 'cancelOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '_orderHash', type: 'bytes32' }],
    name: 'fillOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '_orderHash', type: 'bytes32' }],
    name: 'getOrder',
    outputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'address', name: 'tokenGet', type: 'address' },
      { internalType: 'uint256', name: 'tokenGetAmount', type: 'uint256' },
      { internalType: 'address', name: 'tokenGive', type: 'address' },
      { internalType: 'uint256', name: 'tokenGiveAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
      { internalType: 'bool', name: 'filled', type: 'bool' },
      { internalType: 'bool', name: 'cancelled', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '_orderHash', type: 'bytes32' }],
    name: 'orderExists',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// RichardToken.sol ABI
const RICHARD_TOKEN_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export interface TokenBalance {
  address: string;
  symbol: string;
  name: string;
  balance: string;
  exchangeBalance: string;
}

export interface Order {
  hash: string;
  user: string;
  tokenGet: string;
  tokenGetAmount: string;
  tokenGive: string;
  tokenGiveAmount: string;
  timestamp: number;
  filled: boolean;
  cancelled: boolean;
}

interface ExchangeContextType {
  // 钱包状态
  address: `0x${string}` | undefined;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;

  // 余额状态
  balances: TokenBalance[];
  refreshBalances: () => Promise<void>;

  // 订单状态
  orders: Order[];
  refreshOrders: () => Promise<void>;

  // 交易功能
  depositEther: (amount: string) => Promise<void>;
  depositToken: (tokenAddress: string, amount: string) => Promise<void>;
  withdrawEther: (amount: string) => Promise<void>;
  withdrawToken: (tokenAddress: string, amount: string) => Promise<void>;
  makeOrder: (
    tokenGet: string,
    tokenGetAmount: string,
    tokenGive: string,
    tokenGiveAmount: string
  ) => Promise<void>;
  fillOrder: (orderHash: string) => Promise<void>;
  cancelOrder: (orderHash: string) => Promise<void>;

  // 加载状态
  loading: boolean;
  error: string | null;
}

const ExchangeContext = createContext<ExchangeContextType | undefined>(
  undefined
);

export function ExchangeProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<`0x${string}` | undefined>();
  const [isConnected, setIsConnected] = useState(false);
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 创建客户端
  const publicClient = createPublicClient({
    chain: localhost,
    transport: http('http://localhost:9999'),
  });

  const walletClient = createWalletClient({
    chain: localhost,
    transport: http('http://localhost:9999'),
  });

  // 代币配置
  const tokens = [
    {
      address: '0x0000000000000000000000000000000000000000' as `0x${string}`,
      symbol: 'ETH',
      name: 'Ethereum',
    },
    {
      address: CONTRACT_ADDRESSES.RICHARD_TOKEN as `0x${string}`,
      symbol: 'RTK',
      name: 'Richard Token',
    },
  ];

  // 连接钱包
  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);

      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        if (accounts.length > 0) {
          setAddress(accounts[0] as `0x${string}`);
          setIsConnected(true);
          await refreshBalances();
        }
      } else {
        throw new Error('请安装 MetaMask 钱包');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '连接钱包失败');
    } finally {
      setLoading(false);
    }
  };

  // 断开钱包
  const disconnectWallet = () => {
    setAddress(undefined);
    setIsConnected(false);
    setBalances([]);
    setOrders([]);
  };

  // 刷新余额
  const refreshBalances = async () => {
    if (!address) return;

    try {
      setLoading(true);
      const newBalances: TokenBalance[] = [];

      for (const token of tokens) {
        let balance = '0';
        let exchangeBalance = '0';

        if (token.address === '0x0000000000000000000000000000000000000000') {
          // ETH 余额
          balance = formatEther(await publicClient.getBalance({ address }));
          exchangeBalance = formatEther(
            await publicClient.readContract({
              address: CONTRACT_ADDRESSES.EXCHANGE as `0x${string}`,
              abi: EXCHANGE_ABI,
              functionName: 'balanceOf',
              args: [token.address, address],
            })
          );
        } else {
          // ERC20 代币余额
          const tokenBalance = await publicClient.readContract({
            address: token.address,
            abi: RICHARD_TOKEN_ABI,
            functionName: 'balanceOf',
            args: [address],
          });
          balance = formatEther(tokenBalance);

          const exchangeTokenBalance = await publicClient.readContract({
            address: CONTRACT_ADDRESSES.EXCHANGE as `0x${string}`,
            abi: EXCHANGE_ABI,
            functionName: 'balanceOf',
            args: [token.address, address],
          });
          exchangeBalance = formatEther(exchangeTokenBalance);
        }

        newBalances.push({
          address: token.address,
          symbol: token.symbol,
          name: token.name,
          balance,
          exchangeBalance,
        });
      }

      setBalances(newBalances);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取余额失败');
    } finally {
      setLoading(false);
    }
  };

  // 刷新订单
  const refreshOrders = async () => {
    // 这里可以实现订单刷新逻辑
    // 由于订单是通过事件获取的，暂时留空
  };

  // ETH 存款
  const depositEther = async (amount: string) => {
    if (!address) throw new Error('请先连接钱包');

    try {
      setLoading(true);
      setError(null);

      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESSES.EXCHANGE as `0x${string}`,
        abi: EXCHANGE_ABI,
        functionName: 'depositEther',
        value: parseEther(amount),
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });
      await refreshBalances();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ETH 存款失败');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 代币存款
  const depositToken = async (tokenAddress: string, amount: string) => {
    if (!address) throw new Error('请先连接钱包');

    try {
      setLoading(true);
      setError(null);

      // 先授权
      const approveHash = await walletClient.writeContract({
        address: tokenAddress as `0x${string}`,
        abi: RICHARD_TOKEN_ABI,
        functionName: 'approve',
        args: [
          CONTRACT_ADDRESSES.EXCHANGE as `0x${string}`,
          parseEther(amount),
        ],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash: approveHash });

      // 再存款
      const depositHash = await walletClient.writeContract({
        address: CONTRACT_ADDRESSES.EXCHANGE as `0x${string}`,
        abi: EXCHANGE_ABI,
        functionName: 'depositToken',
        args: [tokenAddress as `0x${string}`, parseEther(amount)],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash: depositHash });
      await refreshBalances();
    } catch (err) {
      setError(err instanceof Error ? err.message : '代币存款失败');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ETH 提取
  const withdrawEther = async (amount: string) => {
    if (!address) throw new Error('请先连接钱包');

    try {
      setLoading(true);
      setError(null);

      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESSES.EXCHANGE as `0x${string}`,
        abi: EXCHANGE_ABI,
        functionName: 'withdrawEther',
        args: [parseEther(amount)],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });
      await refreshBalances();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ETH 提取失败');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 代币提取
  const withdrawToken = async (tokenAddress: string, amount: string) => {
    if (!address) throw new Error('请先连接钱包');

    try {
      setLoading(true);
      setError(null);

      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESSES.EXCHANGE as `0x${string}`,
        abi: EXCHANGE_ABI,
        functionName: 'withdrawToken',
        args: [tokenAddress as `0x${string}`, parseEther(amount)],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });
      await refreshBalances();
    } catch (err) {
      setError(err instanceof Error ? err.message : '代币提取失败');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 创建订单
  const makeOrder = async (
    tokenGet: string,
    tokenGetAmount: string,
    tokenGive: string,
    tokenGiveAmount: string
  ) => {
    if (!address) throw new Error('请先连接钱包');

    try {
      setLoading(true);
      setError(null);

      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESSES.EXCHANGE as `0x${string}`,
        abi: EXCHANGE_ABI,
        functionName: 'makeOrder',
        args: [
          tokenGet as `0x${string}`,
          parseEther(tokenGetAmount),
          tokenGive as `0x${string}`,
          parseEther(tokenGiveAmount),
        ],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });
      await refreshBalances();
      await refreshOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建订单失败');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 成交订单
  const fillOrder = async (orderHash: string) => {
    if (!address) throw new Error('请先连接钱包');

    try {
      setLoading(true);
      setError(null);

      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESSES.EXCHANGE as `0x${string}`,
        abi: EXCHANGE_ABI,
        functionName: 'fillOrder',
        args: [orderHash as `0x${string}`],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });
      await refreshBalances();
      await refreshOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : '成交订单失败');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 取消订单
  const cancelOrder = async (orderHash: string) => {
    if (!address) throw new Error('请先连接钱包');

    try {
      setLoading(true);
      setError(null);

      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESSES.EXCHANGE as `0x${string}`,
        abi: EXCHANGE_ABI,
        functionName: 'cancelOrder',
        args: [orderHash as `0x${string}`],
        account: address,
      });

      await publicClient.waitForTransactionReceipt({ hash });
      await refreshOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : '取消订单失败');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 检查钱包连接状态
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAddress(accounts[0] as `0x${string}`);
            setIsConnected(true);
          }
        });
    }
  }, []);

  const value: ExchangeContextType = {
    address,
    isConnected,
    connectWallet,
    disconnectWallet,
    balances,
    refreshBalances,
    orders,
    refreshOrders,
    depositEther,
    depositToken,
    withdrawEther,
    withdrawToken,
    makeOrder,
    fillOrder,
    cancelOrder,
    loading,
    error,
  };

  return (
    <ExchangeContext.Provider value={value}>
      {children}
    </ExchangeContext.Provider>
  );
}

export function useExchange() {
  const context = useContext(ExchangeContext);
  if (context === undefined) {
    throw new Error('useExchange must be used within an ExchangeProvider');
  }
  return context;
}

// 扩展 Window 接口
declare global {
  interface Window {
    ethereum?: any;
  }
}
