// Criar prospect
Cypress.Commands.add('criarProspect', (cnpj, tipoProspect, nova = true) => {
  cy.contains('Novo Prospect').click()
  cy.aguardarRequisicao('GET', '/mc-pessoas-ms/api/v1/pessoa/findPessoaJuridicaNotRegister', '.MuiOutlinedInput-input', 'type', 0, cnpj)
  if (nova){
    cy.get('#mui-component-select-tipoProspect').click()//#campo tipo prospect criação da POC
    cy.get('body').then(($body) => {
    if ($body.find('[role="option"]:contains("' + tipoProspect + '")').is(':visible')) {
      cy.get('[role="option"]').contains(tipoProspect).click();
    } else {
      cy.get('#mui-component-select-tipoProspect').click();
      cy.get('[role="option"]').contains(tipoProspect).click();
    }
    });
    cy.get('.prospeccao-MuiInputBase-root').type('Gerente Automa')//#campo gerente Criação da POC
    cy.get('[role="option"]').contains('GERENTE AUTOMAÇÃO').click()
  }
  cy.wait(500)
  cy.contains('Salvar').click()
})

//Preenche o limite global do pleito
Cypress.Commands.add('preencherPleitoLimiteGlobal', (limite) => {
  cy.get('#main-menu-body > section > div > main > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(1) > div > div > button')//#Mais infos da POC ex: pleito ...
    .trigger('mouseover')
  cy.get('[title="Pleito/Produto"]').click()
  cy.get('[name="limiteGlobal"]').clear().type(limite)
  cy.tikGet('.MuiButton-root')
})

// Aprovação do prospect no comite de crédito
Cypress.Commands.add('aprovarProspectComite', () => {
  cy.wait(1000)
  cy.contains('Votação').click()
  cy.contains('Portal Beyond').click()
  cy.contains('Portal Terceiros').click()
  cy.tikCon('Salvar')
  cy.get('body').then(($body) => {
    if ($body.text().includes('Data da emissão da ata diferente do dia atual, deseja continuar?')) {
      cy.tikGet('.prospeccao-MuiButton-contained > .prospeccao-MuiButton-label')
    }
  })
  cy.get(':nth-child(3) > .prospeccao-MuiBox-root > .prospeccao-MuiButtonBase-root').click() //# Botão enviar votação
  cy.get('input.PrivateSwitchBase-input.css-1m9pwf3').check({ force: true }) //# selecionar todos votantes
  cy.contains('Enviar').click()
})

Cypress.Commands.add('aguardarRequisicao', (method, endpoint, elemento = null, acao = 'click', eq = 0, texto) => {
  cy.intercept(method, `**${endpoint}*`).as('interceptedRequest')
  if(elemento !== null){
    if (acao === 'click') {
      cy.get(elemento).eq(eq).click()
    } else if (acao === 'realClick') {
      cy.get(elemento).eq(eq).realClick()
    } else if (acao === 'type') {
      cy.get(elemento).eq(eq).type(texto)
    }}
  cy.realPress('Tab')
  cy.wait('@interceptedRequest', { timeout: 30000 }).its('response.statusCode').should('eq', 200)
  cy.log('Requisição realizada com sucesso')
})

Cypress.Commands.add('avancarComite', () => {
  cy.contains('Avançar').click()
  cy.get('[name="aprovar"] > .prospeccao-MuiButton-label').click()
})

Cypress.Commands.add('habilitarFundo', (quantidade) => {
  cy.get('#main-menu-body div:nth-child(16) > button:nth-child(2)').click()
  cy.contains('Parâmetros Operação').click()
  cy.contains('Fundos').click()
  Cypress._.times(quantidade, (i) => {
    cy.get('.prospeccao-MuiTableCell-alignCenter > .prospeccao-MuiBox-root > :nth-child(1)').eq(i).click()
    cy.contains('Administradora habilitada').click()
    cy.contains('Gestora habilitada').click()
    cy.get('.prospeccao-MuiButton-label').eq(2).realClick()//# botão salvar edição fundo
    cy.get('body').then(($body) => {
      if ($body.text().includes('Atualizar valores globais')) {
        cy.tikCon('Confirmar')
      }
    })
  })
})

