const user = Cypress.env('user');
const empresa = Cypress.env('empresa')


describe('Operação - Duplicata', () => {
  beforeEach(() => {
    cy.loginKeycloak(user.usuario, user.senha, 'banking')
  })
  
//skip
//it('encontrar coisas na tela', () => {
//    cy.viewport(1920, 1080)
//    cy.goTo('backoffice', '/')
//})

  it('Deve acessar a tela de duplicata', () => {
    cy.contains('Multiplica Grupo').click()
    cy.get('#mui-5').type(empresa.razaoSocial)
  })
})