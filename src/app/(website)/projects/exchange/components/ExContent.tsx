import ExOrders from './ExOrders';
import ExProfile from './ExProfile';
export default function ExContent() {
  return (
    <div className="flex gap-6">
      <ExProfile></ExProfile>
      <ExOrders></ExOrders>
    </div>
  );
}
