/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable Strict Mode
  webpack: (config, { isServer, buildId, dev, webpack }) => {
    // Reconstruct config to include new watchOptions with polling
    config = {
      ...config,
      watchOptions: {
        ...config.watchOptions,
        poll: dev && !isServer ? 1000 : undefined,
      }
    };

    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          fs: false
        }
      };
    }

    // Mark ts-morph dependencies as external
    config.externals = [...(config.externals || []), '@ts-morph/common'];

    // Ignore missing optional dependencies for ssh2
    config.plugins = [
      ...config.plugins,
      new webpack.IgnorePlugin({ resourceRegExp: /^cpu-features$/ })
    ];

    return config;
  },
};

export default nextConfig;
