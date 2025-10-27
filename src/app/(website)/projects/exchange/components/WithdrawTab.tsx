'use client';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Loader2 } from 'lucide-react';

interface WithdrawTabProps {
  withdrawAmount: {
    eth: string;
    rtk: string;
  };
  withdrawLoading: {
    eth: boolean;
    rtk: boolean;
  };
  onWithdrawAmountChange: (type: 'eth' | 'rtk', value: string) => void;
  onWithdrawETH: () => void;
  onWithdrawRTK: () => void;
}

export default function WithdrawTab({
  withdrawAmount,
  withdrawLoading,
  onWithdrawAmountChange,
  onWithdrawETH,
  onWithdrawRTK,
}: WithdrawTabProps) {
  return (
    <div className="space-y-4">
      {/* 提取ETH */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">ETH</span>
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">提取ETH</span>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.01"
            min="0"
            value={withdrawAmount.eth}
            onChange={(e) => onWithdrawAmountChange('eth', e.target.value)}
            placeholder="0.1"
            className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={withdrawLoading.eth}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onWithdrawETH}
                  disabled={withdrawLoading.eth || !withdrawAmount.eth || parseFloat(withdrawAmount.eth) <= 0}
                  className="snow-button bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {withdrawLoading.eth ? <Loader2 className="w-4 h-4 animate-spin" /> : '提取'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>从交易所提取ETH到钱包</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* 提取RTK */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">RTK</span>
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">提取RTK</span>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            step="1"
            min="0"
            value={withdrawAmount.rtk}
            onChange={(e) => onWithdrawAmountChange('rtk', e.target.value)}
            placeholder="100"
            className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            disabled={withdrawLoading.rtk}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onWithdrawRTK}
                  disabled={withdrawLoading.rtk || !withdrawAmount.rtk || parseFloat(withdrawAmount.rtk) <= 0}
                  className="snow-button bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {withdrawLoading.rtk ? <Loader2 className="w-4 h-4 animate-spin" /> : '提取'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>从交易所提取RTK到钱包</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* 提取提示信息 */}
      <div className="rounded-lg bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-800/30 border border-amber-200/50 dark:border-amber-600/50 p-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
            <span className="text-white text-xs">!</span>
          </div>
          <p className="text-sm text-amber-700 dark:text-amber-300">提取资金将发送到您的钱包地址</p>
        </div>
      </div>
    </div>
  );
}
