import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';

export default function ExOrders() {
  return (
    <div className="space-y-6">
      {/* 交易图表区域 */}
      <Card className="border-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950/30 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800 dark:text-slate-100">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="bg-gradient-to-r from-slate-800 to-blue-600 dark:from-slate-100 dark:to-blue-400 bg-clip-text text-transparent">
              交易图表
            </span>
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400 text-base font-medium">
            实时价格走势和市场分析
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-700 dark:to-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-slate-500 dark:text-slate-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">图表功能开发中</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 交易订单区域 */}
      <Card className="border-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50/30 dark:from-emerald-950/30 dark:via-slate-800 dark:to-teal-950/30 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800 dark:text-slate-100">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
              <Activity className="w-5 h-5" />
            </div>
            <span className="bg-gradient-to-r from-slate-800 to-emerald-600 dark:from-slate-100 dark:to-emerald-400 bg-clip-text text-transparent">
              交易订单
            </span>
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400 text-base font-medium">
            管理您的交易订单和历史记录
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-700 dark:to-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                <Activity className="w-8 h-8 text-slate-500 dark:text-slate-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">订单功能开发中</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
