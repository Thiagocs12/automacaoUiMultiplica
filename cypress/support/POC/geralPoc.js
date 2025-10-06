// Criar prospect
Cypress.Commands.add('criarProspect', (cnpj, tipoProspect) => {
  cy.contains('Novo Prospect').click()
  cy.get('.MuiTextField-root > .MuiOutlinedInput-root > .MuiOutlinedInput-input').type(cnpj) //#campo cnpj criação da POC
  cy.realPress('Tab')
  cy.wait(500)
  cy.get('#mui-component-select-tipoProspect').click()//#campo tipo prospect criação da POC
  cy.get('[role="option"]').contains(tipoProspect) .click()
  cy.get('.prospeccao-MuiInputBase-root').type('Gerente Automa')//#campo gerente Criação da POC
  cy.get('[role="option"]').contains('GERENTE AUTOMAÇÃO').click()
  cy.realPress('Tab')
  cy.wait(500)
  cy.contains('Salvar').click()
})

//Preenche o limite global do pleito
Cypress.Commands.add('preencherPleitoLimiteGlobal', (limite) => {
  cy.get('#main-menu-body > section > div > main > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(1) > div > div > button')//#Mais infos da POC ex: pleito ...
    .trigger('mouseover')
  cy.get('[title="Pleito/Produto"]').click()
  cy.get('[name="limiteGlobal"]').clear().type(limite)
  cy.get('#main-menu-body > section > div > main > div > div:nth-of-type(2) > div:nth-of-type(1) > div > div:nth-of-type(2) > form > div:nth-of-type(1) > div:nth-of-type(2) > button')//#Salvar Pleito ...
    .click()
})

// Aprovação do prospect no comite de crédito
Cypress.Commands.add('aprovarProspectComite', () => {
  cy.wait(2000)
  cy.contains('Votação').click()
  cy.contains('Portal Beyond').click()
  cy.contains('Portal Terceiros').click()
  cy.contains('Salvar').click()
  cy.get(':nth-child(3) > .prospeccao-MuiBox-root > .prospeccao-MuiButtonBase-root').click() //# Botão enviar votação
  cy.get('input.PrivateSwitchBase-input.css-1m9pwf3').check({ force: true }) //# selecionar todos votantes
  cy.contains('Enviar').click()
})

Cypress.Commands.add('acessarAtaComite', () => {
  cy.wait(2000)
  cy.contains('Votação').click()
  cy.get('.MuiPaper-root > .MuiButtonBase-root').click()
  cy.wait(2000)
})

Cypress.Commands.add('avancarComite', () => {
  cy.wait(1000)
  cy.contains('Avançar').click()
  cy.get('[name="aprovar"] > .prospeccao-MuiButton-label').click()
})

Cypress.Commands.add('habilitarFundo', () => {
  cy.get('#main-menu-body div:nth-child(16) > button:nth-child(2)').click()
  cy.contains('Parâmetros Operação').click()
  cy.contains('Fundos').click()
  cy.get('.prospeccao-MuiTableCell-alignCenter > .prospeccao-MuiBox-root > :nth-child(1)').click()
  cy.contains('Administradora habilitada').click()
  cy.contains('Gestora habilitada').click()
  cy.contains('Salvar').click()
})

Cypress.Commands.add('adicionarContaBancaria', (dadosConta) => {
  cy.get('#main-menu-body section > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > div > div > div:nth-child(12) > button:nth-child(2)').click() //#avançar paginação prospect
  cy.get('#main-menu-body section > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > div > div > div:nth-child(12) > button:nth-child(2)').click() //#avançar paginação prospect
  cy.contains('Contas Bancárias').click()
  cy.get('.prospeccao-MuiGrid-root > .prospeccao-MuiButtonBase-root').click()
  cy.get('#main-menu-body section > div > main > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > button').click() //#adicionarContaBancaria
  cy.get('#main-menu-body section > div > main > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div > div > div > input').type(dadosConta.banco)
  cy.contains('li.prospeccao-MuiAutocomplete-option', dadosConta.banco).click()
  cy.get('#nroAgencia').type(dadosConta.agencia)
  cy.get('#nroConta').type(dadosConta.conta)
  cy.get('#dvConta').type(dadosConta.digito)
  cy.get('#nomeContato').type(dadosConta.nomeContato)
  cy.get('#emailContato').type(dadosConta.emailContato)
  cy.get('[title="Open"]').eq(1).click()
  cy.contains('li.prospeccao-MuiAutocomplete-option', dadosConta.ddi).click()
  cy.get('[title="Open"]').eq(2).click()
  cy.contains('li.prospeccao-MuiAutocomplete-option', dadosConta.ddd).click()
  cy.get('#main-menu-body section > div > main > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(11) > div > input').type(dadosConta.telefone)
  cy.get('#mui-component-select-tipoClassificacaoConta').click()
  cy.contains(dadosConta.tipoConta).click()
  cy.contains('Salvar').click()
})