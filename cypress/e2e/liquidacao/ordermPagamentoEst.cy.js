const user = Cypress.env('user')
const empresa = Cypress.env('empresa')

describe('Ordem de Pagamento - Estoque', () => {
  before(() => {
    cy.armazenarKCTokenEmEnv()
  })

  beforeEach(() => {
    cy.loginKeycloak(user.usuario, user.senha)
  })

  it('Criar a ordem de pagamento', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Liquidação')
    cy.criarOrdemPagamento(empresa.cnpj, empresa.razaoSocial, empresa.fundos[0], 'LIQUIDAÇÃO MANUAL', 'CONTA BRADESCO')
  })

  it('Adiciono um titulo de estoque na ordem de pagamento', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Liquidação')
    cy.acessarOrdemPagamento(empresa.cnpj)
    cy.adicinarTitulosOrdem('18349-3', 'TOTAL')
    cy.avancarEsteira('TESTE AUTOMAÇÃO - AVANÇAR ETAPA DE ANALISE DE PAGAMENTO', 'Avançar', 'ORP')
    cy.verificarLocal('Nova Ordem')
  })

  it('Eftivar e finalizar a ordem de pagamento', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Liquidação')
    cy.acessarOrdemPagamento(empresa.cnpj)
    cy.contains('button', 'Efetivar').click()
    cy.contains('button', 'Confirmar').click()
    cy.avancarEsteira('TESTE AUTOMAÇÃO - FINALIZAR A ESTEIRA DE ORDEM DE PAGAMENTO', 'Avançar', 'ORP')
  })
})