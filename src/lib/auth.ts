import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { getRequiredEnv } from '@/lib/env';

export const authOpts = {
  providers: [
    GithubProvider({
      clientId: getRequiredEnv('GITHUB_ID'),
      clientSecret: getRequiredEnv('GITHUB_SECRET'),
    }),
  ],
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOpts);
