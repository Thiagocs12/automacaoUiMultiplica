import { getKeycloakConfig, getApiConfig } from './envHelper'

// ✅ Login via Keycloak com cy.origin()
Cypress.Commands.add('loginKeycloak', (username, password) => {
  const keycloakConfig = getKeycloakConfig()
  const keycloakOrigin = new URL(keycloakConfig.loginUrl).origin

  cy.visit(keycloakConfig.loginUrl)

  cy.origin(
    keycloakOrigin,
    { args: { username, password } },
    ({ username, password }) => {
      cy.get('#username').should('be.visible').type(username, { log: false })
      cy.get('#password').should('be.visible').type(password, { log: false })
      cy.get('#kc-login').should('be.visible').click()
    }
  )

  // Aguardar redirecionamento para a app principal
  const apiConfig = getApiConfig()
  cy.url({ timeout: 10000 }).should('include', apiConfig.baseUrl)
})