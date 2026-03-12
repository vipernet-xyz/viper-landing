import webpack from "webpack";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const nextConfig = {
  productionBrowserSourceMaps: process.env.NODE_ENV === "production",
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  webpack: (config, options) => {
    config.infrastructureLogging = {
      level: "error",
    };

    if (!options.isServer && options.dev) {
      config.cache = false;
    }

    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@react-native-async-storage/async-storage": false,
    };

    if (!options.isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        buffer: require.resolve("buffer/"),
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        process: require.resolve("process/browser"),
        vm: require.resolve("vm-browserify"),
        util: require.resolve("util/"),
        "pino-pretty": false,
      };

      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: "process/browser",
        })
      );
    }

    config.devtool = process.env.NODE_ENV === "production" ? "source-map" : false;
    config.module = config.module || { rules: [] };
    config.module.rules = config.module.rules || [];

    const fileLoaderRule = config.module.rules.find(
      (rule) =>
        typeof rule === "object" &&
        rule !== null &&
        rule.test instanceof RegExp &&
        rule.test.test(".svg"),
    );

    if (fileLoaderRule && typeof fileLoaderRule === "object") {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    config.module.rules.push({
      test: /\.svg$/i,
      resourceQuery: /url/,
      type: "asset/resource",
    });

    return config;
  },
};

export default nextConfig;
