//Adiciona produtos ao pleito pelo grupo
Cypress.Commands.add('adicionarProdutosPleito', (produto, limite, prazo, taxa, concetracao) => {
  cy.get('.prospeccao-MuiGrid-root > :nth-child(2)').click()//# adicionar produto pleito
  cy.contains(produto).click()
  cy.wait(100)
  cy.contains('span', produto).click()
  cy.wait(500)
  cy.get('.css-1c6kgto > .MuiOutlinedInput-root > .MuiOutlinedInput-input').clear().type(limite)//#adição de grupo de produto limite
  cy.wait(100)
  cy.get(':nth-child(3) > .MuiOutlinedInput-root > .MuiOutlinedInput-input').clear().type(prazo)//#adição de grupo de produto prazo
  cy.wait(100)
  cy.get('.css-1yp82fk > .MuiOutlinedInput-root > .MuiOutlinedInput-input').clear().type(taxa)//#adição de grupo de produto taxa
  cy.wait(100)
  cy.get('.css-2cy7sg > .MuiFormControl-root > .MuiOutlinedInput-root > .MuiOutlinedInput-input').clear().type(concetracao)//#adição de grupo de produto concetracao
  cy.wait(100)
  cy.get('.css-1bvc4cc > .MuiButton-root').click()
})

//Avança as etapas de aprovação do prospect
Cypress.Commands.add('aprovarProspect', (aprovador) => {
  cy.wait(1000)
  cy.acessarProspectNaTela('Analisar Prospect')
  cy.avancarEsteira('TESTE AUTOMACAO - APROVAR PROSPECT '+ aprovador)
})