import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { getOptionalEnv } from '@/lib/env';
import { loginWithGithub } from '@/actions/authAccount';
import { Account } from '@/generated/prisma';
import { GithubProfile } from 'next-auth/providers/github';

export const authOpts: NextAuthOptions = {
  // 使用 Prisma 适配器
  // adapter: PrismaAdapter(prisma),

  providers: [
    // GitHub 登录提供者
    ...(getOptionalEnv('AUTH_GITHUB_ID') && getOptionalEnv('AUTH_GITHUB_SECRET')
      ? [
          GithubProvider({
            clientId: getOptionalEnv('AUTH_GITHUB_ID'),
            clientSecret: getOptionalEnv('AUTH_GITHUB_SECRET'),
            // 请求额外的权限以获取更多用户信息
            authorization: {
              params: {
                scope: 'read:user user:email',
              },
            },
            // // 增加请求超时时间
            // httpOptions: {
            //   timeout: 1000000, // 10秒超时
            // },
          }),
        ]
      : []),

    // Google 登录提供者
    ...(getOptionalEnv('AUTH_GOOGLE_ID') && getOptionalEnv('AUTH_GOOGLE_SECRET')
      ? [
          GoogleProvider({
            clientId: getOptionalEnv('AUTH_GOOGLE_ID'),
            clientSecret: getOptionalEnv('AUTH_GOOGLE_SECRET'),
            // 请求额外的权限以获取更多用户信息
            authorization: {
              params: {
                scope: 'openid email profile',
                prompt: 'consent',
                access_type: 'offline',
                response_type: 'code',
              },
            },
            // 增加请求超时时间
            httpOptions: {
              timeout: 10000, // 10秒超时
            },
          }),
        ]
      : []),
  ],

  pages: {
    signIn: '/login',
    error: '/login',
  },

  secret: getOptionalEnv('NEXTAUTH_SECRET', 'fallback-secret-for-development'),

  // OAuth 错误处理
  events: {
    async signIn(message) {
      console.log('登录成功:', message);
    },
  },

  callbacks: {
    // 当用户成功登录时调用
    async signIn({ user, account, profile }) {
      console.log('GitHub 登录信息:', { user, account, profile });

      // 如果是 GitHub 登录
      if (account?.provider === 'github' && profile) {
        try {
          await loginWithGithub({ ...user, ...account, ...profile } as Account &
            GithubProfile);

          // 查找或创建用户
          // const existingUser = await prisma.user.findUnique({
          //   where: { email: user.email! },
          // });

          // if (existingUser) {
          //   // 更新现有用户的 GitHub 信息
          //   await prisma.user.update({
          //     where: { id: existingUser.id },
          //     data: {
          //       githubId: (profile as any).id?.toString(),
          //       githubUsername: (profile as any).login,
          //       name: profile.name || user.name,
          //       image: (profile as any).avatar_url || user.image,
          //       bio: (profile as any).bio,
          //       website: (profile as any).blog || (profile as any).html_url,
          //       location: (profile as any).location,
          //       isEmailVerified: true,
          //       emailVerifiedAt: new Date(),
          //     },
          //   });
          // }

          // // 记录登录日志
          // await prisma.activityLog.create({
          //   data: {
          //     action: 'USER_LOGIN',
          //     resource: 'User',
          //     resourceId: existingUser?.id || user.id,
          //     userId: existingUser?.id || user.id,
          //     details: {
          //       provider: 'github',
          //       githubUsername: (profile as any).login,
          //       loginTime: new Date().toISOString(),
          //     },
          //   },
          // });
          return true;
        } catch (error) {
          console.error('GitHub 登录处理失败:', error);
          return false;
        }
      }

      return true;
    },

    // 自定义 JWT 内容
    async jwt({ token, user, account, profile }) {
      // 初次登录时，将用户信息添加到 token
      if (user) {
        token.id = user.id;
        token.githubId = (user as any).githubId;
        token.githubUsername = (user as any).githubUsername;
      }

      return token;
    },

    // 自定义 session 内容
    async session({ session, token }) {
      // 将 token 中的信息添加到 session
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).githubId = token.githubId as string;
        (session.user as any).githubUsername = token.githubUsername as string;
      }

      return session;
    },
  },

  // 启用调试模式（开发环境）
  debug: process.env.NODE_ENV === 'development',
};
// console.log(authOpts, 'auths');
export default NextAuth(authOpts);
