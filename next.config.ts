import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['prisma', '@prisma/client'],
    // @ts-expect-error - outputFileTracingIncludes is valid but missing from types
    outputFileTracingIncludes: {
      '/': ['./prisma/**/*'],
    },
  },
};

export default nextConfig;
