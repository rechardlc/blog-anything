'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WalletConnect } from './components/WalletConnect';
import { TokenBalance } from './components/TokenBalance';
import { CreateOrder } from './components/CreateOrder';
import { OrderBook } from './components/OrderBook';
import { MyOrders } from './components/MyOrders';
import { ExchangeProvider } from './context/ExchangeContext';

export default function ExchangePage() {
  return (
    <ExchangeProvider>
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-2'>币币交换</h1>
          <p className='text-muted-foreground'>
            安全、快速的去中心化代币交换平台
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* 左侧：钱包连接和余额 */}
          <div className='lg:col-span-1 space-y-6'>
            <WalletConnect />
            <TokenBalance />
          </div>

          {/* 中间：主要交易区域 */}
          <div className='lg:col-span-2'>
            <Tabs defaultValue='trade' className='w-full'>
              <TabsList className='grid w-full grid-cols-3'>
                <TabsTrigger value='trade'>交易</TabsTrigger>
                <TabsTrigger value='orders'>订单簿</TabsTrigger>
                <TabsTrigger value='my-orders'>我的订单</TabsTrigger>
              </TabsList>

              <TabsContent value='trade' className='space-y-6'>
                <CreateOrder />
              </TabsContent>

              <TabsContent value='orders' className='space-y-6'>
                <OrderBook />
              </TabsContent>

              <TabsContent value='my-orders' className='space-y-6'>
                <MyOrders />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* 底部：交易统计 */}
        <div className='mt-8'>
          <Card>
            <CardHeader>
              <CardTitle>交易统计</CardTitle>
              <CardDescription>实时交易数据和市场信息</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-primary'>1,234</div>
                  <div className='text-sm text-muted-foreground'>总交易量</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-green-600'>567</div>
                  <div className='text-sm text-muted-foreground'>活跃订单</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-blue-600'>89</div>
                  <div className='text-sm text-muted-foreground'>在线用户</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-purple-600'>
                    0.25%
                  </div>
                  <div className='text-sm text-muted-foreground'>手续费率</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ExchangeProvider>
  );
}
