'use client';

import { useState, useEffect } from 'react';
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
import { BookOpen, RefreshCw, ArrowRightLeft } from 'lucide-react';

export function OrderBook() {
  const { orders, isConnected, fillOrder, loading, refreshOrders } =
    useExchange();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshOrders();
    } finally {
      setRefreshing(false);
    }
  };

  const handleFillOrder = async (orderHash: string) => {
    try {
      await fillOrder(orderHash);
      alert('订单成交成功！');
    } catch (error) {
      console.error('成交订单失败:', error);
      alert('成交订单失败，请检查余额是否充足');
    }
  };

  const getTokenSymbol = (address: string) => {
    if (address === '0x0000000000000000000000000000000000000000') {
      return 'ETH';
    }
    return 'RTK';
  };

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    if (num === 0) return '0.00';
    if (num < 0.001) return '< 0.001';
    return num.toFixed(4);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('zh-CN');
  };

  const activeOrders = orders.filter(
    order => !order.filled && !order.cancelled
  );

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BookOpen className='h-5 w-5' />
            订单簿
          </CardTitle>
          <CardDescription>查看所有活跃的交易订单</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>请先连接钱包以查看订单簿</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <BookOpen className='h-5 w-5' />
              订单簿
            </CardTitle>
            <CardDescription>查看所有活跃的交易订单</CardDescription>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <RefreshCw className='h-4 w-4 animate-spin' />
            ) : (
              <RefreshCw className='h-4 w-4' />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activeOrders.length === 0 ? (
          <Alert>
            <AlertDescription>暂无活跃订单</AlertDescription>
          </Alert>
        ) : (
          <div className='space-y-4'>
            {activeOrders.map(order => (
              <div key={order.hash} className='p-4 border rounded-lg space-y-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Badge variant='outline'>
                      {getTokenSymbol(order.tokenGive)} →{' '}
                      {getTokenSymbol(order.tokenGet)}
                    </Badge>
                    <span className='text-sm text-muted-foreground'>
                      {formatAddress(order.user)}
                    </span>
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    {formatTimestamp(order.timestamp)}
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <div className='text-sm text-muted-foreground'>给出</div>
                    <div className='font-mono'>
                      {formatAmount(order.tokenGiveAmount)}{' '}
                      {getTokenSymbol(order.tokenGive)}
                    </div>
                  </div>
                  <div>
                    <div className='text-sm text-muted-foreground'>获得</div>
                    <div className='font-mono'>
                      {formatAmount(order.tokenGetAmount)}{' '}
                      {getTokenSymbol(order.tokenGet)}
                    </div>
                  </div>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='text-sm'>
                    <span className='text-muted-foreground'>汇率: </span>
                    <span className='font-mono'>
                      1 {getTokenSymbol(order.tokenGive)} ={' '}
                      {(
                        parseFloat(order.tokenGetAmount) /
                        parseFloat(order.tokenGiveAmount)
                      ).toFixed(6)}{' '}
                      {getTokenSymbol(order.tokenGet)}
                    </span>
                  </div>
                  <Button
                    size='sm'
                    onClick={() => handleFillOrder(order.hash)}
                    disabled={loading}
                  >
                    <ArrowRightLeft className='h-4 w-4 mr-1' />
                    成交
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className='mt-4 text-xs text-muted-foreground'>
          <p>• 点击&ldquo;成交&rdquo;按钮可以立即成交该订单</p>
          <p>• 成交时需要支付 0.25% 手续费</p>
          <p>• 确保您有足够的代币余额</p>
        </div>
      </CardContent>
    </Card>
  );
}
