// Adiciona produtos ao pleito pelo grupo
Cypress.Commands.add('adicionarProdutosPleito', (produto, limite, prazo, taxa, concetracao) => {
  cy.get('.prospeccao-MuiGrid-root > :nth-child(2)').click(); //# adicionar produto pleito
  cy.contains(produto).click();
  cy.wait(100);
  cy.contains('span', produto).click();
  cy.wait(500);
  cy.get('.css-1c6kgto > .MuiOutlinedInput-root > .MuiOutlinedInput-input').clear().type(limite); //# adição de grupo de produto limite
  cy.wait(100);
  cy.get(':nth-child(3) > .MuiOutlinedInput-root > .MuiOutlinedInput-input').clear().type(prazo); //# adição de grupo de produto prazo
  cy.wait(100);
  cy.get('.css-1yp82fk > .MuiOutlinedInput-root > .MuiOutlinedInput-input').clear().type(taxa); //# adição de grupo de produto taxa
  cy.wait(100);
  cy.get('.css-2cy7sg > .MuiFormControl-root > .MuiOutlinedInput-root > .MuiOutlinedInput-input').clear().type(concetracao); //# adição de grupo de produto concetracao
  cy.wait(100);
  cy.get('.css-1bvc4cc > .MuiButton-root').click();
});

// Avança as etapas de aprovação do prospect
Cypress.Commands.add('aprovarProspect', (parecer, acao = 'Analisar Prospect') => {
  cy.wait(500);
  cy.acessarProspectNaTela(acao);
  cy.avancarEsteira(parecer);
});

// Preenche o formulário de aprovação do compliance
Cypress.Commands.add('preencherCompliance', (parecer) => {
  cy.get('.css-1jtiwjl > :nth-child(1) > .MuiBox-root > .MuiButtonBase-root').click(); //# botão ações compliance
  cy.get('.MuiPaper-root > .MuiBox-root > :nth-child(1)').click(); //# botão de ação analisar compliance
  cy.get('#mui-component-select-situacao').click();
  cy.contains('APROVADO').click();
  cy.get('#mui-component-select-analista').click();
  cy.contains('ANALISTA AUTOMAÇÃO').click();
  cy.get('[name="parecer"]').type(parecer);
  cy.get('[name="observacao"]').type(parecer);
  cy.contains('Salvar').click();
});

Cypress.Commands.add('distribuirProposta', (cnpj) => {
  cy.obterIdProposta(cnpj).then((idProposta) => {
    const handleSel = `[data-rbd-drag-handle-draggable-id="${idProposta}"]`;
    cy.distribuirPropostaComite(
      handleSel,
      '.prospeccao-prospeccao4 > :nth-child(2) > .prospeccao-MuiPaper-root'
    );
  });
  cy.get('.MuiSelect-select').click();
  cy.contains('ANALISTA AUTOMAÇÃO').click();
  cy.contains('Salvar').click(); //# Botão salva poc no comitê
  cy.wait(500);
  cy.contains('Avançar').click(); //# Botão avançar poc no comitê
})