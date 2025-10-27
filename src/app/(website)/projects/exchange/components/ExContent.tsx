import ExOrders from './ExOrders';
import ExProfile from './ExProfile';

export default function ExContent() {
  return (
    <div className="space-y-6">
      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 左侧：用户信息和操作面板 */}
        <div className="xl:col-span-1">
          <ExProfile />
        </div>

        {/* 右侧：交易订单和图表区域 */}
        <div className="xl:col-span-2">
          <ExOrders />
        </div>
      </div>
    </div>
  );
}
