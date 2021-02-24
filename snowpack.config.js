/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    src: '/'
  },
  plugins: [
    '@snowpack/plugin-dotenv',
    './dev/auto-inject-version.js'
  ],
  devOptions: {
    port: 9999,
    open: 'none'
  },
  buildOptions: {
    metaUrlPath: 'modules'
  }
}
