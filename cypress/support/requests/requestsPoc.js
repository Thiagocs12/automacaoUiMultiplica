Cypress.Commands.add('pocPleitoProduto', (idProposta) => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('BASE_URL_BACKOFFICE')}/mc-poc-ms/api/v1/pocPleitoProduto/listAllAndCopy/${idProposta}`,
    headers: {
      Authorization: `Bearer ${Cypress.env('token')}`
    }
  })
})

Cypress.Commands.add('pocPleito', (idProposta) => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('BASE_URL_BACKOFFICE')}/mc-poc-ms/api/v1/pocPleito/findByPropostaAndCopy/${idProposta}`,
    headers: {
      Authorization: `Bearer ${Cypress.env('token')}`
    }
  })
})

Cypress.Commands.add('pocComiteLimiteProduto', (idComiteProposta) => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('BASE_URL_BACKOFFICE')}/mc-poc-ms/api/v1/pocComiteLimiteProduto/listAllDadosProdutoLimiteAndCopy/${idComiteProposta}`,
    headers: {
      Authorization: `Bearer ${Cypress.env('token')}`
    }
  })
})

Cypress.Commands.add('pocComiteLimiteBoleto', (idComiteProposta) => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('BASE_URL_BACKOFFICE')}/mc-poc-ms/api/v1/pocComiteLimiteBoleto/listAllDadosBoletoLimiteAndCopy/${idComiteProposta}`,
    headers: {
      Authorization: `Bearer ${Cypress.env('token')}`
    }
  })
})

Cypress.Commands.add('pocVotacao', (idComiteProposta) => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('BASE_URL_BACKOFFICE')}/mc-poc-ms/api/v1/pocVotacao/listAllDadosFundoAndCopy/${idComiteProposta}`,
    headers: {
      Authorization: `Bearer ${Cypress.env('token')}`
    }
  })
})

Cypress.Commands.add('setarPOC', (cnpj) => {
  cy.obterIdProposta(cnpj).then((idProposta) => {
    cy.pocPleitoProduto(idProposta)
    cy.pocPleito(idProposta)
  })
})

Cypress.Commands.add('setarComite', (cnpj) => {
  cy.obterIdProposta(cnpj).then((idProposta) => {
    cy.obterIdComite(idProposta).then((idComiteProposta) => {
      cy.pocComiteLimiteProduto(idComiteProposta)
      cy.pocComiteLimiteBoleto(idComiteProposta)
      cy.pocVotacao(idComiteProposta)
    })
  })
})
