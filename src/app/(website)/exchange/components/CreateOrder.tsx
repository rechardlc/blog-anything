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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useExchange } from '../context/ExchangeContext';
import { Plus, ArrowRightLeft, Calculator } from 'lucide-react';

export function CreateOrder() {
  const { balances, isConnected, makeOrder, loading } = useExchange();

  const [tokenGive, setTokenGive] = useState<string>('');
  const [tokenGiveAmount, setTokenGiveAmount] = useState<string>('');
  const [tokenGet, setTokenGet] = useState<string>('');
  const [tokenGetAmount, setTokenGetAmount] = useState<string>('');
  const [orderLoading, setOrderLoading] = useState(false);

  const availableTokens = balances.filter(
    balance => parseFloat(balance.exchangeBalance) > 0
  );

  const handleCreateOrder = async () => {
    if (!tokenGive || !tokenGet || !tokenGiveAmount || !tokenGetAmount) {
      return;
    }

    if (tokenGive === tokenGet) {
      alert('不能交易相同的代币');
      return;
    }

    if (parseFloat(tokenGiveAmount) <= 0 || parseFloat(tokenGetAmount) <= 0) {
      alert('交易数量必须大于 0');
      return;
    }

    setOrderLoading(true);
    try {
      await makeOrder(tokenGet, tokenGetAmount, tokenGive, tokenGiveAmount);

      // 重置表单
      setTokenGive('');
      setTokenGiveAmount('');
      setTokenGet('');
      setTokenGetAmount('');

      alert('订单创建成功！');
    } catch (error) {
      console.error('创建订单失败:', error);
      alert('创建订单失败，请检查余额是否充足');
    } finally {
      setOrderLoading(false);
    }
  };

  const calculateRate = () => {
    if (tokenGiveAmount && tokenGetAmount) {
      const give = parseFloat(tokenGiveAmount);
      const get = parseFloat(tokenGetAmount);
      if (give > 0 && get > 0) {
        return (get / give).toFixed(6);
      }
    }
    return '0.000000';
  };

  const getTokenSymbol = (address: string) => {
    const token = balances.find(b => b.address === address);
    return token ? token.symbol : 'Unknown';
  };

  const getMaxAmount = (address: string) => {
    const token = balances.find(b => b.address === address);
    return token ? token.exchangeBalance : '0';
  };

  const setMaxAmount = (address: string) => {
    const maxAmount = getMaxAmount(address);
    if (address === tokenGive) {
      setTokenGiveAmount(maxAmount);
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Plus className='h-5 w-5' />
            创建订单
          </CardTitle>
          <CardDescription>创建新的交易订单</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>请先连接钱包以创建订单</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (availableTokens.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Plus className='h-5 w-5' />
            创建订单
          </CardTitle>
          <CardDescription>创建新的交易订单</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              请先存款代币到交易所才能创建订单
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Plus className='h-5 w-5' />
          创建订单
        </CardTitle>
        <CardDescription>创建新的交易订单</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* 交易对选择 */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label>我要给出</Label>
            <Select value={tokenGive} onValueChange={setTokenGive}>
              <SelectTrigger>
                <SelectValue placeholder='选择代币' />
              </SelectTrigger>
              <SelectContent>
                {availableTokens.map(token => (
                  <SelectItem key={token.address} value={token.address}>
                    {token.symbol} - {token.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>我要获得</Label>
            <Select value={tokenGet} onValueChange={setTokenGet}>
              <SelectTrigger>
                <SelectValue placeholder='选择代币' />
              </SelectTrigger>
              <SelectContent>
                {balances.map(token => (
                  <SelectItem key={token.address} value={token.address}>
                    {token.symbol} - {token.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 交易数量 */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='tokenGiveAmount'>
              给出数量 ({getTokenSymbol(tokenGive)})
            </Label>
            <div className='flex gap-2'>
              <Input
                id='tokenGiveAmount'
                type='number'
                step='0.0001'
                placeholder='0.00'
                value={tokenGiveAmount}
                onChange={e => setTokenGiveAmount(e.target.value)}
              />
              {tokenGive && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setMaxAmount(tokenGive)}
                >
                  MAX
                </Button>
              )}
            </div>
            {tokenGive && (
              <div className='text-xs text-muted-foreground'>
                可用: {getMaxAmount(tokenGive)} {getTokenSymbol(tokenGive)}
              </div>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='tokenGetAmount'>
              获得数量 ({getTokenSymbol(tokenGet)})
            </Label>
            <Input
              id='tokenGetAmount'
              type='number'
              step='0.0001'
              placeholder='0.00'
              value={tokenGetAmount}
              onChange={e => setTokenGetAmount(e.target.value)}
            />
          </div>
        </div>

        {/* 汇率显示 */}
        {tokenGiveAmount && tokenGetAmount && (
          <div className='p-4 bg-muted rounded-lg'>
            <div className='flex items-center gap-2 text-sm'>
              <Calculator className='h-4 w-4' />
              <span>汇率:</span>
              <span className='font-mono'>
                1 {getTokenSymbol(tokenGive)} = {calculateRate()}{' '}
                {getTokenSymbol(tokenGet)}
              </span>
            </div>
          </div>
        )}

        {/* 创建订单按钮 */}
        <Button
          onClick={handleCreateOrder}
          disabled={
            orderLoading ||
            loading ||
            !tokenGive ||
            !tokenGet ||
            !tokenGiveAmount ||
            !tokenGetAmount
          }
          className='w-full'
          size='lg'
        >
          {orderLoading ? (
            <>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
              创建中...
            </>
          ) : (
            <>
              <ArrowRightLeft className='mr-2 h-4 w-4' />
              创建订单
            </>
          )}
        </Button>

        <div className='text-xs text-muted-foreground'>
          <p>• 订单创建后需要等待其他用户成交</p>
          <p>• 成交时收取 0.25% 手续费</p>
          <p>• 确保有足够的交易所余额</p>
        </div>
      </CardContent>
    </Card>
  );
}
