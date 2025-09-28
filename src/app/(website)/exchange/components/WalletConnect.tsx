'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useExchange } from '../context/ExchangeContext';
import { Wallet, LogOut, RefreshCw } from 'lucide-react';

export function WalletConnect() {
  const {
    address,
    isConnected,
    connectWallet,
    disconnectWallet,
    loading,
    error,
    refreshBalances,
  } = useExchange();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshBalances();
    } finally {
      setRefreshing(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Wallet className='h-5 w-5' />
          钱包连接
        </CardTitle>
        <CardDescription>连接您的钱包以开始交易</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {error && (
          <Alert variant='destructive'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isConnected ? (
          <Button
            onClick={connectWallet}
            disabled={loading}
            className='w-full'
            size='lg'
          >
            {loading ? (
              <>
                <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                连接中...
              </>
            ) : (
              <>
                <Wallet className='mr-2 h-4 w-4' />
                连接钱包
              </>
            )}
          </Button>
        ) : (
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='text-sm font-medium'>已连接</div>
                <div className='text-sm text-muted-foreground font-mono'>
                  {formatAddress(address!)}
                </div>
              </div>
              <Badge
                variant='secondary'
                className='bg-green-100 text-green-800'
              >
                在线
              </Badge>
            </div>

            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={handleRefresh}
                disabled={refreshing}
                className='flex-1'
              >
                {refreshing ? (
                  <RefreshCw className='h-4 w-4 animate-spin' />
                ) : (
                  <RefreshCw className='h-4 w-4' />
                )}
                刷新
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={disconnectWallet}
                className='flex-1'
              >
                <LogOut className='h-4 w-4' />
                断开
              </Button>
            </div>
          </div>
        )}

        <div className='text-xs text-muted-foreground'>
          <p>• 支持 MetaMask 钱包</p>
          <p>• 确保已连接到本地网络 (localhost:8545)</p>
          <p>• 交易需要支付 Gas 费用</p>
        </div>
      </CardContent>
    </Card>
  );
}
