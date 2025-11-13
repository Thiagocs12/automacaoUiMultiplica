const grupoEconomico = require('./grupoEconomico')
const cedenteNovo = require('./cedenteNovo')
const geralPoc = require('./geralPoc')

module.exports = {
  grupoEconomico,
  cedenteNovo,
  geralPoc
}

Cypress.Commands.add('adicionarParecerProspect', (parecer) => {
  cy.get('[title="Parecer"]').click()
  cy.get('.prospeccao-MuiGrid-root > .prospeccao-MuiButtonBase-root').click()//#Botão adicionar parecer prospect
  cy.get('[name="parecer"]').type(parecer)
  cy.contains('Salvar').click()
  cy.wait(500)
  cy.get('body').then(($body) => {
    if ($body.text().includes('Campo obrigatório')) {
      cy.get('[name="parecer"]').type(parecer)  
      cy.contains('Salvar').click()
    }
  })
})