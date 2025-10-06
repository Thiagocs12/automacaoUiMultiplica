Cypress.Commands.add('reprocessarTitulos', (idPreOperacao) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('BASE_URL_BACKOFFICE')}/mc-api-gateway-ms/v1/operacao/pre-operacoes/${idPreOperacao}/titulos/reprocessar`,
    headers: {
      Authorization: `Bearer ${Cypress.env('token')}`
    }
  })
})