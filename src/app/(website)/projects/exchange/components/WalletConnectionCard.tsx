'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Wallet, CircleDollarSign, ExternalLink, Shield, Zap, RefreshCw } from 'lucide-react';

interface WalletConnectionCardProps {
  isConnected: boolean;
  address: string | null;
  loading: boolean;
  tokenBalance: {
    ethBanlance: string;
    rtkBanlance: string;
  };
  onConnect: () => void;
  onDisconnect: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export default function WalletConnectionCard({
  isConnected,
  address,
  loading,
  tokenBalance,
  onConnect,
  onDisconnect,
  onRefresh,
  isRefreshing = false,
}: WalletConnectionCardProps) {
  // 缩短地址
  const shortenMiddle = (value: string, head: number = 6, tail: number = 4): string => {
    if (!value) return '';
    if (value.length <= head + tail + 3) return value;
    return `${value.slice(0, head)}...${value.slice(-tail)}`;
  };

  return (
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
      {/* 装饰性背景元素 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-snow-500/10 to-transparent rounded-tr-full" />

      <CardHeader className="relative z-10 pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800 dark:text-slate-100">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="bg-gradient-to-r from-slate-800 to-indigo-600 dark:from-slate-100 dark:to-indigo-400 bg-clip-text text-transparent">
            钱包连接
          </span>
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400 text-base font-medium">
          连接您的钱包以开始安全交易
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 pt-0 pb-4">
        {!isConnected ? (
          <Button
            disabled={loading}
            onClick={onConnect}
            className="snow-button group/btn w-full h-12 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white border-0 hover-glow hover-lift"
          >
            <Wallet className="w-5 h-5 mr-2 text-white/90 group-hover/btn:animate-pulse" />
            {loading ? <span>钱包连接中...</span> : <span>连接 MetaMask 钱包</span>}
            <ExternalLink className="w-4 h-4 ml-2 opacity-80 group-hover/btn:opacity-100 transition-opacity" />
          </Button>
        ) : (
          <div className="space-y-4">
            {/* 钱包地址信息 */}
            <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">已连接钱包</p>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <p
                      className="font-mono text-sm text-slate-800 dark:text-slate-100 truncate cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      title={address ?? undefined}
                    >
                      {shortenMiddle(address ?? '')}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent className="overflow-visible max-w-none whitespace-nowrap">
                    <p className="font-mono text-sm text-slate-800 dark:text-slate-100">{address}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* 余额信息卡片 */}
            <div
              className={`grid grid-cols-2 gap-3 transition-all duration-300 ${isRefreshing ? 'opacity-60 scale-95' : 'opacity-100 scale-100'}`}
            >
              {/* ETH余额 */}
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200/50 dark:border-blue-600/50 p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">ETH</span>
                  </div>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">以太坊</span>
                </div>
                <p className="text-sm font-bold text-blue-800 dark:text-blue-200">
                  {parseFloat(tokenBalance.ethBanlance).toFixed(4)} ETH
                </p>
              </div>

              {/* RTK余额 */}
              <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-800/30 border border-emerald-200/50 dark:border-emerald-600/50 p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">RTK</span>
                  </div>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">代币</span>
                </div>
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
                  {parseFloat(tokenBalance.rtkBanlance).toFixed(1)} RTK
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                className="flex-1 snow-button bg-slate-900/5 dark:bg-slate-50/10 text-slate-700 dark:text-slate-200 hover:bg-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? '刷新中...' : '刷新'}
              </Button>
              <Button
                className="flex-1 snow-button bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                onClick={onDisconnect}
                disabled={isRefreshing}
              >
                断开
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="relative z-10 pt-0">
        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>支持 MetaMask 钱包</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>确保连接到本地网络 (localhost:9999)</span>
          </div>
          <div className="flex items-center gap-2">
            <CircleDollarSign className="w-4 h-4 text-blue-500" />
            <span>交易需要支付 Gas 费用</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
