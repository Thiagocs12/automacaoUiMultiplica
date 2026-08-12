const ordemPagamento = require('./ordemPagamento')

module.exports = {
  ordemPagamento
};

Cypress.Commands.add('adicionarParecerORP', (parecer) => {
  cy.get('[aria-label="Parecer"]').click()
  cy.get('.MuiGrid-root > .MuiButtonBase-root').click()
  cy.get('[placeholder="Parecer"]').type(parecer)
  cy.contains('Salvar').click()
  cy.wait(500)
  cy.get('body').then(($body) => {
    if ($body.text().includes('Campo obrigatório')) {
      cy.get('[placeholder="Parecer"]').type(parecer)  
      cy.contains('Salvar').click()
    }
  })
})