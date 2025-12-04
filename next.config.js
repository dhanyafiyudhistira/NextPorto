/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Handle node modules that need to be excluded from client bundle
    config.externals = config.externals || [];
    config.externals.push({
      '@tensorflow/tfjs-node': 'commonjs @tensorflow/tfjs-node'
    });
    return config;
  },
};

module.exports = nextConfig;
