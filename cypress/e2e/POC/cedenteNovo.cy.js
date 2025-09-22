const user = Cypress.env('user');
const empresa = Cypress.env('empresa');

describe('Criação de uma POC para um cedente novo na casa', () => {
    //before(() => {
    //    cy.cleanupPessoa(empresa.cnpj)
    //})

    beforeEach(() => {
        cy.loginKeycloak(user.usuario, user.senha);
    });

    it('Criar uma poc para um cedente novo na casa', () => {
        cy.menu('Beyond BackOffice', 'Comercial', 'Prospect');
        cy.criarProspect(empresa.cnpj, 'PROSPECT');
        cy.verificarLocal('Dados do Prospect');
        cy.atualizarNomeFantasia(empresa.cnpj);
    });

    //it('Validar que não posso criar uma poc para um cnpj que já está na esteira', () => {
    //    cy.menu('Beyond BackOffice', 'Comercial', 'Prospect');
    //    cy.criarProspect(empresa.cnpj, 'PROSPECT');
    //    cy.contains('CNPJ informado está associado a uma esteira ativa.').should('be.visible');
    //})

    it.only('Prospecção inicial', () => {
        cy.menu('Beyond BackOffice', 'Comercial', 'Prospect');
        cy.buscarProspectMonitor(empresa.cnpj, 'Monitor', 'Cadastrar Prospect');
        cy.wait(200);
        cy.preencherPleitoLimiteGlobal('50000000');
        for (const produto in empresa.produtos) {
            const { limite, prazo, taxa, concentracao } = empresa.produtos[produto];
            cy.adicionarProdutosPleito(produto, limite, prazo, taxa, concentracao);
        }
        cy.avancarEsteira('TESTE AUTOMACAO - AVANÇAR ETAPA PARA DADOS COMPLEMENTARES');
        cy.verificarLocal();
    });

    it('Dados Complementares', () => {
        cy.menu('Beyond BackOffice', 'Comercial', 'Prospect');
        cy.buscarProspectMonitor(empresa.cnpj, 'Monitor', 'Cadastrar Prospect');
        cy.avancarEsteira('TESTE AUTOMACAO - AVANÇAR ETAPA PARA KYC');
        cy.verificarLocal();
    });

    it('KYC', () => {
        cy.menu('Beyond BackOffice', 'Comercial', 'Prospect');
        cy.buscarProspectMonitor(empresa.cnpj, 'KYC', 'Responder KYC');
        for (const kyc of empresa.kyc) {
            cy.contains(kyc).click();
        }
        cy.contains('Salvar').click();
        cy.avancarEsteira('TESTE AUTOMACAO - AVANÇAR ETAPA PARA APROVAÇÃO PROSPECT');
        cy.verificarLocal();
    });

    it('Aprovação Plataforma', () => {
        cy.menu('Beyond BackOffice', 'Comercial', 'Prospect');
        cy.buscarProspectMonitor(empresa.cnpj, 'Monitor');
        cy.aprovarProspect('TESTE AUTOMACAO - APROVAR PROSPECT PLATAFORMA');
        cy.verificarLocal();
    });
    it('Aprovação Superintedente', () => {
        cy.menu('Beyond BackOffice', 'Comercial', 'Prospect');
        cy.buscarProspectMonitor(empresa.cnpj, 'Monitor');
        cy.aprovarProspect('TESTE AUTOMACAO - APROVAR PROSPECT SUPERINTENDENTE');
        cy.verificarLocal();
    });
    it('Aprovação Diretoria', () => {
        cy.menu('Beyond BackOffice', 'Comercial', 'Prospect');
        cy.buscarProspectMonitor(empresa.cnpj, 'Monitor');
        cy.aprovarProspect('TESTE AUTOMACAO - APROVAR PROSPECT DIRETORIA');
        cy.verificarLocal();
    });

    it('Aprovação compliance', () => {
        cy.menu('Beyond BackOffice', 'Compliance', 'Prospect');
        cy.buscarProspectMonitor(empresa.cnpj, 'Compliance');
        cy.preencherCompliance('TESTE AUTOMACAO - APROVAÇÃO COMPLIANCE');
        cy.avancarEsteira('TESTE AUTOMACAO - APROVAÇÃO PARA JURIDICO COMPLIANCE');
    });

    it('Aprovação jurídico compliance', () => {
        cy.menu('Beyond BackOffice', 'Comercial', 'Prospect');
        cy.buscarProspectMonitor(empresa.cnpj, 'Monitor', 'Cadastrar Prospect');
        cy.avancarEsteira('TESTE AUTOMACAO - APROVAÇÃO PARA COMPLIANCE 2');
    });
    
    it('Aprovação compliance 2', () => {
        cy.menu('Beyond BackOffice', 'Comercial', 'Prospect');
        cy.buscarProspectMonitor(empresa.cnpj, 'Monitor');
        cy.aprovarProspect('TESTE AUTOMACAO - APROVAÇÃO PARA DISTRIBUIÇÃO', 'Cadastrar Prospect');
        cy.verificarLocal();
    });

    it('Distribuição', () => {
        cy.menu('Beyond BackOffice', 'Crédito', 'Prospect');
        cy.contains('Distribuição').click();
        cy.distribuirProposta(empresa.cnpj);
        cy.verificarLocal('Distribuição Comitê');
    });

    it('Analise de Credito', () => {
        cy.menu('Beyond BackOffice', 'Crédito', 'Prospect');
        cy.buscarProspectMonitor(empresa.cnpj, 'Análise Crédito', 'Realizar POC');
        cy.avancarEsteira('TESTE AUTOMACAO - APROVAÇÃO PARA PRÉ COMITÊ');
    })

    it('Pré Comitê', () => {
        cy.menu('Beyond BackOffice', 'Crédito', 'Prospect');
        cy.buscarProspectMonitor(empresa.cnpj, 'Pré Comitê');
        cy.get('.MuiTableCell-alignCenter > .MuiButtonBase-root').click()
        cy.acessarProspectNaTela('Analisar');
        cy.avancarEsteira('TESTE AUTOMACAO - APROVAÇÃO PARA COMITÊ');
    })

    it('Comitê de Crédito', () => {
        //cy.viewport(1920, 1080)
        cy.menu('Beyond BackOffice', 'Comitê', 'Comitê de Crédito', 'Comitê de Crédito');
        cy.buscarProspectMonitor(empresa.cnpj, 'Comitê de Crédito');
        cy.wait(500);
        cy.get(':nth-child(5) > .MuiPaper-root > .MuiTableContainer-root > .MuiTable-root > .MuiTableBody-root > .MuiTableRow-root > .MuiTableCell-alignCenter > .MuiButtonBase-root').click() //# Sbotão + expandir comites
        cy.acessarProspectNaTela('Votar');
        cy.wait(3000);
        cy.contains('Votação').click();
        cy.contains('Portal Beyond').click();
        cy.contains('Portal Terceiros').click();
        cy.contains('Salvar').click();
        cy.get(':nth-child(3) > .prospeccao-MuiBox-root > .prospeccao-MuiButtonBase-root').click(); //# Botão enviar votação
        cy.get('input.PrivateSwitchBase-input.css-1m9pwf3').check({ force: true }) //# selecionar todos votantes
        cy.contains('Enviar').click();
        cy.votarComiteFavoravelPorCnpj(empresa.cnpj);
        cy.wait(200000);
    })
});