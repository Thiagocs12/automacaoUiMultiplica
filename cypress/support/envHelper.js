export const getEnvConfig = () => {
  return Cypress.env('envConfig')
}

export const getApiConfig = () => {
  return getEnvConfig().api
}

export const getKeycloakConfig = () => {
  return getEnvConfig().keycloak
}

export const getDatabaseConfig = () => {
  return getEnvConfig().database
}