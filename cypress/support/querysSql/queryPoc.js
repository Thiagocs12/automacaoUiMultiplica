// ---------------------------------------------
// Comando: cy.cleanupPessoa(cnpjCpf)
// ---------------------------------------------
Cypress.Commands.add('cleanupPessoa', (cnpjCpf) => {
  cy.limparPropostasPorCnpj(cnpjCpf)
  return cy.task('db:exec', {
    sql: `        
      DECLARE @idPessoa INT;
      SET @idPessoa = (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf = @cnpjCpf);
      DECLARE @idProspect INT;
      SET @idProspect = (SELECT id FROM MC_PRT_PROSPECT WHERE idPessoa = @idPessoa);
      DECLARE @idCedente INT;
      SET @idCedente = (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa = @idPessoa);
      DECLARE @idSacado INT;
      SET @idSacado = (SELECT id FROM MC_CAD_SACADO WHERE idPessoa = @idPessoa);

      UPDATE MC_CED_CEDENTE
          SET idProspect = null
      WHERE id = @idCedente;
      UPDATE MC_MOP_OPERACAO_TITULO 
      	SET idPreOperacaoTitulo = NULL, idNotaFiscal = null, idNotaFiscalDuplicata = null 
      WHERE idOperacao IN (SELECT id FROM MC_MOP_OPERACAO WHERE idCedente = @idCedente);
      UPDATE MC_MOP_PRE_OPERACAO
         SET idOperacao = NULL
      WHERE idCedente = @idCedente;      
      UPDATE MC_MOP_OPERACAO
        SET idPreOperacao = NULL
      WHERE idCedente = @idCedente; 

      DELETE FROM MC_CAD_PESSOA_ENDERECO              WHERE idPessoa = @idPessoa;
      DELETE FROM MC_CED_FILIAL                       WHERE idPessoa = @idPessoa;
      DELETE FROM MC_PRT_FILIAL                       WHERE idPessoa = @idPessoa;
      DELETE FROM MC_PRT_FILIAL                       WHERE idProspect = @idProspect;
      DELETE FROM MC_PRT_FORNECEDORES                 WHERE idProspect = @idProspect;
      DELETE FROM MC_POC_PROSPECT                     WHERE idProspect = @idProspect;     
      DELETE FROM MC_MOP_ENTIDADE_ARQUIVO             WHERE idCedente = @idCedente; 
      DELETE FROM MC_MOP_OPERACAO_CONTA_BANCARIA      WHERE idPessoaContaBancaria IN (SELECT id FROM MC_CAD_PESSOA_CONTA_BANCARIA WHERE idPessoa = @idPessoa);
      DELETE FROM MC_CAD_PESSOA_CONTA_BANCARIA        WHERE idPessoa = @idPessoa;
      DELETE FROM MC_CAD_PESSOA_CONTATO               WHERE idPessoa = @idPessoa;
      DELETE FROM MC_CAD_EMPRESA_GRUPO_ECONOMICO      WHERE idPessoa = @idPessoa;
      DELETE FROM MC_CAD_PESSOA_SOCIO                 WHERE idPessoa = @idPessoa;
      DELETE FROM MC_CAD_PESSOA_ENTIDADE              WHERE idPessoa = @idPessoa;
      DELETE FROM MC_CAD_PESSOA_TELEFONE              WHERE idPessoa = @idPessoa;
      DELETE FROM MC_PRT_PRINCIPAIS_PAISES            WHERE idProspect = @idProspect;
      DELETE FROM MC_CED_GERENTE_LOG                  WHERE idCedente = @idCedente;
      DELETE FROM MC_MOP_TITULOS_POSICAO              WHERE idTitulo IN (SELECT id FROM MC_MOP_TITULOS WHERE idCedente = @idCedente);
      DELETE FROM MC_PRT_PROSPECT                     WHERE idPessoa = @idPessoa;
      DELETE FROM MC_CAD_PESSOA_RECUP_JUDICIAL        WHERE idPessoa = @idPessoa;
      DELETE FROM MC_MOP_TITULOS_COBRANCA             WHERE idTitulo IN (SELECT id FROM MC_MOP_TITULOS WHERE idCedente = @idCedente);
      DELETE FROM MC_MOP_TITULOS_LEGADO               WHERE idTitulo IN (SELECT id FROM MC_MOP_TITULOS WHERE idCedente = @idCedente);
      DELETE FROM MC_MOP_TITULOS_MOVIMENTO            WHERE idTitulo IN (SELECT id FROM MC_MOP_TITULOS WHERE idCedente = @idCedente);
      DELETE FROM MC_MOP_TITULOS_PAGAMENTO            WHERE idTitulo IN (SELECT id FROM MC_MOP_TITULOS WHERE idCedente = @idCedente);
      DELETE FROM MC_LIQ_ORDEM_PAGAMENTO_ITEM_POSICAO WHERE idOrdemPagamentoItem in (SELECT ID FROM MC_LIQ_ORDEM_PAGAMENTO_ITEM WHERE idTitulo IN (SELECT id FROM MC_MOP_TITULOS WHERE idCedente = @idCedente));
      DELETE FROM MC_LIQ_ORDEM_PAGAMENTO_ITEM         WHERE idTitulo IN (SELECT id FROM MC_MOP_TITULOS WHERE idCedente = @idCedente);
      DELETE FROM MC_MOP_TITULOS                      WHERE idCedente = @idCedente;
      DELETE FROM MC_CED_FUNDO                        WHERE idCedente = @idCedente;
      DELETE FROM MC_CED_LOCAL_COBRANCA_NN            WHERE idCedente = @idCedente;
      DELETE FROM MC_CED_GARANTIA_REGRA               WHERE idCedente = @idCedente;
      DELETE FROM MC_CED_CEDENTE_CONVENIO             WHERE idCedente = @idCedente;
      DELETE FROM MC_MOP_ASSINATURA_DIGITAL_SACADO    WHERE idOperacaoTitulo in (SELECT id FROM MC_MOP_OPERACAO_TITULO WHERE idSacado = @idSacado);
      DELETE FROM MC_ENT_DOCUMENTO_KIT                WHERE idCedenteGarantia IN (SELECT id FROM MC_CED_GARANTIA WHERE idCedente = @idCedente);
      DELETE FROM MC_CED_GARANTIA_ITEM                WHERE idCedenteGarantia IN (SELECT id FROM MC_CED_GARANTIA WHERE idCedente = @idCedente);
      DELETE FROM MC_CED_GARANTIA_FORMULARIO          WHERE idCedenteGarantia IN (SELECT id FROM MC_CED_GARANTIA WHERE idCedente = @idCedente);
      DELETE FROM MC_CED_GARANTIA                     WHERE idCedente = @idCedente;
      DELETE FROM MC_MOP_OPERACAO_TITULO_ERRO         WHERE idPreOperacaoTitulo IN (SELECT id FROM MC_MOP_PRE_OPERACAO_TITULO WHERE idPreOperacao IN (SELECT id FROM MC_MOP_PRE_OPERACAO WHERE idCedente = @idCedente));
      DELETE FROM MC_MOP_PRE_OPERACAO_TITULO          WHERE idPreOperacao IN (SELECT id FROM MC_MOP_PRE_OPERACAO WHERE idCedente = @idCedente);
      DELETE FROM MC_MOP_PRE_OPERACAO_TITULO_EXC      WHERE idNotaFiscal in (SELECT id FROM MC_MOP_NOTA_XML WHERE idCedente = @idCedente);
      DELETE FROM MC_MOP_PRE_OPERACAO_TITULO_EXC      WHERE idNotaFiscalDuplicata in (SELECT id FROM MC_MOP_NOTA_XML_DUPLICATA WHERE idNotaXml IN (SELECT id FROM MC_MOP_NOTA_XML WHERE idCedente = @idCedente));
      DELETE FROM MC_MOP_PRE_OPERACAO_TITULO_EXC      WHERE idNotaFiscal in (SELECT id FROM MC_MOP_NOTA_XML WHERE idCedente = @idCedente);
      DELETE FROM MC_MOP_PRE_OPERACAO_TITULO_EXC      WHERE idNotaFiscalDuplicata in (SELECT id FROM MC_MOP_NOTA_XML_DUPLICATA WHERE idNotaXml IN (SELECT id FROM MC_MOP_NOTA_XML WHERE idCedente = @idCedente));
      DELETE FROM MC_MOP_NOTA_XML_DUPLICATA           WHERE idNotaXml IN (SELECT id FROM MC_MOP_NOTA_XML WHERE idCedente = @idCedente);
      DELETE FROM MC_MOP_NOTA_XML                     WHERE idCedente = @idCedente;
      DELETE FROM MC_CAD_ALCADA_PENDENTE_WHATS        WHERE idPreOperacao IN (SELECT id FROM MC_MOP_PRE_OPERACAO WHERE idCedente = @idCedente);
      DELETE FROM MC_MOP_OPERACAO_CUSTO               WHERE idPreOperacao in (SELECT ID FROM MC_MOP_PRE_OPERACAO WHERE idCedente = @idCedente);
      DELETE FROM MC_MOP_PRE_OPERACAO                 WHERE idCedente = @idCedente;
      DELETE FROM MC_MOP_ASSINATURA_DIGITAL_SACADO    WHERE idOperacaoTitulo in (SELECT id FROM MC_MOP_OPERACAO_TITULO WHERE idOperacao IN (SELECT id FROM MC_MOP_OPERACAO WHERE idCedente = @idCedente));
      DELETE FROM MC_MOP_ASSINATURA_DIGITAL_SACADO    WHERE idOperacao in (SELECT id FROM MC_MOP_OPERACAO WHERE idCedente = @idCedente);
      DELETE FROM MC_MOP_ASSINATURA_DIGITAL           WHERE idOperacao in (SELECT id FROM MC_MOP_OPERACAO WHERE idCedente = @idCedente);
      DELETE FROM MC_MOP_OPERACAO_ANALISE             WHERE idOperacao in (SELECT id FROM MC_MOP_OPERACAO WHERE idCedente = @idCedente);
      DELETE FROM MC_MOP_OPERACAO_TERMO_HIST          WHERE idOperacaoTermo in (SELECT id FROM MC_MOP_OPERACAO_TERMO WHERE idOperacao in (SELECT id FROM MC_MOP_OPERACAO WHERE idCedente = @idCedente))
      DELETE FROM MC_MOP_OPERACAO_TERMO               WHERE idOperacao in (SELECT id FROM MC_MOP_OPERACAO WHERE idCedente = @idCedente);
      DELETE FROM MC_MOP_OPERACAO_TITULO_ERRO         WHERE idOperacaoTitulo IN (SELECT id FROM MC_MOP_OPERACAO_TITULO WHERE idOperacao IN (SELECT id FROM MC_MOP_OPERACAO WHERE idCedente = @idCedente));
      DELETE FROM MC_MOP_OPERACAO_TITULO              WHERE idOperacao IN (SELECT id FROM MC_MOP_OPERACAO WHERE idCedente = @idCedente);
      DELETE FROM MC_MOP_OPERACAO_TARIFA              WHERE idOperacao IN (SELECT id FROM MC_MOP_OPERACAO WHERE idCedente = @idCedente);
      DELETE FROM MC_MOP_OPERACAO_TERMO_SECAO_HIST    WHERE idOperacaoTermoSecao in (SELECT id FROM MC_MOP_OPERACAO_TERMO_SECAO WHERE idOperacao in (SELECT id FROM MC_MOP_OPERACAO WHERE idCedente = @idCedente));
   	  DELETE FROM MC_MOP_OPERACAO_TERMO_SECAO         WHERE idOperacao in (SELECT id FROM MC_MOP_OPERACAO WHERE idCedente = @idCedente);
      DELETE FROM MC_MOP_PRE_OPERACAO_EXC             WHERE idCedente = @idCedente;
      DELETE FROM MC_MOP_OPERACAO                     WHERE idCedente = @idCedente;
      DELETE FROM MC_CED_BOLETO                       WHERE idCedente = @idCedente;
      DELETE FROM MC_CED_PARAMETRO_OPERACAO           WHERE idCedente = @idCedente;
      DELETE FROM MC_CED_PRODUTO                      WHERE idCedente = @idCedente;
      DELETE FROM MC_MOP_PRE_OPERACAO_TITULO_EXC      WHERE idCedente = @idCedente;
      DELETE FROM MC_CED_PRODUTO_GARANTIA_REGRA       WHERE idCedenteProduto IN (SELECT id FROM MC_CED_PRODUTO WHERE idCedente = @idCedente);
      DELETE FROM MC_CED_PRODUTO                      WHERE idCedente = @idCedente;
      DELETE FROM MC_CED_PORTAL_CONVENIO              WHERE idCedente = @idCedente;
      DELETE FROM MC_PRT_DADOS_OPERACIONAIS           WHERE idPessoa = @idPessoa;
      DELETE FROM MC_CED_FILIAL                       WHERE idCedente = @idCedente;
      DELETE FROM MC_CED_OBSERVACAO                   WHERE idCedente = @idCedente;
      DELETE FROM MC_CED_ATA_VOTACAO                  WHERE idCedenteAta in (SELECT id FROM MC_CED_ATA WHERE idCedente = @idCedente);
      DELETE FROM MC_CED_ATA                          WHERE idCedente = @idCedente;
      DELETE FROM MC_LIQ_ORDEM_PAGAMENTO              WHERE idCedente = @idCedente;
      DELETE FROM MC_MOP_MONITORAMENTO_NFE            WHERE idOperacaotitulo in (SELECT id FROM MC_MOP_OPERACAO_TITULO WHERE idSacado = @idSacado);
      DELETE FROM MC_MOP_TITULOS                      WHERE idSacado = @idSacado;
      DELETE FROM MC_MOP_OPERACAO_TITULO              WHERE idSacado = @idSacado;
      DELETE FROM MC_CAD_SACADO                       WHERE idPessoa = @idPessoa;
      DELETE FROM MC_CAD_PESSOA_LIGADA                WHERE idPessoaLigada = @idPessoa;
      DELETE FROM MC_CED_CEDENTE                      WHERE idPessoa = @idPessoa;
      DELETE FROM MC_CAD_PESSOA_LIGADA                WHERE idPessoa=@idPessoa;
      DELETE FROM MC_CAD_PESSOA                       WHERE id=@idPessoa;
    `,
    params: { cnpjCpf }
  })
})

