import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    githubId?: string;
    githubUsername?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      githubId?: string;
      githubUsername?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    githubId?: string;
    githubUsername?: string;
  }
}
