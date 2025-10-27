'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleDollarSign, Wallet, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExchangeBalanceCardProps {
  isConnected: boolean;
  exchangeBalance: {
    eth: string;
    rtk: string;
  };
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

export default function ExchangeBalanceCard({
  isConnected,
  exchangeBalance,
  isRefreshing = false,
  onRefresh,
}: ExchangeBalanceCardProps) {
  return (
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50/30 dark:from-emerald-950/30 dark:via-slate-800 dark:to-teal-950/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
      {/* 装饰性背景元素 */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-teal-500/10 to-transparent rounded-tr-full" />

      <CardHeader className="relative z-10 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
              <CircleDollarSign className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
                <span className="bg-gradient-to-r from-slate-800 to-emerald-600 dark:from-slate-100 dark:to-emerald-400 bg-clip-text text-transparent">
                  {isConnected ? '交易所余额' : '代币余额'}
                </span>
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                {isConnected ? '管理您在交易所中的资产余额' : '连接钱包后查看您的代币余额'}
              </CardDescription>
            </div>
          </div>

          {/* 刷新按钮移到标题右侧 */}
          {isConnected && onRefresh && (
            <Button
              onClick={onRefresh}
              disabled={isRefreshing}
              size="sm"
              variant="outline"
              className="snow-button bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 dark:hover:bg-emerald-500/30 border-emerald-200 dark:border-emerald-600"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? '刷新中' : '刷新'}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 pt-0">
        {!isConnected ? (
          <div className="relative p-6 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-700 dark:to-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 shadow-inner">
            <div className="flex items-center justify-center h-20">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">连接钱包后显示余额</p>
              </div>
            </div>
            {/* 装饰性网格背景 */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                  backgroundSize: '20px 20px',
                }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 余额卡片 - 优化后的2列布局 */}
            <div
              className={`grid grid-cols-2 gap-4 transition-all duration-300 ${
                isRefreshing ? 'opacity-60 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              {/* ETH交易所余额 */}
              <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200/50 dark:border-blue-600/50 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">ETH</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-blue-800 dark:text-blue-200">
                      {exchangeBalance.eth}
                    </p>
                    <p className="text-sm text-blue-600/70 dark:text-blue-400/70">以太坊</p>
                  </div>
                </div>
              </div>

              {/* RTK交易所余额 */}
              <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-800/30 border border-emerald-200/50 dark:border-emerald-600/50 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">RTK</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
                      {exchangeBalance.rtk}
                    </p>
                    <p className="text-sm text-emerald-600/70 dark:text-emerald-400/70">代币</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 提示信息 */}
            <div className="rounded-lg bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-800/30 border border-amber-200/50 dark:border-amber-600/50 p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300">需要先存入资金才能进行交易</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