Cypress.Commands.add('limparPropostasPorCnpj', (cnpjCpf) => {
  const sqlBusca = `
    DECLARE @idPessoa INT;
    SET @idPessoa = (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf = @cnpjCpf);
    DECLARE @idProspect INT;
    SET @idProspect = (SELECT id FROM MC_PRT_PROSPECT WHERE idPessoa = @idPessoa);
    SELECT a.idProposta FROM MC_POC_PROSPECT a WHERE a.idProspect = @idProspect;
  `;

  return cy.task('db:exec', { sql: sqlBusca, params: { cnpjCpf } }).then((res) => {
    // Normaliza o retorno
    const result = res?.recordset || res || [];
    if (!Array.isArray(result) || result.length === 0) return;

    for (const row of result) {
      const idProposta = row.idProposta;
      if (!idProposta) continue;

      const sqlDelete = `
        DECLARE @idProposta INT = ${idProposta};
        DECLARE @idComiteProposta INT = (SELECT id FROM MC_POC_COMITE WHERE idProposta = @idProposta);
        DELETE FROM MC_POC_COMITE_LIMITE_BOLETO WHERE idComiteProposta = @idComiteProposta;
        DELETE FROM MC_POC_COMITE_FUNDO WHERE idComiteProposta = @idComiteProposta;
        DELETE FROM MC_POC_COMITE_LIMITE_GLOBAL WHERE idComiteProposta = @idComiteProposta;
        DELETE FROM MC_POC_COMITE_ATA WHERE idComiteProposta = @idComiteProposta;
        DELETE FROM MC_POC_COMITE_VOTACAO WHERE idComiteProposta = @idComiteProposta;
        DELETE FROM MC_POC_COMITE_LIMITE_PRODUTO WHERE idComiteProposta = @idComiteProposta;
        DELETE FROM MC_POC_PROSPECT WHERE idProposta = @idProposta;
        DELETE FROM MC_POC_PLEITO_PRODUTO WHERE idProposta = @idProposta;
        DELETE FROM MC_POC_PLEITO_BOLETO WHERE idProposta = @idProposta;
        DELETE FROM MC_POC_PLEITO WHERE idProposta = @idProposta;
        DELETE FROM MC_POC_COMITE WHERE idProposta = @idProposta;
        DELETE FROM MC_CAD_COMITE_PROPOSTA WHERE idProposta = @idProposta;
        DELETE FROM MC_POC_COMPLIANCE WHERE idProposta = @idProposta;
        DELETE FROM MC_PRT_KYC WHERE idProposta = @idProposta;
        DELETE FROM MC_PRT_PLEITO_PRODUTO WHERE idProposta = @idProposta;
        DELETE FROM MC_PRT_PLEITO WHERE idProposta = @idProposta;
      `;

      cy.task('db:exec', { sql: sqlDelete });
    }
  });
});

