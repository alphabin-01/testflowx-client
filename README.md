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

## Features

### Core Features
- **Test Report Dashboard**: Comprehensive dashboard to visualize test results and metrics
- **Analytics**: Detailed performance metrics and test result analytics
- **Test Management**: View and manage all test cases in a centralized interface
- **Failure Analysis**: Dedicated view for examining test failures and issues
- **User Profiles**: Personalized user profiles with authentication

### Technical Features
- **Next.js 15+**: Latest Next.js framework with App Router
- **React 19**: Utilizing the latest React features
- **TypeScript**: Type-safe development environment
- **TailwindCSS**: Utility-first CSS framework for styling
- **Clerk Authentication**: Secure user authentication system
- **Radix UI**: Accessible component primitives
- **Lucide Icons**: Beautiful, consistent icon system
- **Dark/Light Mode**: Theme support via next-themes
- **Responsive Design**: Mobile-friendly interface
- **Turbopack**: Enhanced development experience with faster reload times

### UI Components
- **Dashboard Layout**: Intuitive application structure with sidebar navigation
- **Data Visualization**: Charts and graphs for test results
- **Interactive Tables**: For displaying test data and metrics
- **Toast Notifications**: Via Sonner for system alerts
- **Drawer Components**: For detailed test information
- **Tooltips & Popovers**: Enhanced user guidance elements

## Authentication

This project uses [Clerk](https://clerk.com) for authentication. To set up authentication:

1. Create an account on [Clerk](https://clerk.com)
2. Create a new application in Clerk dashboard
3. Get your API keys from the Clerk dashboard
4. Add the following environment variables to your `.env.local` file:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
