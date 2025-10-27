'use client';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Loader2, ArrowUpDown, RotateCcw } from 'lucide-react';

interface SwapTabProps {
  swapFromAmount: string;
  swapToAmount: string;
  swapFromToken: 'eth' | 'rtk';
  swapToToken: 'eth' | 'rtk';
  swapLoading: boolean;
  onSwapFromAmountChange: (value: string) => void;
  onSwapToAmountChange: (value: string) => void;
  onSwapTokensChange: () => void;
  onSwap: () => void;
}

export default function SwapTab({
  swapFromAmount,
  swapToAmount,
  swapFromToken,
  swapToToken,
  swapLoading,
  onSwapFromAmountChange,
  onSwapToAmountChange,
  onSwapTokensChange,
  onSwap,
}: SwapTabProps) {
  return (
    <div className="space-y-4">
      {/* 从代币 */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 ${
              swapFromToken === 'eth'
                ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
            }`}
          >
            <span className="text-white text-sm font-bold">{swapFromToken?.toUpperCase() || 'ETH'}</span>
          </div>
          <input
            type="number"
            step={swapFromToken === 'eth' ? '0.01' : '1'}
            min="0"
            value={swapFromAmount}
            onChange={(e) => onSwapFromAmountChange(e.target.value)}
            placeholder={swapFromToken === 'eth' ? '0.1' : '100'}
            className="flex-1 text-lg bg-transparent border-0 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:cursor-not-allowed"
            disabled={swapLoading}
          />
        </div>
      </div>

      {/* 交换按钮 */}
      <div className="flex justify-center py-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onSwapTokensChange}
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full border-2 border-indigo-200 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:scale-110 transition-all duration-200 shadow-lg"
                disabled={swapLoading}
              >
                <ArrowUpDown className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>交换代币方向</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* 到代币 */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 ${
              swapToToken === 'eth'
                ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
            }`}
          >
            <span className="text-white text-sm font-bold">{swapToToken?.toUpperCase() || 'RTK'}</span>
          </div>
          <input
            type="number"
            step={swapToToken === 'eth' ? '0.01' : '1'}
            min="0"
            value={swapToAmount}
            onChange={(e) => onSwapToAmountChange(e.target.value)}
            placeholder={swapToToken === 'eth' ? '0.1' : '100'}
            className="flex-1 text-lg bg-transparent border-0 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:cursor-not-allowed"
            disabled={swapLoading}
          />
        </div>
      </div>

      {/* 执行交换按钮 */}
      <div className="pt-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onSwap}
                disabled={
                  swapLoading ||
                  !swapFromAmount ||
                  !swapToAmount ||
                  parseFloat(swapFromAmount) <= 0 ||
                  parseFloat(swapToAmount) <= 0 ||
                  swapFromToken === swapToToken
                }
                className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {swapLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    交换中...
                  </>
                ) : (
                  <>
                    <ArrowUpDown className="w-5 h-5 mr-2" />
                    执行交换
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>执行代币交换操作</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* 交换提示信息 */}
      <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200/50 dark:border-blue-600/50 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-bold">i</span>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">交换将在交易所内部完成</p>
            <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">无需支付额外的Gas费用</p>
          </div>
        </div>
      </div>
    </div>
  );
}
