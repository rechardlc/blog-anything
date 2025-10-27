'use client';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Loader2 } from 'lucide-react';

interface DepositTabProps {
  depositAmount: {
    eth: string;
    rtk: string;
  };
  depositLoading: {
    eth: boolean;
    rtk: boolean;
  };
  onAmountChange: (type: 'eth' | 'rtk', value: string) => void;
  onDepositETH: () => void;
  onDepositRTK: () => void;
}

export default function DepositTab({
  depositAmount,
  depositLoading,
  onAmountChange,
  onDepositETH,
  onDepositRTK,
}: DepositTabProps) {
  return (
    <div className="space-y-4">
      {/* 存入ETH */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">ETH</span>
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">存入ETH</span>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.01"
            min="0"
            value={depositAmount.eth}
            onChange={(e) => onAmountChange('eth', e.target.value)}
            placeholder="0.1"
            className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={depositLoading.eth}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onDepositETH}
                  disabled={depositLoading.eth || !depositAmount.eth || parseFloat(depositAmount.eth) <= 0}
                  className="snow-button bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {depositLoading.eth ? <Loader2 className="w-4 h-4 animate-spin" /> : '存入'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>存入ETH到交易所</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* 存入RTK */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">RTK</span>
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">存入RTK</span>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            step="1"
            min="0"
            value={depositAmount.rtk}
            onChange={(e) => onAmountChange('rtk', e.target.value)}
            placeholder="100"
            className="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            disabled={depositLoading.rtk}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onDepositRTK}
                  disabled={depositLoading.rtk || !depositAmount.rtk || parseFloat(depositAmount.rtk) <= 0}
                  className="snow-button bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {depositLoading.rtk ? <Loader2 className="w-4 h-4 animate-spin" /> : '存入'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>存入RTK到交易所</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