// ---------------------------------------------
// Comando: cy.atualizarNomeFantasia(cnpjCpf)
// ---------------------------------------------
Cypress.Commands.add('atualizarNomeFantasia', (cnpjCpf) => {
  return cy.task('db:exec', {
    sql: `
      SET NOCOUNT ON;
      SET XACT_ABORT ON;

      BEGIN TRY
        BEGIN TRAN;

        UPDATE MC_CAD_PESSOA
           SET nomeFantasia = COALESCE(razaoSocial, nome)
         WHERE cnpjCpf = @cnpjCpf;

        COMMIT;
      END TRY
      BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        DECLARE @ErrMsg NVARCHAR(MAX) = ERROR_MESSAGE();
        DECLARE @ErrNum INT = ERROR_NUMBER();
        DECLARE @ErrState INT = ERROR_STATE();
        THROW @ErrNum, @ErrMsg, @ErrState;
      END CATCH;
    `,
    params: { cnpjCpf }
  })
})

// ---------------------------------------------
// Comando: cy.obterIdProposta(cnpjCpf)
// ---------------------------------------------
Cypress.Commands.add('obterIdProposta', (cnpjCpf) => {
  const doc = String(cnpjCpf).replace(/\D/g, '') // só números

  return cy.task('db:exec', {
    sql: `
      SELECT TOP (1) c.idProposta AS id
      FROM MC_CAD_PESSOA a 
      JOIN MC_PRT_PROSPECT b ON a.id = b.idPessoa
      JOIN MC_POC_PROSPECT c ON b.id = c.idProspect
      WHERE a.cnpjCpf = @cnpjCpf
      ORDER BY c.idProposta DESC;
    `,
    params: { cnpjCpf: doc }
  }).then((result) => {
    // suporta tanto result.recordset quanto já vir um array
    const first =
      Array.isArray(result) ? result[0] :
      Array.isArray(result?.recordset) ? result.recordset[0] :
      undefined

    const id = first?.id ?? first?.idProposta // se esquecer do alias
    if (id == null) {
      throw new Error(`Nenhuma proposta encontrada para ${doc}. Retorno: ${JSON.stringify(result)}`);
    }
    return String(id) // string é mais segura para seletor data-*
  })
})

