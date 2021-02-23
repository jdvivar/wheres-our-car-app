/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    src: '/'
  },
  plugins: [
    '@snowpack/plugin-dotenv',
    './dev/auto-inject-version.js'
  ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    port: 9999,
    open: 'none'
  },
  buildOptions: {
    /* ... */
  }
}