Cypress.Commands.add('adicionarContaBancaria', (dadosConta, nova = true) => {
  if (nova) {
    cy.get('#main-menu-body section > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > div > div > div:nth-child(12) > button:nth-child(2)').click() //#avançar paginação prospect
  }
  cy.get('#main-menu-body section > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > div > div > div:nth-child(12) > button:nth-child(2)').click() //#avançar paginação prospect
  cy.contains('Contas Bancárias').click()
  cy.get('.prospeccao-MuiGrid-root > .prospeccao-MuiButtonBase-root').click()
  cy.wait(1000)
  cy.get('#main-menu-body section > div > main > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(1) > button').click() //#adicionarContaBancaria
  cy.get('#main-menu-body section > div > main > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(1) > div > div > div > input').type(dadosConta.banco)
  cy.contains('li.prospeccao-MuiAutocomplete-option', dadosConta.banco).click()
  cy.get('#nroAgencia').type(dadosConta.agencia)
  cy.get('#nroConta').type(dadosConta.conta)
  cy.get('#dvConta').type(dadosConta.digito)
  cy.get('#nomeContato').type(dadosConta.nomeContato)
  cy.get('#emailContato').type(dadosConta.emailContato)
  cy.get('[title="Open"]').eq(1).click()
  cy.contains('li.prospeccao-MuiAutocomplete-option', dadosConta.ddi).click()
  cy.get('[title="Open"]').eq(2).click()
  cy.contains('li.prospeccao-MuiAutocomplete-option', dadosConta.ddd).click()
  cy.get('#main-menu-body section > div > main > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(2) > form > div:nth-child(1) > div:nth-child(11) > div > input').type(dadosConta.telefone)
  cy.get('#mui-component-select-tipoClassificacaoConta').click()
  cy.contains(dadosConta.tipoConta).click()
  cy.tikCon('Salvar')
})

Cypress.Commands.add('adicionarContato', (contato) => {
  cy.wait(2000)
  cy.get('.prospeccao-MuiGrid-root > .prospeccao-MuiButtonBase-root').last().click()
  cy.get('[name="nome"]').type(contato.nome)
  cy.get('[name="email"]').last().type(contato.email)
  cy.get('[title="Open"]').eq(-2).click()
  cy.contains('li.prospeccao-MuiAutocomplete-option', contato.ddi).click()
  cy.get('[title="Open"]').eq(-1).click()
  cy.contains('li.prospeccao-MuiAutocomplete-option', contato.ddd).click()
  cy.get('.prospeccao-MuiInputBase-root > .prospeccao-MuiInputBase-input').eq(-4).type(contato.telefone)
  cy.get('#mui-component-select-tipoTelefone').click()
  cy.get('[data-value="Celular"]').click()
  cy.get('.prospeccao-MuiButton-contained > .prospeccao-MuiButton-label').last().click()
})

Cypress.Commands.add('adicionarTelefone', (telefones) => {
  const keys = Object.keys(telefones)
  keys.forEach((nome, i) => {
    const telefone = telefones[nome]
    const index = -2 - (i * 2) // 1º = -2, 2º = -4, 3º = -6...
    cy.wait(1000)
    cy.get('.prospeccao-MuiGrid-root > .prospeccao-MuiButtonBase-root').eq(index).click()
    cy.get('[title="Open"]').eq(3).click()
    cy.contains('li.prospeccao-MuiAutocomplete-option', telefone.ddi).click()
    cy.get('[title="Open"]').eq(-1).click()
    cy.contains('li.prospeccao-MuiAutocomplete-option', telefone.ddd).click()
    cy.get('.prospeccao-MuiInputBase-root > .prospeccao-MuiInputBase-input').eq(-3).type(telefone.telefone)
    cy.get('#mui-component-select-tipoTelefone').click()
    cy.contains('Celular').last().click()
    cy.get('.prospeccao-MuiButton-contained > .prospeccao-MuiButton-label').last().click()
  })
})

