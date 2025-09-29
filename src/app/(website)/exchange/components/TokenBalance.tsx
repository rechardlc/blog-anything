'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useExchange } from '../context/ExchangeContext';
import { Coins, ArrowUpDown, RefreshCw } from 'lucide-react';

export function TokenBalance() {
  const { balances, isConnected, depositEther, depositToken, withdrawEther, withdrawToken, loading } =
    useExchange();

  const [depositAmounts, setDepositAmounts] = useState<Record<string, string>>({});
  const [withdrawAmounts, setWithdrawAmounts] = useState<Record<string, string>>({});
  const [depositLoading, setDepositLoading] = useState<Record<string, boolean>>({});
  const [withdrawLoading, setWithdrawLoading] = useState<Record<string, boolean>>({});

  const handleDeposit = async (tokenAddress: string, symbol: string) => {
    const amount = depositAmounts[tokenAddress];
    if (!amount || parseFloat(amount) <= 0) return;

    setDepositLoading((prev) => ({ ...prev, [tokenAddress]: true }));
    try {
      if (tokenAddress === '0x0000000000000000000000000000000000000000') {
        await depositEther(amount);
      } else {
        await depositToken(tokenAddress, amount);
      }
      setDepositAmounts((prev) => ({ ...prev, [tokenAddress]: '' }));
    } catch (error) {
      console.error('存款失败:', error);
    } finally {
      setDepositLoading((prev) => ({ ...prev, [tokenAddress]: false }));
    }
  };

  const handleWithdraw = async (tokenAddress: string, symbol: string) => {
    const amount = withdrawAmounts[tokenAddress];
    if (!amount || parseFloat(amount) <= 0) return;

    setWithdrawLoading((prev) => ({ ...prev, [tokenAddress]: true }));
    try {
      if (tokenAddress === '0x0000000000000000000000000000000000000000') {
        await withdrawEther(amount);
      } else {
        await withdrawToken(tokenAddress, amount);
      }
      setWithdrawAmounts((prev) => ({ ...prev, [tokenAddress]: '' }));
    } catch (error) {
      console.error('提取失败:', error);
    } finally {
      setWithdrawLoading((prev) => ({ ...prev, [tokenAddress]: false }));
    }
  };

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (num === 0) return '0.00';
    if (num < 0.001) return '< 0.001';
    return num.toFixed(4);
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            代币余额
          </CardTitle>
          <CardDescription>连接钱包后查看您的代币余额</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>请先连接钱包以查看代币余额</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          代币余额
        </CardTitle>
        <CardDescription>管理您的代币存款和提取</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit">存款</TabsTrigger>
            <TabsTrigger value="withdraw">提取</TabsTrigger>
          </TabsList>

          <TabsContent value="deposit" className="space-y-4">
            {balances.map((token) => (
              <div key={token.address} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-sm text-muted-foreground">{token.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">钱包余额</div>
                    <div className="font-mono">{formatBalance(token.balance)}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`deposit-${token.address}`}>存款数量</Label>
                  <div className="flex gap-2">
                    <Input
                      id={`deposit-${token.address}`}
                      type="number"
                      step="0.0001"
                      placeholder="0.00"
                      value={depositAmounts[token.address] || ''}
                      onChange={(e) =>
                        setDepositAmounts((prev) => ({
                          ...prev,
                          [token.address]: e.target.value,
                        }))
                      }
                    />
                    <Button
                      onClick={() => handleDeposit(token.address, token.symbol)}
                      disabled={depositLoading[token.address] || loading}
                      size="sm"
                    >
                      {depositLoading[token.address] ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowUpDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-4">
            {balances.map((token) => (
              <div key={token.address} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-sm text-muted-foreground">{token.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">交易所余额</div>
                    <div className="font-mono">{formatBalance(token.exchangeBalance)}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`withdraw-${token.address}`}>提取数量</Label>
                  <div className="flex gap-2">
                    <Input
                      id={`withdraw-${token.address}`}
                      type="number"
                      step="0.0001"
                      placeholder="0.00"
                      value={withdrawAmounts[token.address] || ''}
                      onChange={(e) =>
                        setWithdrawAmounts((prev) => ({
                          ...prev,
                          [token.address]: e.target.value,
                        }))
                      }
                    />
                    <Button
                      onClick={() => handleWithdraw(token.address, token.symbol)}
                      disabled={withdrawLoading[token.address] || loading}
                      size="sm"
                    >
                      {withdrawLoading[token.address] ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowUpDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-xs text-muted-foreground">
          <p>• 存款：将代币从钱包转入交易所</p>
          <p>• 提取：将代币从交易所转回钱包</p>
          <p>• 交易前请确保有足够的交易所余额</p>
        </div>
      </CardContent>
    </Card>
  );
}
