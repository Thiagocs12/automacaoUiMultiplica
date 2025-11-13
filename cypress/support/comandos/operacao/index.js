const operacao = require('./operacao')
const estruturada = require('./estruturada')

module.exports = {
  operacao,
  estruturada
};

Cypress.Commands.add('adicionarParecerOperacao', (parecer) => {
  cy.get('[aria-label="Parecer"]').click()
  cy.get('.mop-MuiGrid-root > .mop-MuiButtonBase-root').click()//#Botão adicionar parecer operação
  cy.get('[name="parecer"]').type(parecer)
  cy.wait(500)
  cy.get('body').then(($body) => {
    if ($body.text().includes('Campo obrigatório')) {
      cy.get('[name="parecer"]').type(parecer)  
    }
  })
})