// Tela para a qual o app redireciona automaticamente após salvar um Prospect com sucesso
// (confirmado ao vivo em HML durante a investigação: a URL muda de `/prospeccao/form` para
// `/monitor`). Não há coluna de CNPJ visível na tabela "Prospecções" da listagem, então a
// validação de que o registro criado aparece usa o `Agente Comercial` (`GERENTE AUTOMAÇÃO`,
// reservado para uso por automação) como evidência.
class MonitorProspectPage {
  estaNaTelaDeListagem() {
    cy.location('pathname', { timeout: 20000 }).should('eq', '/monitor')
  }

  prospectCriadoApareceNaListagem(agenteComercial) {
    cy.contains('Prospecções', { timeout: 20000 }).should('be.visible')
    cy.get('table').last().within(() => {
      cy.contains('td', agenteComercial, { timeout: 15000 }).should('be.visible')
    })
  }
}

module.exports = new MonitorProspectPage()
