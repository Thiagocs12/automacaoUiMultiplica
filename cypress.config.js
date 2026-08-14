const { defineConfig } = require('cypress')
const path = require('path')
const dotenv = require('dotenv')

// ✅ IMPORTANTE: Carregar .env da raiz do projeto
const envPath = path.resolve(__dirname, '.env')
console.log(`📁 Carregando .env de: ${envPath}`)

const result = dotenv.config({ path: envPath })

if (result.error) {
  console.error('❌ Erro ao carregar .env:', result.error)
} else {
  console.log('✅ .env carregado com sucesso')
  console.log('Variáveis carregadas:', Object.keys(result.parsed || {}).length)
}

// ✅ Agora sim, importar environments
const { validateEnvironment } = require('./cypress/config/environments')

const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor')
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild')

const environment = process.env.CYPRESS_ENV || 'hml'

const envConfig = validateEnvironment(environment)

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/features/**/*.feature',
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config)

      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      )

      config.env = {
        ...config.env,
        ...process.env,
        environment,
        envConfig,
      }

      return config
    },
    pageLoadTimeout: 20000,
    defaultCommandTimeout: 20000,
    baseUrl: envConfig.api.baseUrl,
  },
})