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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useExchange } from '../context/ExchangeContext';
import { User, RefreshCw, X, CheckCircle } from 'lucide-react';

export function MyOrders() {
  const { orders, isConnected, cancelOrder, loading, refreshOrders } =
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

  const handleCancelOrder = async (orderHash: string) => {
    if (!confirm('确定要取消这个订单吗？')) {
      return;
    }

    try {
      await cancelOrder(orderHash);
      alert('订单取消成功！');
    } catch (error) {
      console.error('取消订单失败:', error);
      alert('取消订单失败');
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

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('zh-CN');
  };

  const formatOrderHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  const activeOrders = orders.filter(
    order => !order.filled && !order.cancelled
  );
  const filledOrders = orders.filter(order => order.filled);
  const cancelledOrders = orders.filter(order => order.cancelled);

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <User className='h-5 w-5' />
            我的订单
          </CardTitle>
          <CardDescription>查看和管理您的交易订单</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>请先连接钱包以查看您的订单</AlertDescription>
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
              <User className='h-5 w-5' />
              我的订单
            </CardTitle>
            <CardDescription>查看和管理您的交易订单</CardDescription>
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
        <Tabs defaultValue='active' className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='active'>
              活跃 ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value='filled'>
              已成交 ({filledOrders.length})
            </TabsTrigger>
            <TabsTrigger value='cancelled'>
              已取消 ({cancelledOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value='active' className='space-y-4'>
            {activeOrders.length === 0 ? (
              <Alert>
                <AlertDescription>暂无活跃订单</AlertDescription>
              </Alert>
            ) : (
              activeOrders.map(order => (
                <div
                  key={order.hash}
                  className='p-4 border rounded-lg space-y-3'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Badge variant='outline'>
                        {getTokenSymbol(order.tokenGive)} →{' '}
                        {getTokenSymbol(order.tokenGet)}
                      </Badge>
                      <span className='text-sm text-muted-foreground font-mono'>
                        {formatOrderHash(order.hash)}
                      </span>
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleCancelOrder(order.hash)}
                      disabled={loading}
                    >
                      <X className='h-4 w-4' />
                    </Button>
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

                  <div className='text-sm text-muted-foreground'>
                    创建时间: {formatTimestamp(order.timestamp)}
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value='filled' className='space-y-4'>
            {filledOrders.length === 0 ? (
              <Alert>
                <AlertDescription>暂无已成交订单</AlertDescription>
              </Alert>
            ) : (
              filledOrders.map(order => (
                <div
                  key={order.hash}
                  className='p-4 border rounded-lg space-y-3'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Badge
                        variant='default'
                        className='bg-green-100 text-green-800'
                      >
                        <CheckCircle className='h-3 w-3 mr-1' />
                        已成交
                      </Badge>
                      <span className='text-sm text-muted-foreground font-mono'>
                        {formatOrderHash(order.hash)}
                      </span>
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

                  <div className='text-sm text-muted-foreground'>
                    创建时间: {formatTimestamp(order.timestamp)}
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value='cancelled' className='space-y-4'>
            {cancelledOrders.length === 0 ? (
              <Alert>
                <AlertDescription>暂无已取消订单</AlertDescription>
              </Alert>
            ) : (
              cancelledOrders.map(order => (
                <div
                  key={order.hash}
                  className='p-4 border rounded-lg space-y-3'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Badge variant='destructive'>
                        <X className='h-3 w-3 mr-1' />
                        已取消
                      </Badge>
                      <span className='text-sm text-muted-foreground font-mono'>
                        {formatOrderHash(order.hash)}
                      </span>
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

                  <div className='text-sm text-muted-foreground'>
                    创建时间: {formatTimestamp(order.timestamp)}
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>

        <div className='mt-4 text-xs text-muted-foreground'>
          <p>• 活跃订单可以随时取消</p>
          <p>• 已成交订单无法修改或取消</p>
          <p>• 订单哈希用于唯一标识每个订单</p>
        </div>
      </CardContent>
    </Card>
  );
}
