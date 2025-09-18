const user = Cypress.env('user')

const empresa = Cypress.env('empresa')

describe('Criação de uma POC para um cedente novo na casa', () => {
    //before(() => {
    //    cy.cleanupPessoa(empresa.cnpj)
    //})

    beforeEach(() => {
        cy.loginKeycloak(user.usuario, user.senha)
    })

    it('Criar uma poc para um cedente novo na casa', () => {
        cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
        cy.criarProspect(empresa.cnpj, 'PROSPECT')
        cy.contains('Dados do Prospect').should('be.visible')
        cy.atualizarNomeFantasia(empresa.cnpj)
    })
    
    //it('Validar que não posso criar uma poc para um cnpj que já está na esteira', () => {
    //    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')
    //    cy.criarProspect(empresa.cnpj, 'PROSPECT')
    //    cy.contains('CNPJ informado está associado a uma esteira ativa.').should('be.visible')
    //})

    it('Preencho os dados necessários para prosseguir com a poc', () => {
        cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')        
        cy.buscarProspectMonitor(empresa.cnpj, 'Monitor', 'Cadastrar Prospect')
        cy.wait(200)
        cy.preencherPleitoLimiteGlobal('50000000')
        for (const produto in empresa.produtos) {
            const { limite, prazo, taxa, concentracao } = empresa.produtos[produto]
            cy.adicionarProdutosPleito(produto, limite, prazo, taxa, concentracao)
        }
        cy.avancarEsteira('TESTE AUTOMACAO - AVANÇAR ETAPA PARA DADOS COMPLEMENTARES')
        cy.verificarLocal()
    })

    it('Avançar a POC para KYC', () => {
        cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')        
        cy.buscarProspectMonitor(empresa.cnpj, 'Monitor', 'Cadastrar Prospect')
        cy.avancarEsteira('TESTE AUTOMACAO - AVANÇAR ETAPA PARA KYC')
        cy.verificarLocal()
    })

    it('Avançar a POC para Aprovação Prospect', () => {
        cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')        
        cy.buscarProspectMonitor(empresa.cnpj, 'KYC', 'Responder KYC')
        for (const kyc of empresa.kyc) {
            cy.contains(kyc).click()
        }
        cy.contains('Salvar').click()
        cy.avancarEsteira('TESTE AUTOMACAO - AVANÇAR ETAPA PARA APROVAÇÃO PROSPECT')
        cy.verificarLocal()
    })

    it('Aprovar o Prospect', () => {
        cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')        
        cy.buscarProspectMonitor(empresa.cnpj, 'Monitor')
        cy.aprovarProspect('TESTE AUTOMACAO - APROVAR PROSPECT PLATAFORMA')
        cy.verificarLocal()
        cy.aprovarProspect('TESTE AUTOMACAO - APROVAR PROSPECT SUPERINTENDENCIA')
        cy.verificarLocal()
        cy.aprovarProspect('TESTE AUTOMACAO - APROVAR PROSPECT DIRETORIA COMERCIAL')
        cy.verificarLocal()
    })

    it('Aprovação do compliance', () => {
        cy.menu('Beyond BackOffice', 'Compliance', 'Prospect')
        cy.buscarProspectMonitor(empresa.cnpj, 'Compliance')
        cy.preencherCompliance('TESTE AUTOMACAO - APROVAÇÃO COMPLIANCE')
        cy.avancarEsteira('TESTE AUTOMACAO - APROVAÇÃO PARA JURIDICO COMPLIANCE')
    })

    it('Aprovação do juridico compliance', () => {
        cy.menu('Beyond BackOffice', 'Comercial', 'Prospect')        
        cy.buscarProspectMonitor(empresa.cnpj, 'Monitor', 'Cadastrar Prospect')
        cy.avancarEsteira('TESTE AUTOMACAO - APROVAÇÃO PARA COMPLIANCE 2')
        cy.aprovarProspect('TESTE AUTOMACAO - APROVAÇÃO PARA DISTRIBUIÇÃO', 'Cadastrar Prospect')
    })

    it('Criar comitê e distribuir a POC', () => {
        //cy.viewport(1920, 1080)
        cy.menu('Beyond BackOffice', 'Crédito', 'Prospect')        
        cy.contains('Distribuição').click()
        //preencher comitê
        cy.get('.prospeccao-prospeccao35 > .prospeccao-MuiBox-root > .prospeccao-MuiButtonBase-root').click()//#Adicionar Comitê
        cy.get('[name="dataAgendaFim"]').type(
            Cypress.dayjs().add(1, 'day').format('DD/MM/YYYY')
        )
    })
})