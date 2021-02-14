const now = new Date().toISOString()
const defaultConfig = {
  '.html': `<!-- version ${process.env.npm_package_version} built at ${now} -->\n`,
  '.js': `/* version ${process.env.npm_package_version} built at ${now} */\n`,
  '.css': `/* version ${process.env.npm_package_version} built at ${now} */\n`
}

module.exports = function (snowpackConfig, pluginOptions) {
  const options = {
    ...defaultConfig,
    ...pluginOptions
  }
  return {
    name: 'auto-inject-version',
    transform (transformOptions) {
      if (!transformOptions.isDev && options[transformOptions.fileExt]) {
        return options[transformOptions.fileExt].concat(transformOptions.contents)
      }
    }
  }
}
