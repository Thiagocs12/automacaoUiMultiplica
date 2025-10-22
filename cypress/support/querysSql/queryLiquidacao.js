Cypress.Commands.add('mudarDatasOperacao', (idOperacao) => {
    const sql = `
    UPDATE MC_MOP_OPERACAO
        SET dataOperacao = getdate()-10, dataEmissao = getdate()-10
    WHERE id = @idOperacao
  `

  return cy.task('db:exec', { 
    sql, 
    params: { idOperacao } 
  })
})

Cypress.Commands.add('obterUltimaOrdemDePagamento', (cnpjCpf) => {
  return cy.task('db:exec', {
    sql: `
        SELECT
        	MAX(a.id) as idOrdemPagamento
        FROM MC_LIQ_ORDEM_PAGAMENTO a
        JOIN MC_CED_CEDENTE b ON a.idCedente = b.id
        JOIN MC_CAD_PESSOA c ON	b.idPessoa = c.id
        WHERE c.cnpjCpf = @cnpjCpf;
    `,
    params: { cnpjCpf }
  }).then((res) => {
    const row = (res.recordset || res)[0]
    return String(row.idOrdemPagamento)
  })
})