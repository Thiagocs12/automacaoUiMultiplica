// ---------------------------------------------
// Comando: cy.cleanupPessoa(cnpjCpf)
// ---------------------------------------------
Cypress.Commands.add('cleanupPessoa', (cnpjCpf) => {
  return cy.task('db:exec', {
    sql: `
      SET NOCOUNT ON;
      SET XACT_ABORT ON;

      BEGIN TRY
        BEGIN TRAN;
        
        DELETE FROM MC_CAD_PESSOA_ENDERECO WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf);
        DELETE FROM MC_CED_FILIAL            WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf);
        DELETE FROM MC_PRT_FILIAL            WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf);
        DELETE FROM MC_CAD_PESSOA_ENDERECO   WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf);
        DELETE FROM MC_CED_FILIAL            WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf);
        DELETE FROM MC_PRT_FILIAL            WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf);
        DELETE FROM MC_PRT_FILIAL            WHERE idProspect IN (SELECT id FROM MC_PRT_PROSPECT WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf));
        DELETE FROM MC_PRT_FORNECEDORES      WHERE idProspect IN (SELECT id FROM MC_PRT_PROSPECT WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf));
        DELETE FROM MC_POC_PROSPECT          WHERE idProspect IN (SELECT id FROM MC_PRT_PROSPECT WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf));

        UPDATE MC_CED_CEDENTE
            SET idProspect = null
        WHERE id in ((SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf)));
        
        DELETE FROM MC_PRT_PROSPECT          WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf);
        DELETE FROM MC_MOP_OPERACAO_CONTA_BANCARIA WHERE idPessoaContaBancaria IN (SELECT id FROM MC_CAD_PESSOA_CONTA_BANCARIA WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf));
        DELETE FROM MC_CAD_PESSOA_CONTA_BANCARIA   WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf);
        DELETE FROM MC_CAD_PESSOA_CONTATO          WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf);
        DELETE FROM MC_CAD_PESSOA_ENTIDADE         WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf);
        DELETE FROM MC_CAD_PESSOA_TELEFONE         WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf);
        DELETE FROM MC_CED_GERENTE_LOG             WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf));
        DELETE FROM MC_MOP_TITULOS_POSICAO         WHERE idTitulo IN (SELECT id FROM MC_MOP_TITULOS WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf)));
        DELETE FROM MC_MOP_TITULOS_COBRANCA        WHERE idTitulo IN (SELECT id FROM MC_MOP_TITULOS WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf)));
        DELETE FROM MC_MOP_TITULOS_LEGADO          WHERE idTitulo IN (SELECT id FROM MC_MOP_TITULOS WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf)));
        DELETE FROM MC_MOP_TITULOS_MOVIMENTO       WHERE idTitulo IN (SELECT id FROM MC_MOP_TITULOS WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf)));
        DELETE FROM MC_MOP_TITULOS_PAGAMENTO       WHERE idTitulo IN (SELECT id FROM MC_MOP_TITULOS WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf)));
        DELETE FROM MC_MOP_TITULOS                 WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf));
        DELETE FROM MC_CED_FUNDO                   WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf));
        DELETE FROM MC_CED_LOCAL_COBRANCA_NN       WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf));
        DELETE FROM MC_CED_GARANTIA_REGRA          WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf));
        DELETE FROM MC_CED_CEDENTE_CONVENIO        WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf));
        DELETE FROM MC_ENT_DOCUMENTO_KIT           WHERE idCedenteGarantia IN (SELECT id FROM MC_CED_GARANTIA WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf)));
        DELETE FROM MC_CED_GARANTIA_ITEM           WHERE idCedenteGarantia IN (SELECT id FROM MC_CED_GARANTIA WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf)));
        DELETE FROM MC_CED_GARANTIA                WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf));
        DELETE FROM MC_MOP_OPERACAO_TITULO_ERRO    WHERE idPreOperacaoTitulo IN (SELECT id FROM MC_MOP_PRE_OPERACAO_TITULO WHERE idPreOperacao IN (SELECT id FROM MC_MOP_PRE_OPERACAO WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf))));
        DELETE FROM MC_MOP_PRE_OPERACAO_TITULO     WHERE idPreOperacao IN (SELECT id FROM MC_MOP_PRE_OPERACAO WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf)));
        DELETE FROM MC_MOP_NOTA_XML_DUPLICATA      WHERE idNotaXml IN (SELECT id FROM MC_MOP_NOTA_XML WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf)));
        DELETE FROM MC_MOP_NOTA_XML                WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf));

        UPDATE MC_MOP_PRE_OPERACAO
           SET idOperacao = NULL
         WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf));

        UPDATE MC_MOP_OPERACAO
           SET idPreOperacao = NULL
         WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf));

        DELETE FROM MC_CAD_ALCADA_PENDENTE_WHATS WHERE idPreOperacao IN (SELECT id FROM MC_MOP_PRE_OPERACAO WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf)));
        DELETE FROM MC_MOP_PRE_OPERACAO           WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf));
        DELETE FROM MC_MOP_OPERACAO_TITULO        WHERE idOperacao IN (SELECT id FROM MC_MOP_OPERACAO WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf)));
        DELETE FROM MC_MOP_OPERACAO               WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf));
        DELETE FROM MC_CED_BOLETO                 WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf));
        DELETE FROM MC_CED_PARAMETRO_OPERACAO     WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf));
        DELETE FROM MC_CED_PRODUTO                WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf));
        DELETE FROM MC_CED_PRODUTO_GARANTIA_REGRA WHERE idCedenteProduto IN (SELECT id FROM MC_CED_PRODUTO WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf)));
        DELETE FROM MC_CED_PRODUTO                WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf));
        DELETE FROM MC_CED_PORTAL_CONVENIO        WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf));
        DELETE FROM MC_PRT_DADOS_OPERACIONAIS     WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf);
        DELETE FROM MC_CED_FILIAL                 WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf));
        DELETE FROM MC_CED_OBSERVACAO             WHERE idCedente IN (SELECT id FROM MC_CED_CEDENTE WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf));
        DELETE FROM MC_CED_CEDENTE                WHERE idPessoa IN (SELECT id FROM MC_CAD_PESSOA WHERE cnpjCpf=@cnpjCpf);
        DELETE FROM MC_CAD_PESSOA                 WHERE cnpjCpf=@cnpjCpf;

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
  const doc = String(cnpjCpf).replace(/\D/g, ''); // só números

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
      undefined;

    const id = first?.id ?? first?.idProposta; // se esquecer do alias
    if (id == null) {
      throw new Error(`Nenhuma proposta encontrada para ${doc}. Retorno: ${JSON.stringify(result)}`);
    }
    return String(id); // string é mais segura para seletor data-*
  });
});


Cypress.Commands.add('votarComiteFavoravelPorCnpj', (cnpjCpf) => {
  const sql = `
    SET XACT_ABORT ON;
    BEGIN TRY
      BEGIN TRAN;

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

      SELECT rows = @@ROWCOUNT;

      COMMIT;
    END TRY
    BEGIN CATCH
      IF XACT_STATE() <> 0 ROLLBACK;
      THROW; -- erro simples, sem mensagem custom
    END CATCH;
  `;
  return cy.task('db:exec', { sql, params: { cnpjCpf } });
});

Cypress.Commands.add('finalizaPocComite', (idProposta) => {
  const sql = `
    UPDATE beyondhml.dbo.MC_POC_COMITE
	  SET situacaoVotacao=N'FINALIZADA'
	  WHERE idProposta=@idProposta;

  `;
  return cy.task('db:exec', { sql, params: { idProposta } });
});

Cypress.Commands.add('atualizarSituacaoComite', () => {
  return cy.task('db:exec', {
    sql: `
      UPDATE beyondhml.dbo.MC_CAD_COMITE
      SET idSituacao = 6
      WHERE id = 376;
    `
  });
});
