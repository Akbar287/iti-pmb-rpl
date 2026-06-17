import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  swcMinify: false,
  experimental: {
    workerThreads: false,
  },
  poweredByHeader: false,
  devIndicators: false,
  output: 'standalone',
  images: {
    domains: ['localhost', 'simrpl.iti.ac.id', 'pmb-rpl.vercel.app', 'rpl.seni.asia'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        canvas: false,
      };
    } else {
      config.externals = [...(config.externals || []), "canvas"];
    }

    return config;
  },
};

export default nextConfig;
