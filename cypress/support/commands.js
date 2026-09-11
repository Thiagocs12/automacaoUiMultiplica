const { getEnvironment, getUsuario } = require('../config/environments')
const LoginPage = require('./pages/shared/LoginPage')

function origemKeycloak(ambiente) {
  return new URL(ambiente.keycloakUrl).origin
}

function preencherEEnviar({ username, password, selectors }) {
  cy.get(selectors.username).should('be.visible').clear().type(username, { log: false })
  cy.get(selectors.password).should('be.visible').clear().type(password, { log: false })
  cy.get(selectors.submit).should('be.visible').click()
}

Cypress.Commands.add('loginComoPerfil', (perfil) => {
  const ambiente = getEnvironment()
  const { username, password } = getUsuario(perfil)
  const selectors = LoginPage.SELECTORS

  cy.session(
    perfil,
    () => {
      cy.visit(ambiente.appBaseUrl)

      cy.origin(origemKeycloak(ambiente), { args: { username, password, selectors } }, preencherEEnviar)

      cy.url({ timeout: 15000 }).should('include', ambiente.appBaseUrl)
    },
    {
      validate() {
        cy.url().should('include', ambiente.appBaseUrl)
      },
    }
  )

  // cy.session só restaura cookies/storage; não deixa a página navegada nela.
  // Precisa revisitar a app depois para a sessão ficar visível ao restante do teste.
  cy.visit(ambiente.appBaseUrl)
})

Cypress.Commands.add('tentarLoginComCredenciais', (username, password) => {
  const ambiente = getEnvironment()
  const selectors = LoginPage.SELECTORS

  cy.visit(ambiente.appBaseUrl)

  cy.origin(origemKeycloak(ambiente), { args: { username, password, selectors } }, preencherEEnviar)
})
