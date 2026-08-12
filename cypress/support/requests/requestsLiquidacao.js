Cypress.Commands.add('gerarPosicoesCedente', (cnpjCpf, dataLimite) => {
  return cy.task('db:exec', {
    sql: `
      DECLARE @idPessoa INT = (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf = @cnpjCpf);
      DECLARE @idCedente INT = (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa = @idPessoa);
      SELECT a.id AS idOperacao FROM MC_MOP_OPERACAO a WHERE idCedente = @idCedente;
    `,
    params: { cnpjCpf }
  }).then((res) => {
    const operacoes = res.recordset || res
    operacoes.forEach((op) => {
      cy.mudarDatasOperacao(op.idOperacao)
      cy.request({
        method: 'PUT',
        url: `${Cypress.env('BASE_URL_BACKOFFICE')}/mc-liquidacao-api-ms/v1/operacao/atualiza-posicao-diaria-ate-data-limite/${op.idOperacao}?dataLimite=${dataLimite}`,
        headers: { Authorization: `Bearer ${Cypress.env('token')}` }
      })
    })
  })
})
