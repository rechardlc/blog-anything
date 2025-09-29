import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import prettierPlugin from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  // 关闭与 Prettier 冲突的规则
  ...compat.extends('prettier'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'artifacts/**',
      'cache/**',
      'next-env.d.ts',
      'src/generated/**',
      'src/artifacts/**', // 忽略 Hardhat 自动生成的 artifacts 文件
      '.history/**',
      'scripts/**', // 忽略 scripts 目录中的所有文件
      'tasks/**', // 忽略 tasks 目录
      'prisma/**', // 忽略 Prisma 相关文件
      'contracts/**', // 忽略 Hardhat 合约文件
      'ignition/**', // 忽略 Hardhat Ignition 部署文件
      'test/**', // 忽略测试目录
      '**/*.js', // 忽略所有 JS 文件，只检查 TS/TSX
    ],
  },
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // 完全关闭未使用变量的 ESLint 检查
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',

      // 关闭其他可能干扰的规则
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',

      // 使用 prettier 作为格式化规范来源
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true,
          trailingComma: 'all',
          printWidth: 110,
          semi: true,
          tabWidth: 2,
        },
      ],
    },
  },
];

export default eslintConfig;
