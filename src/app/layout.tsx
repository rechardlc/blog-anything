import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { config, validateRequiredEnvVars, checkEnvConfig } from '@/lib/env';
import ThemeProvider from '@/components/theme/ThemeProvider';

// 验证必需的环境变量
validateRequiredEnvVars();

// 开发环境下检查配置
if (process.env.NODE_ENV === 'development') {
  checkEnvConfig();
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: config.app.name,
  description: `${config.app.name} - 基于 Next.js 的现代化博客平台`,
  keywords: ['博客', 'Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
  authors: [{ name: config.app.name }],
  creator: config.app.name,
  publisher: config.app.name,
  metadataBase: new URL(config.app.siteUrl),
  openGraph: {
    title: config.app.name,
    description: `${config.app.name} - 基于 Next.js 的现代化博客平台`,
    url: config.app.siteUrl,
    siteName: config.app.name,
    locale: config.locale.defaultLocale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: config.app.name,
    description: `${config.app.name} - 基于 Next.js 的现代化博客平台`,
    creator: config.social.twitterUrl
      ? `@${config.social.twitterUrl.split('/').pop()}`
      : undefined,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={config.locale.defaultLocale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
