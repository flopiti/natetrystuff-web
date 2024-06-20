/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable Strict Mode
  webpack: (config, { isServer, buildId, dev, webpack }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }

    // Mark ts-morph dependencies as external
    config.externals.push('@ts-morph/common');

    // Ignore missing optional dependencies for ssh2
    config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /^cpu-features$/ }));

    return config;
  },
};

export default nextConfig;
