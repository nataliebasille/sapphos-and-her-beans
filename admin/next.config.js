const dotenv = await import('dotenv');

dotenv.config({path: '../.env'})

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("../env.mjs");

/** @type {import("next").NextConfig} */
const config = {};

export default config;
