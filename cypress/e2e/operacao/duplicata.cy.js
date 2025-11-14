const user = Cypress.env('user')
const empresa = Cypress.env('empresa2')


describe('Operação - Duplicata', () => {
  before(() => {
    cy.armazenarKCTokenEmEnv()
  })
  
  it('Criar a pré operacao', () => {
    cy.loginKeycloak(user.usuario, user.senha, 'banking')
    cy.acessarTelaBanking(empresa.razaoSocial)
    cy.criarOperacaDuplicata('/operacao/remessaOperacaoAutomacao.rem')
    cy.contains('Criar Operação').should('be.visible')
    cy.verificarLocal('Operações')
  })

  it('Adicionar xmls e ajustar vencimentos', () => {
    cy.loginKeycloak(user.usuario, user.senha, 'banking')
    cy.acessarTelaBanking(empresa.razaoSocial, 'Importar XML')
    cy.enviarXml('/operacao/xmlOperacaoAutomacao.zip')
    cy.verificarLocal('Arquivo importado com sucesso!')
    cy.wait(10000)
    cy.obterUltimaPreOperacaoPorCnpj(empresa.cnpj).then((idPreOperacao) => {
      cy.atualizarNotaFiscalPorPreOperacao(idPreOperacao)
    })
  })

  it('Verificar o vinculo e avançar operação', () => {
    cy.obterUltimaPreOperacaoPorCnpj(empresa.cnpj).then((idPreOperacao) => {
      cy.atualizarNotaFiscalPorPreOperacao(idPreOperacao)
      cy.atualizarVencimentosPreOperacao(idPreOperacao)
      cy.reprocessarTitulos(idPreOperacao)
    })
    cy.loginKeycloak(user.usuario, user.senha, 'banking')
    cy.acessarTelaBanking(empresa.razaoSocial)
    cy.get('[aria-label="Avançar"]').first().click()
    cy.verificarLocal('em análise')
  })

  it('Middle', () => {
    cy.obterUltimaPreOperacaoPorCnpj(empresa.cnpj).then((idOperacao) => {
      cy.atualizarNotaFiscalPorOperacao(idOperacao)
    })
    cy.loginKeycloak(user.usuario, user.senha)
    cy.menu('Beyond BackOffice', 'Comercial', 'Operação')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor Diário', 'Analisar Operação', 'Operação')
    cy.adicionarFundoOpe('MULTIPLICA', empresa.contaBancaria.conta)
    cy.tikGet(':nth-child(11) > .mop-MuiStepLabel-root').click()
    cy.tikGet('[aria-label="Gerar Danfe"]').click()
    cy.wait(500)
    cy.avancarEsteira('TESTE AUTOMAÇÃO - AVANÇAR ETAPA DE MIDDLE', 'Avançar', 'Operação')
    cy.verificarLocal()
  })

  it('Comercial OPE', () => {
    cy.loginKeycloak(user.usuario, user.senha)
    cy.menu('Beyond BackOffice', 'Comercial', 'Operação')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor Diário', 'Analisar Operação', 'Operação')
    cy.avancarEsteira('TESTE AUTOMAÇÃO - AVANÇAR ETAPA DE COMERCIAL OPE', 'Avançar', 'Operação')
    cy.verificarLocal()
  })

  it('Análise MOP', () => {
    cy.loginKeycloak(user.usuario, user.senha)
    cy.menu('Beyond BackOffice', 'Comercial', 'Operação')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor Diário', 'Analisar MOP', 'Operação')
    cy.avancarEsteira('TESTE AUTOMAÇÃO - AVANÇAR ETAPA DE ANALISE MOP', 'Avançar', 'Operação')
    cy.verificarLocal()
  })

  it('Alcada Diretoria', () => {
    cy.loginKeycloak(user.usuario, user.senha)
    cy.menu('Beyond BackOffice', 'Comercial', 'Operação')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor Diário', 'Analisar Alçada Diretoria OPE', 'Operação')
    cy.aprovarAlcada('Aprovar Operação na Alçada Diretoria OPE')
    cy.verificarLocal('Alçada aprovada com sucesso!')
  })

  it('Tesouraria OPE', () => {
    cy.loginKeycloak(user.usuario, user.senha)
    cy.menu('Beyond BackOffice', 'Comercial', 'Operação')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor Diário', 'Analisar Tesouraria OPE', 'Operação')
    cy.contains('Efetivar').click()
    cy.contains('Sua operação foi efetivada').should('be.visible')
    cy.avancarEsteira('TESTE AUTOMAÇÃO - AVANÇAR ETAPA DE TESOURARIA OPE', 'Avançar', 'Operação')
    cy.verificarLocal()
  })

  it.only('Gestora OPE', () => {
    cy.loginKeycloak(user.usuario, user.senha)
    cy.menu('Beyond BackOffice', 'Comercial', 'Operação')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor Diário', 'Analisar Gestora OPE', 'Operação')
    cy.avancarEsteira('TESTE AUTOMAÇÃO - AVANÇAR ETAPA DE GESTORA OPE', 'Avançar', 'Operação')
    cy.verificarLocal()
  })

  it.only('Tesouraria Pag', () => {
    cy.loginKeycloak(user.usuario, user.senha)
    cy.menu('Beyond BackOffice', 'Comercial', 'Operação')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor Diário', 'Analisar Tesouraria OPE', 'Operação')
    cy.avancarEsteira('TESTE AUTOMAÇÃO - AVANÇAR ETAPA DE TESOURARIA PAG', 'Avançar', 'Operação')
    cy.verificarLocal()
  })
  
  it.only('Pagamento OPE', () => {
    cy.loginKeycloak(user.usuario, user.senha)
    cy.menu('Beyond BackOffice', 'Comercial', 'Operação')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor Diário', 'Realizar Pagamento OPE', 'Operação')
    cy.avancarEsteira('TESTE AUTOMAÇÃO - PAGAR OPERAÇÃO', 'Avançar', 'Operação')
    cy.verificarLocal()
  })
})