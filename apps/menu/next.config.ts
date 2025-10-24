import type { NextConfig } from "next";

const config = async (): Promise<NextConfig> => {
  const dotenv = await import("dotenv");

  dotenv.config({ path: "../../.env" });

  // If you really need to run this module at startup:
  await import("./env.js");

  return {
    transpilePackages: ["@natcore/design-system-core"],
    images: {
      remotePatterns: [
        { protocol: "https", hostname: "utfs.io", pathname: "/f/**" },
      ],
    },
  };
};

export default config;
