'use server';

import { Account, User } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import type { GithubProfile } from 'next-auth/providers/github';

/**
 * 使用github登录
 * @param account
 */
const loginWithGithub = async (account: Account & GithubProfile) => {
  try {
    console.log(account, 'account 。。。。');
    // 查询Account是否存在
    const existingAccount = await prisma.account.findUnique({
      where: {
        // 联合唯一索引，查询方式需要拼接字符串
        provider_providerAccountId: {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        },
      },
      include: { user: true },
    });
    // 如果存在，那么更新用户的token信息
    if (existingAccount) {
      await prisma.account.update({
        where: { id: existingAccount.id },
        data: {
          access_token: account.access_token,
          expires_at: account.expires_at,
        },
      });
      return existingAccount.user;
    }
    // 如果不存在，那么创建用户和Account，开启一个事务，保证数据一致性
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const { avatar_url, email } = account;
      const user = await tx.user.create({
        data: {
          email: email!,
          avatar: avatar_url,
          githubId: account.id!,
          githubUsername: account.login,
        },
      });
      await tx.account.create({
        data: {
          userId: user.id,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          access_token: account.access_token,
          expires_at: account.expires_at,
          type: account.type,
        } as unknown as Account,
      });
      return user;
    });
  } catch (error) {
    console.log(error);
  }
};
export { loginWithGithub };
