function gerarData(dias) {
  const data = new Date()
  data.setDate(data.getDate() + dias)
  return data.toISOString().split('T')[0]
}

Cypress.Commands.add('criarOperacaoEstruturada', (empresa, produto, qtdParcelas, valorSolicitado, codigoContrato, taxaMensal) => {
  cy.contains('Planilha Operacional').click()
  cy.get('.MuiOutlinedInput-root > .MuiOutlinedInput-input').eq(0).type(empresa.razaoSocial)
  cy.contains(empresa.razaoSocial).click()
  cy.get('.MuiOutlinedInput-root > .MuiOutlinedInput-input').eq(1).type(empresa.razaoSocial)
  cy.contains(empresa.razaoSocial).click()
  cy.get('.MuiOutlinedInput-root > .MuiOutlinedInput-input').eq(2).type(produto)
  cy.contains(produto).click()
  cy.get('.MuiOutlinedInput-root > .MuiOutlinedInput-input').eq(3).type(empresa.fundos[0])
  cy.contains(empresa.fundos[0]).click()
  cy.get('.MuiOutlinedInput-root > .MuiOutlinedInput-input').eq(5).type(gerarData(10))
  cy.get('.MuiOutlinedInput-root > .MuiOutlinedInput-input').eq(6).type(gerarData(11))
  cy.get('.MuiOutlinedInput-root > .MuiOutlinedInput-input').eq(7).type(gerarData(50))
  cy.get('.MuiOutlinedInput-root > .MuiOutlinedInput-input').eq(8).type(qtdParcelas)
  cy.get('.MuiOutlinedInput-root > .MuiOutlinedInput-input').eq(9).type(qtdParcelas - 5)
  cy.get('.MuiOutlinedInput-root > .MuiOutlinedInput-input').eq(11).type(valorSolicitado)
  cy.get('.MuiOutlinedInput-root > .MuiOutlinedInput-input').eq(12).type(10000)
  cy.get('.MuiOutlinedInput-root > .MuiOutlinedInput-input').eq(14).type(codigoContrato)
  cy.get('.MuiOutlinedInput-root > .MuiOutlinedInput-input').eq(15).type(taxaMensal)
  cy.contains('Calcular').click()
  cy.wait(2000)
  cy.contains('Criar Pré Operação Especial').click()
  cy.contains('Confirmar').click()
})

Cypress.Commands.add('dataMonitorDiario', (data = null) => {
  if (data === null) {
    cy.get('.mop-MuiInputBase-root > .mop-MuiInputBase-input').eq(0).type(gerarData(-15))
    cy.get('.mop-MuiInputBase-root > .mop-MuiInputBase-input').eq(1).type(gerarData(15))
  } else {
    cy.get('.mop-MuiInputBase-root > .mop-MuiInputBase-input').eq(0).type(data)
    cy.get('.mop-MuiInputBase-root > .mop-MuiInputBase-input').eq(1).type(data)
  }
})