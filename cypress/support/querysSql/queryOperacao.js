Cypress.Commands.add('obterUltimaPreOperacaoPorCnpj', (cnpjCpf) => {
  return cy.task('db:exec', {
    sql: `
        SELECT
            MAX(a.id) AS idPreOperacao
        FROM MC_MOP_PRE_OPERACAO a
        JOIN MC_CED_CEDENTE b ON a.idCedente = b.id
        JOIN MC_CAD_PESSOA  c ON b.idPessoa  = c.id
        WHERE c.cnpjCpf = @cnpjCpf
    `,
    params: { cnpjCpf }
  }).then((res) => {
    const row = (res.recordset || res)[0]
    return String(row.idPreOperacao)
  })
})

Cypress.Commands.add( 'atualizarNotaFiscalPorPreOperacao', (idPreOperacao) => {
  const sql = `
      UPDATE a
      SET 
          a.idNotaFiscal          = c.id,
          a.idNotaFiscalDuplicata = d.id,
          a.chaveNota             = c.chaveNota
      FROM MC_MOP_PRE_OPERACAO_TITULO a
      JOIN MC_MOP_PRE_OPERACAO b
        ON a.idPreOperacao = b.id
      LEFT JOIN MC_MOP_NOTA_XML c
        ON b.idCedente = c.idCedente
      AND a.numDocumento LIKE '%' + c.numeroNota + '%'
      AND a.cnpjSacado = c.cnpjDestinatario
      LEFT JOIN MC_MOP_NOTA_XML_DUPLICATA d
        ON c.id = d.idNotaXML
      AND a.valorTotal <= d.valor
      AND a.dataVencimento BETWEEN DATEADD(DAY, -2, d.dataVencimento)
                                AND DATEADD(DAY,  2, d.dataVencimento)
      WHERE
          b.id = @idPreOperacao
          AND (
               ISNULL(a.idNotaFiscalDuplicata, 0) <> ISNULL(d.id, 0)
            OR ISNULL(a.idNotaFiscal,         0) <> ISNULL(c.id, 0)
            OR ISNULL(a.chaveNota,           '') <> ISNULL(c.chaveNota, ''));`
  return cy.task('db:exec', { sql, params: { idPreOperacao } })
})

Cypress.Commands.add( 'atualizarNotaFiscalPorOperacao', (idOperacao) => {
  const sql = `
    UPDATE a
    SET 
        a.idNotaFiscal          = c.id,
        a.idNotaFiscalDuplicata = d.id,
        a.chaveNota             = c.chaveNota,
        a.idArquivoDanfe        = c.idArquivoDanfeNota
    FROM MC_MOP_OPERACAO_TITULO a
    JOIN MC_MOP_OPERACAO b 
      ON a.idOperacao = b.id
    JOIN MC_CAD_SACADO f 
      ON a.idSacado = f.id
    JOIN MC_CAD_PESSOA g 
      ON f.idPessoa = g.id
    LEFT JOIN MC_MOP_NOTA_XML c 
      ON b.idCedente = c.idCedente
     AND a.numDocumento LIKE '%' + c.numeroNota + '%'
     AND g.cnpjCPF = c.cnpjDestinatario
    LEFT JOIN MC_MOP_NOTA_XML_DUPLICATA d 
      ON c.id = d.idNotaXML
     AND a.valorTitulo <= d.valor
     AND a.dataVencimento BETWEEN DATEADD(DAY, -2, d.dataVencimento) 
                              AND DATEADD(DAY,  2, d.dataVencimento)
    WHERE
        b.id = @idOperacao
        AND (
             ISNULL(a.idNotaFiscalDuplicata, 0) <> ISNULL(d.id, 0)
          OR ISNULL(a.idNotaFiscal,         0) <> ISNULL(c.id, 0)
          OR ISNULL(a.chaveNota,           '') <> ISNULL(c.chaveNota, ''));`
  return cy.task('db:exec', { sql, params: { idOperacao } })
})

Cypress.Commands.add('atualizarVencimentosPreOperacao', (idPreOperacao) => {
  const sql = `
    UPDATE MC_MOP_PRE_OPERACAO_TITULO
    SET dataVencimento = CONVERT(varchar(10), DATEADD(DAY, CAST(RAND() * (180 - 7) + 7 AS INT), GETDATE()), 23)
    WHERE idPreOperacao = @idPreOperacao
    
    UPDATE d
    SET d.dataVencimento = t.dataVencimento
    FROM MC_MOP_NOTA_XML_DUPLICATA d
    JOIN MC_MOP_PRE_OPERACAO_TITULO t 
      ON d.id = t.idNotaFiscalDuplicata
    WHERE t.idPreOperacao = @idPreOperacao
  `

  return cy.task('db:exec', { 
    sql, 
    params: { idPreOperacao } 
  })
})
