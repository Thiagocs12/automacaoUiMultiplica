const { When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const { getEnvironment } = require('../../../config/environments')
const LoginPage = require('../../pages/shared/LoginPage')

When('o usuário realiza login com o perfil {string}', (perfil) => {
  cy.loginComoPerfil(perfil)
})

When('o usuário tenta logar com o usuário {string} e a senha {string}', (username, password) => {
  cy.tentarLoginComCredenciais(username, password)
})

Then('ele deve ser autenticado com sucesso na aplicação Beyond', () => {
  const ambiente = getEnvironment()
  cy.url().should('include', ambiente.appBaseUrl)
})

Then('ele deve ver a mensagem de erro do Keycloak', () => {
  const ambiente = getEnvironment()
  const selectors = LoginPage.SELECTORS

  cy.origin(new URL(ambiente.keycloakUrl).origin, { args: { selectors } }, ({ selectors }) => {
    cy.get(selectors.mensagemErro).should('be.visible')
  })
})

Then('ele não deve ser autenticado na aplicação Beyond', () => {
  const ambiente = getEnvironment()
  cy.url().should('not.include', ambiente.appBaseUrl)
})
