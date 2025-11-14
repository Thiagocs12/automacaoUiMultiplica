const user = Cypress.env('user')
const empresa = Cypress.env('empresa')

describe('Renovação de um cedente da casa', () => {
  before(() => {
    cy.armazenarKCTokenEmEnv()
  })

  beforeEach(() => {
    cy.loginKeycloak(user.usuario, user.senha)
  })

  it('Prospecção inicial', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    cy.cedenteVencido(empresa.cnpj)
    cy.criarProspect(empresa.cnpj, 'PROSPECT', false)
    cy.verificarLocal()
    cy.buscarEntidadeMonitor(empresa.cnpj, 'Monitor', 'Cadastrar Prospect')
    cy.adicionarTelefone(empresa.telefones)
    cy.adicionarContato(empresa.contato)
    cy.adicionarSocio(empresa.socio)
    cy.ajustesRenovacao('6000000')
    cy.avancarEsteira('TESTE AUTOMACAO - AVANÇAR ETAPA PARA DADOS COMPLEMENTARES')
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
    cy.buscarEntidadeMonitor(cnpj, 'Comitê de Crédito', 'Votar')
    cy.setarComite(cnpj)
    cy.aprovarComite(cnpj)
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
    cy.avancarEsteira('TESTE AUTOMACAO - FINALIZAR A ESTEIRA', 'Finalizar')
  })
})