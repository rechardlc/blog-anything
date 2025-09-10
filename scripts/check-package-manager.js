#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

function checkPackageManager() {
  const userAgent = process.env.npm_config_user_agent || '';

  // 检查是否使用 pnpm
  if (!userAgent.includes('pnpm')) {
    console.error('\n❌ 错误：此项目只允许使用 pnpm 作为包管理工具！\n');
    console.error('🚫 禁止使用以下包管理工具：');
    console.error('   • npm');
    console.error('   • yarn');
    console.error('   • bun');
    console.error('   • cnpm\n');
    console.error('✅ 请使用以下命令：');
    console.error('   安装依赖：pnpm install');
    console.error('   添加依赖：pnpm add <package>');
    console.error('   运行脚本：pnpm run <script>\n');
    console.error('📦 如果你还没有安装 pnpm，请运行：');
    console.error('   npm install -g pnpm\n');
    process.exit(1);
  }

  console.log('✅ 正在使用 pnpm 包管理工具');
}

// 检查当前的包管理工具
checkPackageManager();