Cypress.Commands.add('obterIdComite', (idProposta) => {
  return cy.task('db:exec', {
    sql: `
      SELECT TOP (1) id
      FROM MC_POC_COMITE
      WHERE idProposta = @idProposta
      ORDER BY id DESC;
    `,
    params: { idProposta }
  }).then((res) => {
    const row = (res.recordset || res)[0]
    return String(row.id)
  })
})



Cypress.Commands.add('votarComiteFavoravelPorCnpj', (cnpjCpf) => {
  const sql = `
      UPDATE v
        SET v.voto = N'FAVORAVEL',
            v.situacaoVoto = N'CONCLUIDO'
      FROM MC_POC_COMITE_VOTACAO v
      WHERE v.idComiteProposta IN (
        SELECT d.id
        FROM MC_CAD_PESSOA a
        JOIN MC_PRT_PROSPECT b ON b.idPessoa = a.id
        CROSS APPLY (
          SELECT TOP (1) c.idProposta
          FROM MC_POC_PROSPECT c
          WHERE c.idProspect = b.id
          ORDER BY c.idProposta DESC
        ) ult
        JOIN MC_POC_COMITE d ON d.idProposta = ult.idProposta
        WHERE a.cnpjCpf = @cnpjCpf
      );
  `
  return cy.task('db:exec', { sql, params: { cnpjCpf } })
})

