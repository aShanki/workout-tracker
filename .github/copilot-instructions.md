shadcn components can be added using this command:
"npx shadcn@latest add [component]",

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