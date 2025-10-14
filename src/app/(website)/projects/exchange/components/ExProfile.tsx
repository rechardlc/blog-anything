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
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Wallet, CircleDollarSign, ExternalLink, Shield, Zap, Loader2, AlertCircle } from 'lucide-react';
import useConnWallect from '../hooks/useConnWallect';
import useExchange from '../hooks/useExchange';
import * as exchangeUtil from '../util/exchange';
import { BrowserProvider } from 'ethers';
import { useState } from 'react';

export default function ExProfile() {
  const [depositLoading, setDepositLoading] = useState<{
    eth: boolean;
    rtk: boolean;
  }>({
    eth: false,
    rtk: false,
  });
  const [depositAmount, setDepositAmount] = useState<{
    eth: string;
    rtk: string;
  }>({
    eth: '0.1',
    rtk: '100',
  });
  const [depositError, setDepositError] = useState<string>('');
  const {
    isConnected,
    address,
    loading,
    error,
    provider,
    tokenBalance,
    // exchangeBalance,
    connectWallet,
    disconnectWallet,
    refreshWallet,
    // fetchAllBalances,
  } = useConnWallect();
  const { transferEther, transferToken } = useExchange(provider as BrowserProvider);

  // 缩短地址
  const shortenMiddle = (value: string, head: number = 6, tail: number = 4): string => {
    if (!value) return '';
    if (value.length <= head + tail + 3) return value;
    return `${value.slice(0, head)}...${value.slice(-tail)}`;
  };

  // 处理ETH存入
  const handleDepositETH = async () => {
    if (!isConnected) {
      setDepositError('请先连接钱包');
      return;
    }
    if (!depositAmount.eth || parseFloat(depositAmount.eth) <= 0) {
      setDepositError('请输入有效的ETH数量');
      return;
    }

    setDepositLoading((prev) => ({ ...prev, eth: true }));
    setDepositError('');

    try {
      await transferEther(depositAmount.eth);
      // 成功后刷新余额并重置输入框
      refreshWallet();
      setDepositAmount((prev) => ({ ...prev, eth: '0.1' }));
      setDepositError(''); // 清除错误信息
    } catch (error: any) {
      setDepositError(`存入ETH失败: ${error.message}`);
    } finally {
      setDepositLoading((prev) => ({ ...prev, eth: false }));
    }
  };

  // 处理RTK存入
  const handleDepositRTK = async () => {
    if (!isConnected) {
      setDepositError('请先连接钱包');
      return;
    }
    if (!depositAmount.rtk || parseFloat(depositAmount.rtk) <= 0) {
      setDepositError('请输入有效的RTK数量');
      return;
    }

    setDepositLoading((prev) => ({ ...prev, rtk: true }));
    setDepositError('');

    try {
      // 这里需要实现RTK存入逻辑
      // await transferToken(address, depositAmount.rtk);
      // 模拟成功情况，重置输入框
      setDepositAmount((prev) => ({ ...prev, rtk: '100' }));
      setDepositError(''); // 清除错误信息
      // 注意：RTK功能还在开发中，这里只是演示重置逻辑
    } catch (error: any) {
      setDepositError(`存入RTK失败: ${error.message}`);
    } finally {
      setDepositLoading((prev) => ({ ...prev, rtk: false }));
    }
  };

  (globalThis as any).exchangeUtil = exchangeUtil;
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
          {!isConnected ? (
            <Button
              disabled={loading}
              onClick={connectWallet}
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
              <div className="grid grid-cols-2 gap-3">
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
                  className="flex-1 snow-button bg-slate-900/5 dark:bg-slate-50/10 text-slate-700 dark:text-slate-200 hover:bg-slate-900/10"
                  onClick={refreshWallet}
                >
                  刷新
                </Button>
                <Button
                  className="flex-1 snow-button bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                  onClick={disconnectWallet}
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
              {isConnected ? '交易所余额' : '代币余额'}
            </span>
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400 text-base font-medium">
            {isConnected ? '管理您在交易所中的资产余额' : '连接钱包后查看您的代币余额'}
          </CardDescription>
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
            <div className="space-y-3">
              {/* 交易所余额信息 - 紧凑布局 */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <CircleDollarSign className="w-3 h-3 text-indigo-500" />
                  交易所余额
                </h3>

                {/* 余额卡片 - 水平布局 */}
                <div className="grid grid-cols-3 gap-2">
                  {/* ETH交易所余额 */}
                  <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200/50 dark:border-blue-600/50 p-2 shadow-sm">
                    <div className="text-center">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-1">
                        <span className="text-white text-xs font-bold">ETH</span>
                      </div>
                      <p className="text-xs font-bold text-blue-800 dark:text-blue-200">0.0000</p>
                      <p className="text-xs text-blue-600/70 dark:text-blue-400/70">ETH</p>
                    </div>
                  </div>

                  {/* RTK交易所余额 */}
                  <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-800/30 border border-emerald-200/50 dark:border-emerald-600/50 p-2 shadow-sm">
                    <div className="text-center">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-1">
                        <span className="text-white text-xs font-bold">RTK</span>
                      </div>
                      <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200">0.00</p>
                      <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">RTK</p>
                    </div>
                  </div>

                  {/* 总价值估算 */}
                  <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-800/30 border border-purple-200/50 dark:border-purple-600/50 p-2 shadow-sm">
                    <div className="text-center">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-1">
                        <span className="text-white text-xs font-bold">$</span>
                      </div>
                      <p className="text-xs font-bold text-purple-800 dark:text-purple-200">$0.00</p>
                      <p className="text-xs text-purple-600/70 dark:text-purple-400/70">USD</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 操作按钮 存入和提取 */}
              <div className="space-y-3">
                {/* 错误提示 */}
                {depositError && (
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-3 h-3 text-red-500" />
                      <p className="text-xs text-red-700 dark:text-red-300">{depositError}</p>
                    </div>
                  </div>
                )}

                {/* 存入ETH */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">ETH</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">存入ETH</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={depositAmount.eth}
                      onChange={(e) => setDepositAmount((prev) => ({ ...prev, eth: e.target.value }))}
                      placeholder="0.1"
                      className="flex-1 px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={depositLoading.eth}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={handleDepositETH}
                            disabled={
                              depositLoading.eth ||
                              !isConnected ||
                              !depositAmount.eth ||
                              parseFloat(depositAmount.eth) <= 0
                            }
                            className="snow-button bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 text-xs py-1 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {depositLoading.eth ? <Loader2 className="w-3 h-3 animate-spin" /> : '存入'}
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
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">RTK</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">存入RTK</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={depositAmount.rtk}
                      onChange={(e) => setDepositAmount((prev) => ({ ...prev, rtk: e.target.value }))}
                      placeholder="100"
                      className="flex-1 px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      disabled={depositLoading.rtk}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={handleDepositRTK}
                            disabled={
                              depositLoading.rtk ||
                              !isConnected ||
                              !depositAmount.rtk ||
                              parseFloat(depositAmount.rtk) <= 0
                            }
                            className="snow-button bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 text-xs py-1 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {depositLoading.rtk ? <Loader2 className="w-3 h-3 animate-spin" /> : '存入'}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>存入RTK到交易所</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* 其他操作按钮 */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button
                    className="snow-button bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 text-xs py-2"
                    onClick={refreshWallet}
                  >
                    刷新余额
                  </Button>
                  <Button className="snow-button bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 text-xs py-2">
                    提取资金
                  </Button>
                </div>
              </div>

              {/* 提示信息 - 简化版 */}
              <div className="rounded-lg bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-800/30 border border-amber-200/50 dark:border-amber-600/50 p-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <p className="text-xs text-amber-700 dark:text-amber-300">需要先存入资金才能进行交易</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
