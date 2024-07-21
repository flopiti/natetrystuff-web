/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { isServer, dev, webpack }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
      };
    }
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }

    config.externals.push('@ts-morph/common');

    config.plugins.push(
      new webpack.IgnorePlugin({ resourceRegExp: /^cpu-features$/ })
    );

    return config;
  },
};

export default nextConfig;
