// Seletores da tela de login do Keycloak. Exportados à parte (não só como métodos)
// porque cy.origin() roda em um contexto isolado e só recebe dados serializáveis via
// `args` — o objeto SELECTORS trafega por ali, e quem chama cy.get() é o callback do
// cy.origin (ver commands.js), não um método desta classe.
const SELECTORS = {
  username: '#username',
  password: '#password',
  submit: '#kc-login',
  mensagemErro: '#input-error, #kc-error-message, .alert-error, .pf-m-error',
}

class LoginPage {
  preencherCredenciais(username, password) {
    cy.get(SELECTORS.username).should('be.visible').clear().type(username, { log: false })
    cy.get(SELECTORS.password).should('be.visible').clear().type(password, { log: false })
  }

  submeter() {
    cy.get(SELECTORS.submit).should('be.visible').click()
  }

  obterMensagemErro() {
    return cy.get(SELECTORS.mensagemErro)
  }
}

const loginPage = new LoginPage()
loginPage.SELECTORS = SELECTORS

module.exports = loginPage
