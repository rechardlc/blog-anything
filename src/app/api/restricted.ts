import { getServerSession } from 'next-auth/next';
import { authOpts } from '@/lib/auth';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOpts);
  return res.json({
    authenticated: !!session,
    user: session?.user,
  });
};

export default handler;
