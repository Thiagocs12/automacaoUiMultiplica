require('dotenv').config()

const { defineConfig } = require('cypress')
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor')
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild')

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.feature',
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: true,
    async setupNodeEvents(on, config) {
      config.env = { ...config.env, ...process.env }

      await addCucumberPreprocessorPlugin(on, config)

      on('file:preprocessor', createBundler({
        plugins: [createEsbuildPlugin(config)],
      }))

      return config
    },
  },
})
