const dotenv = await import('dotenv');

dotenv.config({path: '../.env'})

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  transpilePackages: ["@natcore/design-system-core"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'utfs.io',
        pathname: '/f/**'
      }
    ]
  }
};

export default config;
