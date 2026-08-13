import { defineConfig } from 'cypress'
import dotenv from 'dotenv'
import fs from 'fs'
const path = require('path')

import createBundler from "@bahmutov/cypress-esbuild-preprocessor"
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor"
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild"

dotenv.config()

export default defineConfig({
  e2e: {
    specPattern: "**/*.feature",
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config)

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      )

      config.env = {
        ...config.env,
        ...process.env,
      }

      return config
    },
    pageLoadTimeout: 20000,
    defaultCommandTimeout: 20000,
  }
});