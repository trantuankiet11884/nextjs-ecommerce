import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverActions: true,

  webpack: (config) => {
    config.optimization.splitChunks.cacheGroups = {
      common: {
        name: "common",
        chunks: "all",
      },
    };
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
    ],
  },

  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  experimental: {
    turbo: {
      moduleIdStrategy: "deterministic",
      resolveExtensions: [
        ".mdx",
        ".tsx",
        ".ts",
        ".jsx",
        ".js",
        ".mjs",
        ".json",
      ],
      resolveAlias: {
        underscore: "lodash",
        mocha: { browser: "mocha/browser-entry.js" },
      },
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
};

export default nextConfig;
