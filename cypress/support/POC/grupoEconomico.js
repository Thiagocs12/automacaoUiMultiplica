Cypress.Commands.add('adicionarGrupoEconomico', (nomeGrupo) => {
  cy.get('#main-menu-body section > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > div > div > div:nth-child(12) > button:nth-child(2)').click() //#avançar paginação prospect
  cy.contains('Grupo Econômico').click()
  cy.wait(1000)
  cy.get('#free-solo-dialog-demo').type(nomeGrupo)
  cy.contains('Adicionar "' + nomeGrupo).click()
  cy.contains('button', 'Adicionar').click()
  cy.get('[title="Salvar Grupo"]').click()
  cy.contains('button', 'Sim').click()
})

Cypress.Commands.add('cadastrarEmpresasGrupo', (cnpj, razaoSocial) => {
  cy.wait(2000)
  cy.get('#main-menu-body > section > div > main > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(3) > button').click()//#adicionarEmpresaGrupoEconomico
  cy.get('#main-menu-body > section > div > main > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(4) > form > div:nth-child(1) > div:nth-child(1) > div > input') //#CNPJEMPPRESAGRUPOECONOMICO
  .type(cnpj)
  cy.realPress('Tab')
  cy.get('[name="pessoa.nomeFantasia"]').type(razaoSocial)
  cy.contains('Salvar').click()
})
