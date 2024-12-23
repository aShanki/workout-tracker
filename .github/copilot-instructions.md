MOST IMPORTANT: We are utilizing Test-Driven Development (TDD) for this project. This means that you should write tests for your code before writing the actual code. This will help you ensure that your code is correct and meets the requirements. You should also write unit tests for your API endpoints to verify that they work as expected.

Continuously update tracker.md with your progress, whatever you do and whatever you have left to accomplish put it in there. This will help you keep track of your progress and help you stay on track. There should be no more than 5 items in the In Progress section of the tracker at any given time. If you have more than 5 items in the In Progress section, you are working on too many things at once. Any overflow should be moved to the To Do section.

If you need to create new files, give me commands to create them and ask me to add them to your working set. Pause before writing code when this happens.

shadcn components can be added using this command:
"npx shadcn@latest add [component]", all available shadcn components have already been downloaded in src/components/ui/***

We are using the SERN stack, Supabase, Express, React, and Node.js/Typescript in our case. We do not use prisma.
These are the additional technologies we're using

Frontend
Next.js: React framework for building server-side rendered applications.
TypeScript: Typed superset of JavaScript for type safety and better developer experience.
Tailwind CSS: Utility-first CSS framework for styling.
React Query: Data-fetching library for managing server state.

Backend
Next.js API Routes: Serverless functions for handling API requests.
Supabase: Open-source Firebase alternative for building serverless applications.

You are assisting with a Next.js project. Ensure all recommendations, code snippets, and solutions strictly adhere to the following ESLint rules for Next.js:

@next/next/google-font-display: Enforce the correct usage of the font-display property with Google Fonts.
@next/next/google-font-preconnect: Always ensure preconnect is used for Google Fonts.
@next/next/inline-script-id: Inline scripts in next/script must include an id attribute.
@next/next/next-script-for-ga: Use next/script for Google Analytics instead of inline scripts.
@next/next/no-assign-module-variable: Avoid assigning to the module variable.
@next/next/no-async-client-component: Do not make client components async.
@next/next/no-before-interactive-script-outside-document: Use beforeInteractive scripts only in pages/_document.js.
@next/next/no-css-tags: Avoid manual <link> tags for stylesheets; use Next.js's built-in CSS handling instead.
@next/next/no-document-import-in-page: Import next/document only in pages/_document.js.
@next/next/no-duplicate-head: Do not use duplicate <Head> components in pages/_document.js.
@next/next/no-head-element: Avoid the native <head> element; use the <Head> component from Next.js.
@next/next/no-head-import-in-document: Do not use next/head in pages/_document.js.
@next/next/no-html-link-for-pages: Avoid using <a> elements for internal navigation; use Next.js's <Link> component instead.
@next/next/no-img-element: Use the next/image component instead of the native <img> tag for optimized performance.
@next/next/no-page-custom-font: Avoid importing custom fonts in individual pages; load them globally.
@next/next/no-script-component-in-head: Do not use next/script inside next/head.
@next/next/no-styled-jsx-in-document: Do not use styled-jsx in pages/_document.js.
@next/next/no-sync-scripts: Avoid synchronous <script> tags; use asynchronous or deferred scripts instead.
@next/next/no-title-in-document-head: Do not use <title> with the Head component from next/document.
@next/next/no-typos: Avoid common typos in Next.js's data fetching functions.
@next/next/no-unwanted-polyfillio: Avoid unwanted usage of polyfill.io.
Always prioritize performance, accessibility, and best practices while following these rules. If a recommendation violates any of these rules, explicitly note the issue and provide a compliant alternative. Respond with solutions designed for modern Next.js applications

/home/synthetix/workout-tracker/
├── .github/                     # GitHub configuration and workflows
├── public/                      # Static assets (images, fonts, etc.)
├── src/                         # Source code
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/              # Authentication pages and layout
│   │   ├── api/                 # API route handlers
│   │   ├── error.tsx            # Global error handling
│   │   ├── layout.tsx           # Root layout
│   │   ├── loading.tsx          # Loading UI
│   │   └── page.tsx             # Home page
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn components
│   │   ├── forms/               # Form components
│   │   ├── layout/              # Layout components
│   │   └── shared/              # Reusable components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility functions and services
│   ├── styles/                  # Global styles
│   ├── types/                   # TypeScript definitions
│   └── utils/                   # Additional utilities
├── .env.local                   # Environment variables
├── .gitignore                   # Git ignore rules
├── components.json              # shadcn components configuration
├── jest.config.js               # Jest configuration
├── next.config.ts               # Next.js configuration
├── package.json                 # Project dependencies and scripts
├── postcss.config.mjs           # PostCSS configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation