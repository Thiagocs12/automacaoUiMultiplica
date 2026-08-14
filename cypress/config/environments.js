const environments = {
  hml: {
    api: {
      baseUrl: process.env.HML_API_BASE_URL,
      loginUrl: process.env.HML_API_LOGIN_URL,
      username: process.env.HML_API_USERNAME,
      password: process.env.HML_API_PASSWORD,
    },
    keycloak: {
      baseUrl: process.env.HML_KEYCLOAK_BASE_URL,
      loginUrl: process.env.HML_KEYCLOAK_LOGIN_URL,
      username: process.env.HML_KEYCLOAK_USERNAME,
      password: process.env.HML_KEYCLOAK_PASSWORD,
    },
    database: {
      host: process.env.HOMOLOG_DB_HOST,
      user: process.env.HOMOLOG_DB_USER,
      password: process.env.HOMOLOG_DB_PASS,
      name: process.env.HOMOLOG_DB_NAME,
      port: process.env.HOMOLOG_DB_PORT,
    },
  },
  prod: {
    api: {
      baseUrl: process.env.PROD_API_BASE_URL,
      loginUrl: process.env.PROD_API_LOGIN_URL,
      username: process.env.PROD_API_USERNAME,
      password: process.env.PROD_API_PASSWORD,
    },
    database: {
      host: process.env.PROD_DB_HOST,
      user: process.env.PROD_DB_USER,
      password: process.env.PROD_DB_PASS,
      name: process.env.PROD_DB_NAME,
      port: process.env.PROD_DB_PORT,
    },
  },
  bhml: {
    api: {
      baseUrl: process.env.BHML_API_BASE_URL,
      loginUrl: process.env.BHML_API_LOGIN_URL,
      username: process.env.BHML_API_USERNAME,
      password: process.env.BHML_API_PASSWORD,
    },
  },
}

const validateEnvironment = (env) => {
  if (!environments[env]) {
    throw new Error(`Ambiente "${env}" não configurado`)
  }

  const config = environments[env]
  console.log(`✅ Config carregada para ${env}:`, config)

  return config
}

module.exports = { environments, validateEnvironment }