Cypress.Commands.add('adicionarSocio', (socio) => {
  cy.contains('Sócios').click()
  cy.wait(1000)
  cy.get('.prospeccao-MuiGrid-root > .prospeccao-MuiButtonBase-root').click()//#botão adicionar socio
  cy.get('#outlined-adornment-password').type(socio.cpf)
  cy.realPress('Tab')
  cy.get('[aria-label="toggle password visibility"]').click()//#botão pesquisar cnpj/cpf socio
  cy.get('#mui-component-select-tipoAssinatura').click()
  cy.contains(socio.tipoAssinatura).click()
  cy.contains('Salvar').click()
})

Cypress.Commands.add('adicionarPessoaligadaVontante', () => {
  cy.contains('Pessoas Ligadas').click()
  cy.get('.prospeccao-MuiGrid-direction-xs-column > :nth-child(1)').click()//#botao editar pessoa ligada
  cy.get(':nth-child(26) > .prospeccao-MuiFormControl-root > .prospeccao-MuiInputBase-root > #select').click()//#tipo assinatura pessoa ligada
  cy.contains('Individual').click()
  cy.contains('Assina Contrato Matriz').click()
  cy.contains('Salvar').click()
})

Cypress.Commands.add('ajustesRenovacao', (pleito) => {
  cy.adicionarPessoaligadaVontante()
  cy.preencherPleitoLimiteGlobal(pleito)
  cy.get('[title="Excluir"]').eq(2).click()
  cy.contains('Confirmar').click()
  //cy.contains('CCB/NC').should('not.exist')
  cy.get('#main-menu-body section > div > main > div > div:nth-child(2) > div:nth-child(1) > div > div:nth-child(6) > div > div:nth-child(2) > div > table > tbody > tr:nth-child(2) > td:nth-child(4) > div > button').click() //#botão delete fundo
  cy.contains('Confirmar').click()
})

Cypress.Commands.add('aprovarComite', (cnpj) => {
  //cy.wait(2000)
  cy.contains('Votação').click()
  cy.aprovarProspectComite()
  cy.verificarLocal('Votação iniciada com sucesso')
  cy.votarComiteFavoravelPorCnpj(cnpj)
  cy.obterIdProposta(cnpj).then((idProposta) => {
    cy.finalizaPocComite(idProposta)
  })
  cy.contains('span', 'Votação').click()
  cy.aguardarRequisicao('POST', '/mc-poc-ms/api/v1/pocVotacao/generateAtaComitetext', '#ata')
  })

Cypress.Commands.add('urlFor', (app, path = '/') => {
  return urlFor(app, path)
})

Cypress.Commands.add('distribuirPropostaComite', (selOrigemHandle, selDestino) => {
  const center = ($el) => {
  const r = $el[0].getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  }

  const getDroppable = ($el) => {
  const droppable = $el.closest('[data-rbd-droppable-id]')
  if (droppable && droppable.length) return droppable
  return $el.is('[data-rbd-droppable-id]') ? $el : $el
  }

  // garanta destino visível e guarde como @droppable
  cy.get(selDestino, { timeout: 60000 })
  .scrollIntoView()
  .should('be.visible')
  .then(($qualquer) => getDroppable($qualquer))
  .then(($droppable) => cy.wrap($droppable).as('droppable'))

  // arraste a partir do handle de origem
  cy.get(selOrigemHandle, { timeout: 60000 })
  .scrollIntoView()
  .should('be.visible')
  .then(($src) => {
    const start = center($src)
    cy.get('body').realMouseMove(start.x, start.y)
    cy.wrap($src).realMouseDown({ button: 'left' })
    cy.get('body').realMouseMove(start.x + 8, start.y + 8, { position: 'topLeft' })
  })

  // solte no droppable
  cy.get('@droppable').then(($tgt) => {
  const end = center($tgt)
  cy.get('body').realMouseMove(end.x, end.y)
  cy.wrap($tgt).realMouseUp({ button: 'left' })
  })
})