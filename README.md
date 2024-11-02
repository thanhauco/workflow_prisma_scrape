This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

PROJECT STRUCTURE 

ROOT/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── workflows/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── loading.tsx
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── trpc/
│   │   │   │   └── [trpc]/
│   │   │   │       └── route.ts
│   │   │   └── webhooks/
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/
│   │   │   ├── auth-button.tsx
│   │   │   └── login-form.tsx
│   │   ├── dashboard/
│   │   │   ├── sidebar.tsx
│   │   │   └── header.tsx
│   │   ├── flow/
│   │   │   ├── nodes/
│   │   │   │   ├── scrape-node.tsx
│   │   │   │   ├── transform-node.tsx
│   │   │   │   └── output-node.tsx
│   │   │   ├── edges/
│   │   │   │   └── custom-edge.tsx
│   │   │   ├── controls/
│   │   │   │   ├── node-picker.tsx
│   │   │   │   └── flow-controls.tsx
│   │   │   └── flow-builder.tsx
│   │   ├── shared/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── loading-spinner.tsx
│   │   └── workflows/
│   │       ├── workflow-card.tsx
│   │       └── workflow-list.tsx
│   ├── config/
│   │   └── site.ts
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   └── trpc.ts
│   ├── server/
│   │   ├── api/
│   │   │   └── routers/
│   │   │       ├── auth.ts
│   │   │       ├── workflow.ts
│   │   │       └── _app.ts
│   │   └── db/
│   │       └── schema.ts
│   ├── styles/
│   │   └── globals.css
│   ├── types/
│   │   ├── auth.ts
│   │   ├── flow.ts
│   │   └── workflow.ts
│   └── utils/
│       ├── api.ts
│       └── flow-utils.ts
├── prisma/
│   └── schema.prisma
├── public/
│   └── assets/
└── package.json


========================================

// First, create a new Next.js project with these commands:
/*
npx create-next-app@latest scrapeflow --typescript --tailwind --eslint
cd scrapeflow

npm install @prisma/client @tanstack/react-query @trpc/client @trpc/next @trpc/react-query @trpc/server
npm install reactflow @nextauth/prisma-adapter next-auth prisma zod
npm install cheerio axios

// Initialize Prisma
npx prisma init
*/

// 1. First create .env file in root:
/*
DATABASE_URL="postgresql://username:password@localhost:5432/scrapeflow"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"
*/

// 2. Update prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String     @id @default(cuid())
  name          String?
  email         String?    @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  workflows     Workflow[]
}

model Workflow {
  id        String    @id @default(cuid())
  name      String
  nodes     Json
  edges     Json
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  isPublic  Boolean   @default(false)
  lastRunAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

// 3. Create lib/trpc.ts
import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import superjson from 'superjson';
import type { AppRouter } from '../server/routers/_app';

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    };
  },
  ssr: false,
});

// 4. Create server/routers/_app.ts
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';

const t = initTRPC.create({
  transformer: superjson,
});

export const appRouter = t.router({
  workflow: t.router({
    list: t.procedure.query(async () => {
      return prisma.workflow.findMany();
    }),
    create: t.procedure
      .input(
        z.object({
          name: z.string(),
          nodes: z.array(z.any()),
          edges: z.array(z.any()),
        })
      )
      .mutation(async ({ input }) => {
        return prisma.workflow.create({
          data: input,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;

// 5. Create pages/_app.tsx
import { SessionProvider } from 'next-auth/react';
import { trpc } from '../lib/trpc';
import '../styles/globals.css';
import type { AppType } from 'next/app';
import type { Session } from 'next-auth';

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(App);

// 6. Create pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../lib/prisma';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});

// 7. Create pages/api/trpc/[trpc].ts
import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from '../../../server/routers/_app';

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});

// 8. Update pages/index.tsx
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to ScrapeFlow</h1>
        <div className="space-x-4">
          <Link
            href="/dashboard"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            Go to Dashboard
          </Link>
          <button
            onClick={() => signOut()}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">ScrapeFlow</h1>
      <button
        onClick={() => signIn('github')}
        className="bg-black text-white px-6 py-2 rounded-lg flex items-center"
      >
        Sign in with GitHub
      </button>
    </div>
  );
}

// Setup Instructions:

/*
1. After creating the project and installing dependencies:

2. Set up the database:
   npx prisma db push
   npx prisma generate

3. Set up GitHub OAuth:
   - Go to GitHub Developer Settings
   - Create a new OAuth App
   - Set homepage URL to http://localhost:3000
   - Set callback URL to http://localhost:3000/api/auth/callback/github
   - Copy Client ID and Client Secret to .env file

4. Start the development server:
   npm run dev

5. Access the application:
   Open http://localhost:3000 in your browser
   Sign in with GitHub
   You'll be able to access the dashboard and create workflows
*/

// Basic usage after setup:
/*
1. Sign in with GitHub
2. Go to dashboard
3. Create a new workflow
4. Use the visual editor to add nodes and connections
5. Save and execute workflows
*/
