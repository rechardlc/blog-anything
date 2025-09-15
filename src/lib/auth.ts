import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { getOptionalEnv } from '@/lib/env';

export const authOpts: NextAuthOptions = {
  providers: [
    // 只有在环境变量存在时才添加 GitHub 提供者
    ...(getOptionalEnv('AUTH_GITHUB_ID') && getOptionalEnv('AUTH_GITHUB_SECRET')
      ? [
          GithubProvider({
            clientId: getOptionalEnv('AUTH_GITHUB_ID'),
            clientSecret: getOptionalEnv('AUTH_GITHUB_SECRET'),
          }),
        ]
      : []),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: getOptionalEnv('NEXTAUTH_SECRET', 'fallback-secret-for-development'),
};

export default NextAuth(authOpts);
