'use client';
import useConnWallect from '../hooks/useConnWallect';
import useExchange from '../hooks/useExchange';
import * as exchangeUtil from '../util/exchange';
import { BrowserProvider } from 'ethers';
import { useState } from 'react';
import WalletConnectionCard from './WalletConnectionCard';
import ExchangeBalanceCard from './ExchangeBalanceCard';
import DepositForm from './DepositForm';

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
  const [withdrawAmount, setWithdrawAmount] = useState<{
    eth: string;
    rtk: string;
  }>({
    eth: '0.1',
    rtk: '100',
  });
  const [withdrawLoading, setWithdrawLoading] = useState<{
    eth: boolean;
    rtk: boolean;
  }>({
    eth: false,
    rtk: false,
  });
  const [withdrawError, setWithdrawError] = useState<string>('');
  const [isRefreshingWallet, setIsRefreshingWallet] = useState<boolean>(false);
  const [isRefreshingExchange, setIsRefreshingExchange] = useState<boolean>(false);
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
  const { transferEther, transferToken, exchangeBalance, getAllBalances } = useExchange(
    provider as BrowserProvider,
  );

  // 处理存入金额变化
  const handleAmountChange = (type: 'eth' | 'rtk', value: string) => {
    setDepositAmount((prev) => ({ ...prev, [type]: value }));
  };

  // 处理提取金额变化
  const handleWithdrawAmountChange = (type: 'eth' | 'rtk', value: string) => {
    setWithdrawAmount((prev) => ({ ...prev, [type]: value }));
  };
  // 处理钱包余额刷新
  const handleRefreshWallet = async () => {
    setIsRefreshingWallet(true);
    try {
      await refreshWallet();
    } finally {
      // 添加一个短暂的延迟，让用户看到刷新效果
      setTimeout(() => {
        setIsRefreshingWallet(false);
      }, 1000);
    }
  };

  // 处理交易所余额刷新
  const handleRefreshExchangeBalances = async () => {
    setIsRefreshingExchange(true);
    try {
      await getAllBalances();
    } finally {
      // 添加一个短暂的延迟，让用户看到刷新效果
      setTimeout(() => {
        setIsRefreshingExchange(false);
      }, 1000);
    }
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
      await transferToken(depositAmount.rtk);
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

  // 处理ETH提取
  const handleWithdrawETH = async () => {
    if (!isConnected) {
      setWithdrawError('请先连接钱包');
      return;
    }
    if (!withdrawAmount.eth || parseFloat(withdrawAmount.eth) <= 0) {
      setWithdrawError('请输入有效的ETH数量');
      return;
    }

    setWithdrawLoading((prev) => ({ ...prev, eth: true }));
    setWithdrawError('');

    try {
      // 这里需要实现ETH提取逻辑
      // await withdrawEther(withdrawAmount.eth);
      // 模拟成功情况，重置输入框
      setWithdrawAmount((prev) => ({ ...prev, eth: '0.1' }));
      setWithdrawError(''); // 清除错误信息
      // 刷新余额
      await getAllBalances();
      await refreshWallet();
    } catch (error: any) {
      setWithdrawError(`提取ETH失败: ${error.message}`);
    } finally {
      setWithdrawLoading((prev) => ({ ...prev, eth: false }));
    }
  };

  // 处理RTK提取
  const handleWithdrawRTK = async () => {
    if (!isConnected) {
      setWithdrawError('请先连接钱包');
      return;
    }
    if (!withdrawAmount.rtk || parseFloat(withdrawAmount.rtk) <= 0) {
      setWithdrawError('请输入有效的RTK数量');
      return;
    }

    setWithdrawLoading((prev) => ({ ...prev, rtk: true }));
    setWithdrawError('');

    try {
      // 这里需要实现RTK提取逻辑
      // await withdrawToken(withdrawAmount.rtk);
      // 模拟成功情况，重置输入框
      setWithdrawAmount((prev) => ({ ...prev, rtk: '100' }));
      setWithdrawError(''); // 清除错误信息
      // 刷新余额
      await getAllBalances();
      await refreshWallet();
    } catch (error: any) {
      setWithdrawError(`提取RTK失败: ${error.message}`);
    } finally {
      setWithdrawLoading((prev) => ({ ...prev, rtk: false }));
    }
  };

  (globalThis as any).exchangeUtil = exchangeUtil;

  return (
    <div className="space-y-6">
      {/* 钱包连接卡片 */}
      <WalletConnectionCard
        isConnected={isConnected}
        address={address}
        loading={loading}
        tokenBalance={tokenBalance}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
        onRefresh={handleRefreshWallet}
        isRefreshing={isRefreshingWallet}
      />

      {/* 交易所余额卡片 */}
      <ExchangeBalanceCard
        isConnected={isConnected}
        exchangeBalance={exchangeBalance}
        isRefreshing={isRefreshingExchange}
        onRefresh={handleRefreshExchangeBalances}
      />

      {/* 存入表单 - 只在连接时显示 */}
      {isConnected && (
        <div className="space-y-3">
          <DepositForm
            isConnected={isConnected}
            depositAmount={depositAmount}
            depositLoading={depositLoading}
            depositError={depositError}
            withdrawAmount={withdrawAmount}
            withdrawLoading={withdrawLoading}
            withdrawError={withdrawError}
            onAmountChange={handleAmountChange}
            onWithdrawAmountChange={handleWithdrawAmountChange}
            onDepositETH={handleDepositETH}
            onDepositRTK={handleDepositRTK}
            onWithdrawETH={handleWithdrawETH}
            onWithdrawRTK={handleWithdrawRTK}
            onRefresh={handleRefreshExchangeBalances}
          />
        </div>
      )}
    </div>
  );
}
