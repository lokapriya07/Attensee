const path = require('path');

module.exports = {
  webpack(config) {
    // Add fallbacks for missing core modules
    config.resolve.fallback = {
      fs: false, // Disable 'fs' module (not needed in the browser)
      stream: require.resolve('stream-browserify'),
      zlib: require.resolve('browserify-zlib'),
    };

    return config;
  },
};
