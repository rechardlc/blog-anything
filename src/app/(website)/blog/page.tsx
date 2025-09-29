import Card from '@/app/components/Card';
export default function Page() {
  return (
    <>
      <h1 className="text-3xl mb-4 font-bold">Blog</h1>
      <p className="text-gray-500">浏览博客分类</p>
      <div className="my-4 border-b-[1px] dark:border-zinc-600 border-zinc-200 w-full"></div>
      <Card></Card>
    </>
  );
}
