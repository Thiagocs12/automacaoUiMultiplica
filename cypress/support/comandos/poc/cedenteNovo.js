// Adiciona produtos ao pleito pelo grupo
Cypress.Commands.add('adicionarProdutosPleito', (produto, limite, prazo, taxa, concetracao) => {
  cy.get('.prospeccao-MuiGrid-root > :nth-child(2)').click() //# adicionar produto pleito
  cy.contains(produto).click()
  cy.contains('span', produto).click()
  cy.get('.MuiOutlinedInput-input').eq(0).clear().type(limite) //# adição de grupo de produto limite
  cy.wait(500)
  cy.get('.MuiOutlinedInput-input').eq(2).clear().type(prazo) //# adição de grupo de produto prazo
  cy.get('.MuiOutlinedInput-input').eq(3).clear().type(taxa) //# adição de grupo de produto taxa
  cy.get('.MuiOutlinedInput-input').eq(4).clear().type(concetracao) //# adição de grupo de produto concetracao
  cy.tikGet('.css-1bvc4cc > .MuiButton-root')
})

// Adiciona produtos ao pleito pelo grupo
Cypress.Commands.add('adicionarFundoPleito', (fundo) => {
  cy.get('.prospeccao-MuiBox-root > .prospeccao-MuiButtonBase-root').first().click() //# adicionar fundo pleito
  cy.get('.prospeccao-MuiInputBase-input').eq(5).click()
  cy.contains(fundo).click()
  cy.tikGet('.prospeccao-MuiGrid-grid-md-4 > div > .prospeccao-MuiButton-contained')
})

// Avança as etapas de aprovação do prospect
Cypress.Commands.add('aprovarProspect', (parecer, acao = 'Analisar Prospect') => {
  cy.wait(2000)
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
  cy.tikCon('Salvar')
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