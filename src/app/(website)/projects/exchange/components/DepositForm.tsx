'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, ArrowUpDown, ArrowDown, ArrowUp } from 'lucide-react';
import DepositTab from './DepositTab';
import WithdrawTab from './WithdrawTab';
import SwapTab from './SwapTab';

interface DepositFormProps {
  isConnected: boolean;
  depositAmount: {
    eth: string;
    rtk: string;
  };
  depositLoading: {
    eth: boolean;
    rtk: boolean;
  };
  depositError: string;
  withdrawAmount: {
    eth: string;
    rtk: string;
  };
  withdrawLoading: {
    eth: boolean;
    rtk: boolean;
  };
  withdrawError: string;
  swapFromAmount: string;
  swapToAmount: string;
  swapFromToken: 'eth' | 'rtk';
  swapToToken: 'eth' | 'rtk';
  swapLoading: boolean;
  swapError: string;
  onAmountChange: (type: 'eth' | 'rtk', value: string) => void;
  onWithdrawAmountChange: (type: 'eth' | 'rtk', value: string) => void;
  onSwapFromAmountChange: (value: string) => void;
  onSwapToAmountChange: (value: string) => void;
  onSwapTokensChange: () => void;
  onDepositETH: () => void;
  onDepositRTK: () => void;
  onWithdrawETH: () => void;
  onWithdrawRTK: () => void;
  onSwap: () => void;
  onRefresh: () => void;
}

export default function DepositForm({
  isConnected,
  depositAmount,
  depositLoading,
  depositError,
  withdrawAmount,
  withdrawLoading,
  withdrawError,
  swapFromAmount,
  swapToAmount,
  swapFromToken,
  swapToToken,
  swapLoading,
  swapError,
  onAmountChange,
  onWithdrawAmountChange,
  onSwapFromAmountChange,
  onSwapToAmountChange,
  onSwapTokensChange,
  onDepositETH,
  onDepositRTK,
  onWithdrawETH,
  onWithdrawRTK,
  onSwap,
  onRefresh,
}: DepositFormProps) {
  if (!isConnected) {
    return null;
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg font-bold text-slate-800 dark:text-slate-100">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg">
            <ArrowUpDown className="w-4 h-4" />
          </div>
          <span className="bg-gradient-to-r from-slate-800 to-indigo-600 dark:from-slate-100 dark:to-indigo-400 bg-clip-text text-transparent">
            资产管理
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        {/* 错误提示 */}
        {(depositError || withdrawError || swapError) && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-3 mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-sm text-red-700 dark:text-red-300">
                {depositError || withdrawError || swapError}
              </p>
            </div>
          </div>
        )}

        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="deposit" className="flex items-center gap-2">
              <ArrowDown className="w-3 h-3" />
              存入
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="flex items-center gap-2">
              <ArrowUp className="w-3 h-3" />
              提取
            </TabsTrigger>
            <TabsTrigger value="swap" className="flex items-center gap-2">
              <ArrowUpDown className="w-3 h-3" />
              交换
            </TabsTrigger>
          </TabsList>

          {/* 存入标签页 */}
          <TabsContent value="deposit" className="space-y-4">
            <DepositTab
              depositAmount={depositAmount}
              depositLoading={depositLoading}
              onAmountChange={onAmountChange}
              onDepositETH={onDepositETH}
              onDepositRTK={onDepositRTK}
            />
          </TabsContent>

          {/* 提取标签页 */}
          <TabsContent value="withdraw" className="space-y-4">
            <WithdrawTab
              withdrawAmount={withdrawAmount}
              withdrawLoading={withdrawLoading}
              onWithdrawAmountChange={onWithdrawAmountChange}
              onWithdrawETH={onWithdrawETH}
              onWithdrawRTK={onWithdrawRTK}
            />
          </TabsContent>

          {/* 交换标签页 */}
          <TabsContent value="swap" className="space-y-6">
            <SwapTab
              swapFromAmount={swapFromAmount}
              swapToAmount={swapToAmount}
              swapFromToken={swapFromToken}
              swapToToken={swapToToken}
              swapLoading={swapLoading}
              onSwapFromAmountChange={onSwapFromAmountChange}
              onSwapToAmountChange={onSwapToAmountChange}
              onSwapTokensChange={onSwapTokensChange}
              onSwap={onSwap}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
