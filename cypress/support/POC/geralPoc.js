// Criar prospect
Cypress.Commands.add('criarProspect', (cnpj, tipoProspect) => {
  cy.contains('Novo Prospect').click()
  cy.get('.MuiTextField-root > .MuiOutlinedInput-root > .MuiOutlinedInput-input').type(cnpj) //#campo cnpj criação da POC
  cy.realPress('Tab')
  cy.wait(500)
  cy.get('#mui-component-select-tipoProspect').click()//#campo tipo prospect criação da POC
  cy.get('[role="option"]').contains(tipoProspect) .click();
  cy.get('.prospeccao-MuiInputBase-root').type('Gerente Automa')//#campo gerente Criação da POC
  cy.get('[role="option"]').contains('GERENTE AUTOMAÇÃO').click();
  cy.realPress('Tab')
  cy.contains('Salvar').click()
});

//Preenche o limite global do pleito
Cypress.Commands.add('preencherPleitoLimiteGlobal', (limite) => {
  cy.get('#main-menu-body > section > div > main > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(1) > div > div > button')//#Mais infos da POC ex: pleito ...
    .trigger('mouseover')
  cy.get('[title="Pleito/Produto"]').click()
  cy.get('[name="limiteGlobal"]').clear().type(limite)
  cy.get('#main-menu-body > section > div > main > div > div:nth-of-type(2) > div:nth-of-type(1) > div > div:nth-of-type(2) > form > div:nth-of-type(1) > div:nth-of-type(2) > button')//#Salvar Pleito ...
    .click()
})

//Acessa o prospect pesquisado no monitor
Cypress.Commands.add('acessarProspectNaTela', (acao) => {
  cy.get('.prospeccao-MuiIconButton-label > .prospeccao-MuiSvgIcon-root').click()//#Ações da POC no monitor
  cy.contains(acao).click()
})

//Busca o prospect na tela de monitor
Cypress.Commands.add('buscarProspectMonitor', (cnpj, tela, acao = null) => {  
  //cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
  cy.contains(tela).click()
  cy.get('[name="cnpj"]').type(cnpj)
  cy.contains('Buscar').click()
  if (acao !== null && acao !== undefined) {
    cy.acessarProspectNaTela(acao)
  }})