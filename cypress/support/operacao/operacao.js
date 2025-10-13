Cypress.Commands.add('acessarTelaBanking', (cedente, tela = null, menu = 'Beyond Operação') => {
  cy.get('.css-s8zt6u > .MuiAvatar-root').click()
  cy.get('#mui-3').type(cedente)
  cy.contains(cedente).click()
  cy.contains('Avançar').click()
  cy.contains(menu).click()
  if (tela !== null && tela !== undefined) {
    cy.get('.css-1c1vrxg').trigger('mouseover')
    cy.contains(tela).click()
  }
})

Cypress.Commands.add('criarOperacaDuplicata', (caminhoArquivo) => {
  cy.contains('Criar Operação').click()
  cy.contains('button', 'Olá').click()
  cy.get('body').then(($body) => {
    if ($body.text().includes('Manter')) {
      cy.get('.css-kef5kr > :nth-child(2)').first().click(); // #tipo produto
      cy.get('.css-kef5kr > :nth-child(2)').first().click(); // #tipo produto
    } else {
      cy.get('.css-kef5kr > :nth-child(2)').first().click(); // #tipo produto
    }
  })
  cy.contains('button', 'ANTECIPACAO DE DUPLICATA').click()
  cy.get('.css-kef5kr > :nth-child(1)').click()//#sub produto
  cy.contains('button', 'PRODUTO').click()
  cy.get('body').then(($body) => {
    if ($body.text().includes('Já consegui identificar! O produto da operação')) {
      cy.contains('button', 'Continuar').click();
    } else {
      cy.contains('button', 'BOLETO').click();
      cy.contains('button', 'Continuar').click();
    }
  })
  cy.get('.css-kef5kr > :nth-child(2)').click()//#continuar conta
  cy.get('.css-kef5kr > :nth-child(2)').click()//#upload de arquivo
  cy.get('#contained-button-file').attachFile(caminhoArquivo)
  cy.get('.css-kef5kr > :nth-child(2)').click()//#criar pré operacao
})

Cypress.Commands.add('enviarXml', (caminhoArquivo) => {
  cy.get('.css-69i1ev > .MuiButtonBase-root').click()
  cy.get('#raised-button-file').attachFile(caminhoArquivo)
  cy.contains('Enviar').click()
  cy.contains('Arquivo importado com sucesso').should('be.visible')
})

Cypress.Commands.add('adicionarInformacoesPagamento', (contaCedente, estruturada = false, localCobranca = 'CONTA BRADESCO', contaFundo = '013022-2') => {
  cy.contains('Pagamentos').click()
  if (estruturada) {
    cy.get('.MuiOutlinedInput-root > .MuiSelect-select').eq(2).click()//#seletor pagamento cedente
    cy.contains(contaCedente).click()
    cy.get('.MuiOutlinedInput-root > .MuiSelect-select').eq(3).click()//#seletor local de cobrança
    cy.contains(localCobranca).click()
    cy.get('.MuiOutlinedInput-root > .MuiSelect-select').eq(4).click()//#seletor pagamento fundo
    cy.contains(contaFundo).click()
    cy.get('[data-testid="SaveIcon"]').eq(0).click()//#salvar
    cy.get('[data-testid="SaveIcon"]').eq(1).click()//#salvar
    cy.get('[data-testid="SaveIcon"]').eq(2).click()//#salvar
  } else {
    cy.get('.MuiOutlinedInput-root > .MuiSelect-select').eq(3).click()//#seletor local de cobrança
    cy.contains(localCobranca).click()
    cy.get('[data-testid="SaveIcon"]').eq(1).click()//#salvar
  }
})

Cypress.Commands.add('adicionarFundoOpe', (fundo, contaCedente) => {
  cy.get('[data-testid="EditIcon"]').first().click()
  cy.get('[style="width: 100%; grid-area: fundo;"] > .MuiFormControl-root > .MuiOutlinedInput-root > .MuiSelect-select').click()//#seletor fundo
  cy.contains(fundo).click()
  cy.get('[data-testid="SaveIcon"]').first().click()
  cy.adicionarInformacoesPagamento(contaCedente)
})