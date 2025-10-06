// Adiciona produtos ao pleito pelo grupo
Cypress.Commands.add('adicionarProdutosPleito', (produto, limite, prazo, taxa, concetracao) => {
  cy.get('.prospeccao-MuiGrid-root > :nth-child(2)').click() //# adicionar produto pleito
  cy.contains(produto).click()
  cy.wait(100)
  cy.contains('span', produto).click()
  cy.wait(500)
  cy.get('.css-1c6kgto > .MuiOutlinedInput-root > .MuiOutlinedInput-input').clear().type(limite) //# adição de grupo de produto limite
  cy.wait(100)
  cy.get(':nth-child(3) > .MuiOutlinedInput-root > .MuiOutlinedInput-input').clear().type(prazo) //# adição de grupo de produto prazo
  cy.wait(100)
  cy.get('.css-1yp82fk > .MuiOutlinedInput-root > .MuiOutlinedInput-input').clear().type(taxa) //# adição de grupo de produto taxa
  cy.wait(100)
  cy.get('.css-2cy7sg > .MuiFormControl-root > .MuiOutlinedInput-root > .MuiOutlinedInput-input').clear().type(concetracao) //# adição de grupo de produto concetracao
  cy.wait(100)
  cy.get('.css-1bvc4cc > .MuiButton-root').click()
})

// Adiciona produtos ao pleito pelo grupo
Cypress.Commands.add('adicionarFundoPleito', (fundo) => {
  cy.get('#main-menu-body > section > div > main > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(6) > div > div:nth-child(1) > button').click()
  cy.wait(500)
  cy.get('#main-menu-body > section > div > main > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(6) > div > div:nth-child(2) > div > form > div:nth-child(1) > div > div > div > div > div > button:nth-child(2) > span:nth-child(1) > svg').click()
  cy.contains(fundo).click()
  cy.get('.prospeccao-MuiGrid-grid-md-4 > div > .prospeccao-MuiButton-contained').click()
})

// Avança as etapas de aprovação do prospect
Cypress.Commands.add('aprovarProspect', (parecer, acao = 'Analisar Prospect') => {
  cy.wait(500)
  cy.acessarEntidadeNaTela(acao)
  cy.avancarEsteira(parecer)
})

// Preenche o formulário de aprovação do compliance
Cypress.Commands.add('preencherCompliance', (parecer) => {
  cy.get('.css-1jtiwjl > :nth-child(1) > .MuiBox-root > .MuiButtonBase-root').click() //# botão ações compliance
  cy.get('.MuiPaper-root > .MuiBox-root > :nth-child(1)').click() //# botão de ação analisar compliance
  cy.get('#mui-component-select-situacao').click()
  cy.contains('APROVADO').click()
  cy.get('#mui-component-select-analista').click()
  cy.contains('ANALISTA AUTOMAÇÃO').click()
  cy.get('[name="parecer"]').type(parecer)
  cy.get('[name="observacao"]').type(parecer)
  cy.contains('Salvar').click()
})

Cypress.Commands.add('distribuirProposta', (cnpj) => {
  cy.obterIdProposta(cnpj).then((idProposta) => {
    const handleSel = `[data-rbd-drag-handle-draggable-id="${idProposta}"]`
    const destinoSel = '.prospeccao-prospeccao4 > :nth-child(2) > .prospeccao-MuiPaper-root'
    cy.distribuirPropostaComite(handleSel, destinoSel)
  })
  cy.get('.MuiSelect-select').click()
  cy.contains('ANALISTA AUTOMAÇÃO').click()
  cy.wait(1000)
  cy.contains('Salvar').click() //# Botão salva poc no comitê
  cy.wait(1000)
  cy.contains('Avançar').click() //# Botão avançar poc no comitê
})