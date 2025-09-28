import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
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
      'prisma/**',
      '**/*.js', // 忽略所有 JS 文件，只检查 TS/TSX
    ],
  },
  {
    rules: {
      // 完全关闭未使用变量的 ESLint 检查
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',

      // 关闭其他可能干扰的规则
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];

export default eslintConfig;
