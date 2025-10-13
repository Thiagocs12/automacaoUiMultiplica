const user = Cypress.env('user')
const empresa = Cypress.env('empresa')

describe('Criação de uma POC para um cedente novo na casa', () => {
  before(() => {
    cy.cleanupPessoa(empresa.cnpj)
    cy.armazenarKCTokenEmEnv()
  })

  beforeEach(() => {
    cy.loginKeycloak(user.usuario, user.senha)
  })

  it('Criar uma poc para um cedente novo na casa', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    cy.criarProspect(empresa.cnpj, 'PROSPECT')
    cy.verificarLocal('Dados do Prospect')
    cy.atualizarNomeFantasia(empresa.cnpj)
  })

  it('Validar que não posso criar uma poc para um cnpj que já está na esteira', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    cy.criarProspect(empresa.cnpj, 'PROSPECT')
    cy.contains('CNPJ informado está associado a uma esteira ativa.').should('be.visible')
  })

  it('Prospecção inicial', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor', 'Cadastrar Prospect')
    cy.adicionarContaBancaria(empresa.contaBancaria)
    cy.preencherPleitoLimiteGlobal('5000000')
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
    cy.contains('Salvar').click()
    cy.avancarEsteira('TESTE AUTOMACAO - AVANÇAR ETAPA PARA APROVAÇÃO PROSPECT')
    cy.verificarLocal()
  })

  it('Aprovação Plataforma', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor')
    cy.aprovarProspect('TESTE AUTOMACAO - APROVAR PROSPECT PLATAFORMA')
    cy.verificarLocal()
  })

  it('Aprovação Superintedente', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor')
    cy.aprovarProspect('TESTE AUTOMACAO - APROVAR PROSPECT SUPERINTENDENTE')
    cy.verificarLocal()
  })

  it('Aprovação Diretoria', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor')
    cy.aprovarProspect('TESTE AUTOMACAO - APROVAR PROSPECT DIRETORIA')
    cy.verificarLocal()
  })

  it('Aprovação compliance', () => {
    cy.menu('Beyond BackOffice', 'Compliance', 'Prospect')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Compliance')
    cy.preencherCompliance('TESTE AUTOMACAO - APROVAÇÃO COMPLIANCE')
    cy.avancarEsteira('TESTE AUTOMACAO - APROVAÇÃO PARA JURIDICO COMPLIANCE')
  })

  it('Aprovação jurídico compliance', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor', 'Cadastrar Prospect')
    cy.avancarEsteira('TESTE AUTOMACAO - APROVAÇÃO PARA COMPLIANCE 2')
  })
  
  it('Aprovação compliance 2', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor')
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
    cy.avancarEsteira('TESTE AUTOMACAO - APROVAÇÃO PARA PRÉ COMITÊ')
    cy.verificarLocal('Análise Crédito')
  })

  it('Pré Comitê', () => {
    cy.menu('Beyond BackOffice', 'Crédito', 'Prospect')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Pré Comitê')
    cy.get('.MuiTableCell-alignCenter > .MuiButtonBase-root').click() //#Botão
    cy.acessarEntidadeNaTela('Analisar')
    cy.avancarEsteira()
    cy.verificarLocal()
  })

  it('Preencher e votar Comitê de Crédito', () => {
    cy.setarComite(empresa.cnpj)
    cy.menu('Beyond BackOffice', 'Comitê', 'Comitê de Crédito', 'Comitê de Crédito')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Comitê de Crédito')
    cy.acessarEntidadeNaTela('Votar')
    cy.wait(5000)
    cy.contains('Votação').click()
    cy.aprovarProspectComite()
    cy.votarComiteFavoravelPorCnpj(empresa.cnpj)
    cy.obterIdProposta(empresa.cnpj).then((idProposta) => {
      cy.finalizaPocComite(idProposta)
    })
  })

  it('Comitê de crédito', () => {
    cy.menu('Beyond BackOffice', 'Comitê', 'Comitê de Crédito', 'Comitê de Crédito')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Comitê de Crédito')
    cy.acessarEntidadeNaTela('Votar')
    cy.acessarAtaComite()
    cy.avancarComite()
    cy.verificarLocal()
  })

  it('Docs Comerciais', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor', 'Cadastrar Cedente')
    cy.avancarEsteira('TESTE AUTOMACAO - AVANÇAR ETAPA PARA FORMALIZAÇÃO', 'Formalização')
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
  })
})