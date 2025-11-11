const user = Cypress.env('user')
const empresa = Cypress.env('empresa2')
const produto = 'AQUISICAO FINANCEIRA - NOTA COMERCIAL - NOTA COMERCIAL - FINANCEIRA - DEPOSITO EM CONTA'


describe('Operação - Nota Comercial', () => {
  before(() => {
    cy.armazenarKCTokenEmEnv()
  })

  beforeEach(() => {
    cy.loginKeycloak(user.usuario, user.senha)
  })
  
  it('Criar a pré operacao', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Operação')
    cy.criarOperacaoEstruturada(empresa, produto, 15, 50000000, 'NC-', 200000000)
    cy.verificarLocal()
  })

  it('Middle OPE', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Operação')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor Estruturada', 'Analisar Operação', 'Operação')
    cy.avancarEsteira('TESTE AUTOMAÇÃO - AVANÇAR ETAPA DE MIDDLE OPE', 'Avançar', 'Operação')
    cy.verificarLocal()
  })

  it('Alcada Diretoria', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Operação')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor Estruturada', null, 'Operação')
    cy.get('body').then(($body) => {
      if ($body.text().includes('Alçada Diretoria OPE')) {
        cy.aprovarAlcada('Aprovar Operação na Alçada Diretoria OPE')
        cy.verificarLocal('Alçada aprovada com sucesso!')
      }
    })
  })

  it('Formalização OPE', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Operação')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor Estruturada', 'Analisar Operação', 'Operação')
    cy.avancarEsteira('TESTE AUTOMAÇÃO - AVANÇAR ETAPA DE FORMALIZAÇÃO OPE', 'Avançar', 'Operação')
    cy.verificarLocal()
  })

  it('Jurídico OPE', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Operação')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor Estruturada', 'Analisar Jurídico OPE', 'Operação')
    cy.avancarEsteira('TESTE AUTOMAÇÃO - AVANÇAR ETAPA DE JURÍDICO OPE', 'Avançar', 'Operação')
    cy.verificarLocal()
  })

  it('Gestora OPE', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Operação')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor Estruturada', 'Analisar Gestora OPE', 'Operação')
    cy.avancarEsteira('TESTE AUTOMAÇÃO - AVANÇAR ETAPA DE GESTORA OPE', 'Avançar', 'Operação')
    cy.verificarLocal()
  })

  it('Middle', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Operação')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor Diário', 'Analisar Operação', 'Operação')
    cy.adicionarInformacoesPagamento(empresa.contaBancaria.conta, true)
    cy.avancarEsteira('TESTE AUTOMAÇÃO - AVANÇAR ETAPA DE MIDDLE', 'Avançar', 'Operação')
    cy.verificarLocal()
  })
  
  it('Formalização OPE', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Operação')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor Diário', 'Analisar Operação', 'Operação')
    cy.avancarEsteira('TESTE AUTOMAÇÃO - AVANÇAR ETAPA DE FORMALIZAÇÃO OPE', 'Avançar', 'Operação')
    cy.verificarLocal()
  })

  it('Lastro OPE', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Operação')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor Diário', 'Analisar Operação', 'Operação')
    cy.avancarEsteira('TESTE AUTOMAÇÃO - AVANÇAR ETAPA DE LASTRO OPE', 'Avançar', 'Operação')
    cy.verificarLocal()
  })

  it('Jurídico OPE', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Operação')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor Diário', 'Analisar Jurídico OPE', 'Operação')
    cy.avancarEsteira('TESTE AUTOMAÇÃO - AVANÇAR ETAPA DE JURÍDICO OPE', 'Avançar', 'Operação')
    cy.verificarLocal()
  })

  it('Análise MOP', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Operação')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor Diário', 'Analisar MOP', 'Operação')
    cy.avancarEsteira('TESTE AUTOMAÇÃO - AVANÇAR ETAPA DE ANALISE MOP', 'Avançar', 'Operação')
    cy.verificarLocal()
  })

  it('Tesouraria OPE', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Operação')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor Diário', 'Analisar Tesouraria OPE', 'Operação')
    cy.contains('Efetivar').click()
    cy.avancarEsteira('TESTE AUTOMAÇÃO - AVANÇAR ETAPA DE TESOURARIA OPE', 'Avançar', 'Operação')
    cy.verificarLocal()
  })

  it('Gestora OPE', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Operação')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor Diário', 'Analisar Gestora OPE', 'Operação')
    cy.avancarEsteira('TESTE AUTOMAÇÃO - AVANÇAR ETAPA DE GESTORA OPE', 'Avançar', 'Operação')
    cy.verificarLocal()
  })

  it('Tesouraria Pag', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Operação')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor Diário', 'Analisar Tesouraria OPE', 'Operação')
    cy.avancarEsteira('TESTE AUTOMAÇÃO - AVANÇAR ETAPA DE TESOURARIA PAG', 'Avançar', 'Operação')
    cy.verificarLocal()
  })
  
  it('Pagamento OPE', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Operação')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor Diário', 'Realizar Pagamento OPE', 'Operação')
    cy.avancarEsteira('TESTE AUTOMAÇÃO - PAGAR OPERAÇÃO', 'Avançar', 'Operação')
    cy.verificarLocal()
  })
})