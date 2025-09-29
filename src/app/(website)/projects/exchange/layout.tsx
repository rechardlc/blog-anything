import ExHeader from './components/ExHeader';
export default function ExchangeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-5">
      <ExHeader></ExHeader>
      <main>{children}</main>
    </div>
  );
}