Cypress.Commands.add('finalizaPocComite', (idProposta) => {
  const sql = `
    UPDATE beyondhml.dbo.MC_POC_COMITE
	  SET situacaoVotacao=N'FINALIZADA'
	  WHERE idProposta=@idProposta;

  `
  return cy.task('db:exec', { sql, params: { idProposta } })
})

Cypress.Commands.add('atualizarSituacaoComite', () => {
  return cy.task('db:exec', {
    sql: `
      UPDATE beyondhml.dbo.MC_CAD_COMITE
      SET idSituacao = 5
      WHERE id <> 376;

      UPDATE beyondhml.dbo.MC_CAD_COMITE
      SET idSituacao = 6
      WHERE id = 376;
    `
  })
})

Cypress.Commands.add('excluirGrupoEconomico', (nomeGrupo) => {
  const sql = `
    DECLARE @idGrupoEconomico INT;
    SET @idGrupoEconomico = (SELECT id FROM MC_CAD_GRUPO_ECONOMICO WHERE descricao = @nomeGrupo);

    UPDATE MC_PRT_PROSPECT SET idGrupoEconomico = NULL WHERE idGrupoEconomico = @idGrupoEconomico;
    DELETE FROM MC_CAD_EMPRESA_GRUPO_ECONOMICO WHERE idGrupoEconomico = @idGrupoEconomico;
    DELETE FROM MC_CAD_GRUPO_ECONOMICO WHERE id = @idGrupoEconomico;
  `

  return cy.task('db:exec', { sql, params: { nomeGrupo } }).then((res) => {
    if (!res) throw new Error(`❌ Falha ao excluir grupo econômico: ${nomeGrupo}`)
    cy.log(`✅ Grupo econômico '${nomeGrupo}' excluído com sucesso`)
  })
})

Cypress.Commands.add('cedenteVencido', (cnpjCpf) => {
  const sql = `
      DECLARE @idPessoa INT;
      SET @idPessoa = (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf = @cnpjCpf);

      UPDATE MC_CED_CEDENTE
	      SET	dataValidadeFinal = GETDATE()-1
      WHERE idPessoa = @idPessoa
  `;
  return cy.task('db:exec', { sql, params: { cnpjCpf } })
})