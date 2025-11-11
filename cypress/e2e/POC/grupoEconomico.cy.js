const user = Cypress.env('user')
const grupoEconomico = Cypress.env('grupoEconomico')

let cnpj

const empresaPrincipal = Object.entries(grupoEconomico.empresasGrupo).find(([cnpjKey, empresa]) => empresa.principal);
if (empresaPrincipal) {
  [cnpj] = empresaPrincipal
}

describe('Criação de uma POC para um grupo economico novo na casa', () => {
  before(() => {
    Object.keys(grupoEconomico.empresasGrupo).forEach((cnpj) => {
      cy.cleanupPessoa(cnpj)
    })
    cy.excluirGrupoEconomico(grupoEconomico.nome)
    cy.armazenarKCTokenEmEnv()
    cy.capturarIdsParecer()
  })

  beforeEach(() => {
    cy.loginKeycloak(user.usuario, user.senha)
  })

  it('Prospecção Inicial', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    cy.criarProspect(cnpj, 'PROSPECT')
    cy.verificarLocal('Dados do Prospect')
    cy.adicionarGrupoEconomico(grupoEconomico.nome)
    Object.entries(grupoEconomico.empresasGrupo).forEach(([cnpj, empresa]) => {
      if (empresa.principal === false) {
        const { razaoSocial } = empresa
        cy.cadastrarEmpresasGrupo(cnpj, razaoSocial)
      }
    })
    Object.keys(grupoEconomico.empresasGrupo).forEach((cnpj) => {
      cy.atualizarNomeFantasia(cnpj)
    })
    cy.adicionarContaBancaria(grupoEconomico.contaBancaria, false)
    cy.preencherPleitoLimiteGlobal('5000000')
    grupoEconomico.fundos.forEach((fundo) => {
      cy.adicionarFundoPleito(fundo)
    })
    for (const produto in grupoEconomico.produtos) {
      const { limite, prazo, taxa, concentracao } = grupoEconomico.produtos[produto]
      cy.adicionarProdutosPleito(produto, limite, prazo, taxa, concentracao)
    }
    cy.avancarEsteira('TESTE AUTOMACAO - AVANÇAR ETAPA PARA DADOS COMPLEMENTARES')
    cy.verificarLocal()
  })

  it('Dados Complementares', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    cy.buscarEntidadeMonitor(cnpj, 'Monitor', 'Cadastrar Prospect')
    cy.avancarEsteira('TESTE AUTOMACAO - AVANÇAR ETAPA PARA KYC')
    cy.verificarLocal()
  })

  it('KYC', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    cy.buscarEntidadeMonitor(cnpj, 'KYC', 'Responder KYC')
    for (const kyc of grupoEconomico.kyc) {
      cy.contains(kyc).click()
    }
    cy.contains('Salvar').click()
    cy.avancarEsteira('TESTE AUTOMACAO - AVANÇAR ETAPA PARA APROVAÇÃO PROSPECT')
    cy.verificarLocal()
  })

  it('Aprovação Prospect', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    cy.buscarEntidadeMonitor(cnpj, 'Monitor')
    cy.aprovarProspect('TESTE AUTOMACAO - APROVAR PROSPECT PLATAFORMA')
    cy.verificarLocal()
    cy.aprovarProspect('TESTE AUTOMACAO - APROVAR PROSPECT SUPERINTENDENTE')
    cy.verificarLocal()
    cy.aprovarProspect('TESTE AUTOMACAO - APROVAR PROSPECT DIRETORIA')
    cy.verificarLocal()
  })

  it('Aprovação compliance', () => {
    cy.menu('Beyond BackOffice', 'Compliance', 'Prospect')
    cy.buscarEntidadeMonitor(cnpj, 'Compliance')
    cy.preencherCompliance('TESTE AUTOMACAO - APROVAÇÃO COMPLIANCE')
    cy.avancarEsteira('TESTE AUTOMACAO - APROVAÇÃO PARA JURIDICO COMPLIANCE')
  })

  it('Aprovação jurídico compliance e compliance 2', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    cy.buscarEntidadeMonitor(cnpj, 'Monitor', 'Cadastrar Prospect')
    cy.avancarEsteira('TESTE AUTOMACAO - APROVAÇÃO PARA COMPLIANCE 2')
    cy.verificarLocal()
    cy.aprovarProspect('TESTE AUTOMACAO - APROVAÇÃO PARA DISTRIBUIÇÃO', 'Cadastrar Prospect')
    cy.verificarLocal()
  })

  it('Distribuição', () => {
    cy.atualizarSituacaoComite()
    cy.menu('Beyond BackOffice', 'Crédito', 'Prospect')
    cy.contains('Distribuição').click()
    cy.distribuirProposta(cnpj)
    cy.verificarLocal('Comitê')
  })

  it('Analise de Credito', () => {
    cy.setarPOC(cnpj)
    cy.menu('Beyond BackOffice', 'Crédito', 'Prospect')
    cy.buscarEntidadeMonitor(cnpj, 'Análise Crédito', 'Realizar POC')
    cy.avancarEsteira('TESTE AUTOMACAO - APROVAÇÃO PARA PRÉ COMITÊ')
    cy.verificarLocal('Análise Crédito')
  })

  it('Pré Comitê', () => {
    cy.menu('Beyond BackOffice', 'Crédito', 'Prospect')
    cy.buscarEntidadeMonitor(cnpj, 'Pré Comitê')
    cy.get('.MuiTableCell-alignCenter > .MuiButtonBase-root').click() //#Botão
    cy.acessarEntidadeNaTela('Analisar')
    cy.avancarEsteira()
    cy.verificarLocal()
  })

  it('Comitê de crédito', () => {
    cy.setarComite(cnpj)
    cy.menu('Beyond BackOffice', 'Comitê', 'Comitê de Crédito', 'Comitê de Crédito')
    cy.buscarEntidadeMonitor(cnpj, 'Comitê de Crédito', 'Votar')
    cy.aprovarComite(cnpj)
    cy.acessarAtaComite()
    cy.avancarComite()
    cy.verificarLocal()
  })

  it('Middle Documental', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    cy.buscarEntidadeMonitor(cnpj, 'Monitor', 'Cadastrar Cedente')
    cy.avancarEsteira('TESTE AUTOMACAO - AVANÇAR ETAPA PARA FORMALIZAÇÃO', 'Formalização')
    cy.verificarLocal()
  })

  it('Docs Comerciais', () => {
    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    cy.buscarEntidadeMonitor(cnpj, 'Monitor')
    Object.keys(grupoEconomico.empresasGrupo).forEach(() => {
      cy.wait(1000)
      cy.acessarEntidadeNaTela('Cadastrar Cedente')
      cy.avancarEsteira('TESTE AUTOMACAO - AVANÇAR ETAPA PARA FORMALIZAÇÃO', 'Formalização')
      cy.verificarLocal()
    })
  })

  it('Formalização', () => {
    cy.menu('Beyond BackOffice', 'Formalização', 'Formalização', 'Monitor')
    cy.buscarEntidadeMonitor(cnpj, 'Formalização')
    Object.keys(grupoEconomico.empresasGrupo).forEach(() => {
      cy.acessarEntidadeNaTela('Realizar Formalização')
      cy.avancarEsteira('TESTE AUTOMACAO - AVANÇAR ETAPA PARA ADMINSTRADORA', 'Administradora')
      cy.get(':nth-child(3) > div > .prospeccao-MuiButtonBase-root > .prospeccao-MuiButton-label').click() //#botão administradora
      cy.get('[name="aprovar"] > .prospeccao-MuiButton-label').click() //#botão confirmar
      cy.verificarLocal()
    })
  })

  it('Administradora', () => {
    cy.menu('Beyond BackOffice', 'Formalização', 'Administradora', 'Monitor')
    cy.buscarEntidadeMonitor(cnpj, 'Administradora')
    Object.keys(grupoEconomico.empresasGrupo).forEach(() => {
      cy.acessarEntidadeNaTela('Realizar Administração')
      cy.habilitarFundo()
      cy.avancarEsteira('TESTE AUTOMACAO - FINALIZAR A ESTEIRA', 'Finalizar')
    })
  })
})