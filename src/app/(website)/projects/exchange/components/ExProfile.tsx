'use client';
import {
  Card,
  //   CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, CircleDollarSign, ExternalLink, Shield, Zap } from 'lucide-react';
import useConnWallect from '../hooks/useConnWallect';
export default function ExProfile() {
  const { isConnected, address, loading, error, connectWallet } = useConnWallect();
  return (
    <div className="min-w-80 space-y-6">
      {/* 钱包连接卡片 */}
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
          {isConnected ? (
            <Button
              onClick={connectWallet}
              className="group/btn w-full h-12 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-0"
            >
              <Wallet className="w-5 h-5 mr-2 group-hover/btn:animate-pulse" />
              {loading ? <span>钱包连接中...</span> : <span>连接 MetaMask 钱包</span>}
              <ExternalLink className="w-4 h-4 ml-2 opacity-70 group-hover/btn:opacity-100 transition-opacity" />
            </Button>
          ) : (
            <div>
              <div>
                <p>已连接</p>
                <p>{address}</p>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">刷新</Button>
                <Button className="flex-1">断开</Button>
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

      {/* 代币余额卡片 */}
      <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50/30 dark:from-emerald-950/30 dark:via-slate-800 dark:to-teal-950/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
        {/* 装饰性背景元素 */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-teal-500/10 to-transparent rounded-tr-full" />

        <CardHeader className="relative z-10 pb-4">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800 dark:text-slate-100">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
              <CircleDollarSign className="w-5 h-5" />
            </div>
            <span className="bg-gradient-to-r from-slate-800 to-emerald-600 dark:from-slate-100 dark:to-emerald-400 bg-clip-text text-transparent">
              代币余额
            </span>
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400 text-base font-medium">
            连接钱包后查看您的代币余额
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10 pt-0">
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
        </CardContent>
      </Card>
    </div>
  );
}
