# SCS Pay

A student payment management system built with Next.js, Prisma, and PostgreSQL.

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

## Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct PostgreSQL connection string for Prisma
- `PAYSTACK_SECRET_KEY` - Paystack API secret key for payment processing
- `NEXT_PUBLIC_API_URL` - (Optional) Public API URL for callbacks

## Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push
```

## Build

```bash
npm run build
```

## Deploy on Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `PAYSTACK_SECRET_KEY`
4. Deploy

The project includes a `postinstall` script that automatically generates the Prisma client during deployment.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Paystack Documentation](https://paystack.com/docs)
