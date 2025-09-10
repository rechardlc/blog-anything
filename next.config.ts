import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  // Turbopack 配置 - 明确指定项目根目录
  turbopack: {
    root: __dirname,
  },

  // 环境变量配置
  env: {
    // 自定义环境变量（如果需要）
  },

  // 公开环境变量（以 NEXT_PUBLIC_ 开头的变量会自动公开）
  // 这里可以添加额外的运行时配置

  // 实验性功能
  experimental: {
    // 如果需要使用实验性功能
  },

  // 图片优化配置
  images: {
    // 如果使用外部图片服务，在这里配置域名
    domains: [],
  },
};

export default nextConfig;
