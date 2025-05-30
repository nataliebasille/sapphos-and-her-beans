const dotenv = await import('dotenv');

dotenv.config({path: '../../.env'});

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");


/** @type {import("next").NextConfig} */
const baseConfig = {
  transpilePackages: ["@natcore/design-system-core"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'utfs.io',
        pathname: '/f/**'
      },
      {
        protocol: "https",
        hostname: 'utfs.io',
        pathname: '/a/ns7k7p5vvb/**'
      }
    ]
  }
};

import { withSentryConfig } from "@sentry/nextjs";

const config = withSentryConfig(baseConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "sappho-and-her-beans",
  project: "sappho-ecommerce",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});

export default config;