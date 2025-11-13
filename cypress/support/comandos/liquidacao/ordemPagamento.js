function gerarData(dias) {
  const data = new Date()
  data.setDate(data.getDate() + dias)
  return data.toISOString().split('T')[0]
}

Cypress.Commands.add('criarOrdemPagamento', (cnpj, razaoSocial, fundo, evento = 'LIQUIDAÇÃO MANUAL', localCobranca, quemPaga = 'Cedente', dataLiquidacao = null) => {
  cy.contains('Ordem de Pagamento').click()
  cy.contains('Nova Ordem').click()
  cy.gerarPosicoesCedente(cnpj, gerarData(-1))
  cy.get('.MuiInputBase-root > .MuiInputBase-input').eq(0).type(razaoSocial)
  cy.contains((razaoSocial)).click()
  cy.get('.MuiInputBase-root > .MuiInputBase-input').eq(1).type(fundo)
  cy.contains(fundo).click()
  cy.get('.MuiInputBase-root > .MuiInputBase-input').eq(2).type(evento)
  cy.contains(evento).click()
  if (dataLiquidacao === null) {
    cy.get('.MuiInputBase-root > .MuiInputBase-input').eq(6).type(gerarData(-1))
  } else {
    cy.get('.MuiInputBase-root > .MuiInputBase-input').eq(6).type(dataLiquidacao)
  }
  cy.get('.MuiInputBase-root > .MuiInputBase-input').eq(3).type(localCobranca)
  cy.contains(localCobranca).click()
  cy.get('.MuiInputBase-root > .MuiInputBase-input').eq(7).type(quemPaga)
  cy.contains('li', quemPaga).click()
  cy.contains('Salvar').click()
  cy.verificarLocal('Ordem de Pagamento salva com sucesso!')
})

Cypress.Commands.add('acessarOrdemPagamento', (cnpjCpf) => {
  cy.contains('Ordem de Pagamento').click()
  cy.obterUltimaOrdemDePagamento(cnpjCpf).then((idOrdemPagamento) => {
    cy.contains('Filtros').click()
    cy.get('.MuiInputBase-root > .MuiInputBase-input').eq(4).type(idOrdemPagamento)
    cy.contains('Buscar').click()
    cy.get('.parentAnchorElement > .MuiButtonBase-root').click()
    cy.wait(500)
    cy.contains('button', 'Analisar Pagamento').click()
    cy.verificarLocal('Lançamentos')
  })
})

Cypress.Commands.add('adicinarTitulosOrdem', (numDocumento, regraLiquidacaoAMenor = 'PARCIAL', estruturada = false) => {
  cy.contains('Consulta Títulos').click()
  cy.get('.MuiAccordionDetails-root > .MuiButton-root').click()
  if (estruturada) {
    cy.contains('Estruturada').click()
  }
  cy.get('.MuiInputBase-root > .MuiInputBase-input').eq(21).clear().type(numDocumento)
  cy.contains('Buscar').click()
  cy.get('[aria-label="Adicionar Título"]').first().click()
  cy.get('.css-z7mtfw > .MuiBox-root > .css-1jr6rwj').click()
  cy.get('#mui-component-select-indRegraLiquidacaoAMenor').click()
  cy.contains(regraLiquidacaoAMenor).click()
  cy.get('.css-1kkysr6 > .MuiButtonBase-root').click()
  cy.verificarLocal('Ordem de Pagamento salva com sucesso!')
})