import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { getOptionalEnv } from '@/lib/env';

const authOpts = {
  providers: [
    // 只有在环境变量存在时才添加 GitHub 提供者
    ...(getOptionalEnv('GITHUB_ID') && getOptionalEnv('GITHUB_SECRET')
      ? [
          GithubProvider({
            clientId: getOptionalEnv('GITHUB_ID'),
            clientSecret: getOptionalEnv('GITHUB_SECRET'),
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

const nextAuth = NextAuth(authOpts);

export const { handlers, auth, signIn, signOut } = nextAuth;
export { authOpts };
