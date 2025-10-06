const user = Cypress.env('user')

describe('Validação de Login', () => {
  beforeEach(() => {
    cy.goTo('backoffice', '/')
  })

  it('Deve fazer login com sucesso com usuário e senha válidos', () => {
    cy.loginKeycloak(user.usuario, user.senha)
    cy.get('[data-testid="SearchIcon"]').should('be.visible')
  })

  it('Deve exibir erro para usuário inválido', () => {
    cy.loginKeycloakError('usuarioInvalido', user.senha)
  })

  it('Deve exibir erro para senha inválida', () => {
    cy.loginKeycloakError(user.usuario, 'senhaInvalida')
  })
})