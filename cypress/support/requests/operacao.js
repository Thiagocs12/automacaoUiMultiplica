Cypress.Commands.add('reprocessarTitulos', (idPreOperacao) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('BASE_URL_BACKOFFICE')}/mc-api-gateway-ms/v1/operacao/pre-operacoes/${idPreOperacao}/titulos/reprocessar`,
    headers: {
      Authorization: `Bearer ${Cypress.env('token')}`
    }
  })
})

Cypress.Commands.add('gerarDanfeLote', (idOperacao) => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('BASE_URL_BACKOFFICE')}/mc-operacao-backoffice-ms/api/v1/titulos/geraDANFE/lote?idOperacao=${idOperacao}`,
    headers: {
      Authorization: `Bearer ${Cypress.env('token')}`
    }
  })
})