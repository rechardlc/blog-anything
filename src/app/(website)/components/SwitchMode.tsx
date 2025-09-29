'use client';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import useBoolean from '@/hooks/useBoolean';
export default function SwitchMode() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, { setTrue: setMounted }] = useBoolean(false);
  const [isDark, { set: setDark }] = useBoolean(theme === 'dark' || resolvedTheme === 'dark');
  // 确保在客户端渲染后再执行
  useEffect(() => setMounted(), [setMounted]);
  useEffect(() => {
    setTheme(isDark ? 'dark' : 'light');
  }, [isDark, setTheme]);
  if (!mounted) return <Switch checked={true}></Switch>;
  return <Switch checked={isDark} onCheckedChange={(checked) => setDark(checked)}></Switch>;
}
