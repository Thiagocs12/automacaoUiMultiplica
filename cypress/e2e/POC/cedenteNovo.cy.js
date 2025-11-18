const user = Cypress.env('user')
const empresa = Cypress.env('empresa')

describe('Criação de uma POC para um cedente novo na casa', () => {
  before(() => {
    cy.cleanupPessoa(empresa.cnpj)
    cy.armazenarKCTokenEmEnv()
    cy.capturarIdsParecer()
  })

  beforeEach(() => {
    cy.loginKeycloak(user.usuario, user.senha)
  })

  it('Prospecção Inicial', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    cy.criarProspect(empresa.cnpj, 'PROSPECT')
    cy.verificarLocal('Dados do Prospect')
    cy.atualizarNomeFantasia(empresa.cnpj)
    cy.adicionarContaBancaria(empresa.contaBancaria)
    cy.preencherPleitoLimiteGlobal('500000000')
    empresa.fundos.forEach((fundo) => {
      cy.adicionarFundoPleito(fundo)
    })
    for (const produto in empresa.produtos) {
      const { limite, prazo, taxa, concentracao } = empresa.produtos[produto]
      cy.adicionarProdutosPleito(produto, limite, prazo, taxa, concentracao)
    }
    cy.avancarEsteira('TESTE AUTOMACAO - AVANÇAR ETAPA PARA DADOS COMPLEMENTARES')
    cy.verificarLocal()
  })

  it.skip('Validar que não posso criar uma poc para um cnpj que já está na esteira', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    cy.criarProspect(empresa.cnpj, 'PROSPECT')
    cy.contains('CNPJ informado está associado a uma esteira ativa.').should('be.visible')
  })

  it('Dados Complementares', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor', 'Cadastrar Prospect')
    cy.avancarEsteira('TESTE AUTOMACAO - AVANÇAR ETAPA PARA KYC')
    cy.verificarLocal()
  })

  it('KYC', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'KYC', 'Responder KYC')
    for (const kyc of empresa.kyc) {
      cy.contains(kyc).click()
    }
    cy.tikCon('Salvar')
    cy.avancarEsteira('TESTE AUTOMACAO - AVANÇAR ETAPA PARA APROVAÇÃO PROSPECT')
    cy.verificarLocal()
  })

  it('Aprovação Prospect', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor')
    cy.aprovarProspect('TESTE AUTOMACAO - APROVAR PROSPECT PLATAFORMA')
    cy.verificarLocal()
    cy.aprovarProspect('TESTE AUTOMACAO - APROVAR PROSPECT SUPERINTENDENTE')
    cy.verificarLocal()
    cy.aprovarProspect('TESTE AUTOMACAO - APROVAR PROSPECT DIRETORIA')
    cy.verificarLocal()
  })

  it('Aprovação compliance', () => {
    cy.menu('Beyond BackOffice', 'Compliance', 'Prospect')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Compliance')
    cy.preencherCompliance('TESTE AUTOMACAO - APROVAÇÃO COMPLIANCE')
    cy.avancarEsteira('TESTE AUTOMACAO - APROVAÇÃO PARA JURIDICO COMPLIANCE')
    cy.verificarLocal()
  })

  it('Aprovação jurídico compliance e compliance 2', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor', 'Cadastrar Prospect')
    cy.avancarEsteira('TESTE AUTOMACAO - APROVAÇÃO PARA COMPLIANCE 2')
    cy.verificarLocal()
    cy.aprovarProspect('TESTE AUTOMACAO - APROVAÇÃO PARA DISTRIBUIÇÃO', 'Cadastrar Prospect')
    cy.verificarLocal()
  })

  it('Distribuição', () => {
    cy.atualizarSituacaoComite()
    cy.menu('Beyond BackOffice', 'Crédito', 'Prospect')
    cy.contains('Distribuição').click()
    cy.distribuirProposta(empresa.cnpj)
    cy.verificarLocal('Comitê')
  })

  it('Analise de Credito', () => {
    cy.setarPOC(empresa.cnpj)
    cy.menu('Beyond BackOffice', 'Crédito', 'Prospect')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Análise Crédito', 'Realizar POC')
    cy.avancarEsteira('TESTE AUTOMACAO - APROVAÇÃO PARA COMITÊ')
    cy.verificarLocal('Análise Crédito')
  })

  it('Comitê de crédito', () => {
    cy.menu('Beyond BackOffice', 'Comitê', 'Comitê de Crédito', 'Comitê de Crédito')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Comitê de Crédito', 'Votar')
    cy.setarComite(empresa.cnpj)
    cy.aprovarComite(empresa.cnpj)
    cy.avancarComite()
    cy.verificarLocal()
  })

  it('Middle Documental', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor', 'Cadastrar Cedente')
    cy.avancarEsteira('TESTE AUTOMACAO - AVANÇAR ETAPA PARA DOCS COMERCIAL', 'Formalização')
    cy.verificarLocal()
  })

  it('Formalização', () => {
    cy.menu('Beyond BackOffice', 'Formalização', 'Formalização', 'Monitor')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Formalização', 'Realizar Formalização')
    cy.avancarEsteira('TESTE AUTOMACAO - AVANÇAR ETAPA PARA ADMINSTRADORA', 'Administradora')
    cy.get(':nth-child(3) > div > .prospeccao-MuiButtonBase-root > .prospeccao-MuiButton-label').click() //#botão administradora
    cy.get('[name="aprovar"] > .prospeccao-MuiButton-label').click() //#botão confirmar
    cy.verificarLocal()
  })

  it('Administradora', () => {
    cy.menu('Beyond BackOffice', 'Formalização', 'Administradora', 'Monitor')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Administradora', 'Realizar Administração')
    cy.habilitarFundo(2)
    cy.avancarEsteira('TESTE AUTOMACAO - FINALIZAR A ESTEIRA', 'Finalizar')
    cy.verificarLocal()
  })
})