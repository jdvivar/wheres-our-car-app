/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    src: '/'
  },
  plugins: [
    '@snowpack/plugin-dotenv'
  ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    port: 9999
  },
  buildOptions: {
    /* ... */
  }
}
