const kcOrigin = Cypress.env('BASE_URL_KEYCLOAK')
const getApps = Cypress.env('apps')

// Comando customizado para login bem-sucedido via Keycloak
Cypress.Commands.add('loginKeycloak', (usuario, senha, plataforma = 'backoffice') => {
  cy.goTo(plataforma, '/')
  cy.origin(kcOrigin, { args: { usuario, senha } }, ({ usuario, senha }) => {
    cy.get('#username').clear().type(usuario)
    cy.get('#password').clear().type(senha, { log: false })
    cy.get('form').submit()
  })
  // Verifica se retornou para o domínio da aplicação
  const expectedOrigin = new URL(getApps[plataforma]).origin
  cy.location('origin', { timeout: 60000 }).should('eq', expectedOrigin)
})

// Comando customizado para login com erro via Keycloak
Cypress.Commands.add('loginKeycloakError', (usuario, senha, plataforma = 'backoffice') => {
  cy.goTo(plataforma, '/')
  cy.origin(kcOrigin, { args: { usuario, senha } }, ({ usuario, senha }) => {
    cy.get('#username').clear().type(usuario)
    cy.get('#password').clear().type(senha, { log: false })
    cy.get('form').submit()
    cy.contains('Usuário ou senha inválidos').should('be.visible')
  })
})

// Comando customizado para acessar algum menu aplicação
Cypress.Commands.add('menu', (modulo, area, entidade, home = 'Home') => {
  cy.contains(modulo).click()
  cy.contains(area).click()
  cy.contains(home).trigger('mouseover')
  if (area !== 'Compliance') {  
    cy.contains(entidade).click()
  }
})

// Acessar a entidade no monitor
Cypress.Commands.add('buscarEntidadeMonitor', (cnpj, tela, acao = null, entidade = 'Prospect') => {  
  cy.contains(tela).click()

  if (entidade === 'Operação') {
    cy.get('.mop-mop6 > .mop-MuiInputBase-root > .mop-MuiInputBase-input').type(cnpj)
    cy.dataMonitorDiario()
  } else if (entidade === 'Prospect') {
    cy.get('[name="cnpj"]').type(cnpj)
  }

  cy.contains('Buscar').click()
  if (acao !== null && acao !== undefined) {
    if (acao === 'Realizar POC') {
      cy.get('.MuiTableCell-alignCenter > .MuiButtonBase-root').first().click()
      cy.acessarEntidadeNaTela(acao, entidade)
    } else {
      cy.acessarEntidadeNaTela(acao, entidade)
    }
  }
})

//Acessa o entidade pesquisado no monitor
Cypress.Commands.add('acessarEntidadeNaTela', (acao, entidade = 'Prospect') => {
  if (acao === 'Votar'){
    cy.wait(1000)
    cy.get(':nth-child(5) > .MuiPaper-root > .MuiTableContainer-root > .MuiTable-root > .MuiTableBody-root > .MuiTableRow-root > .MuiTableCell-alignCenter > .MuiButtonBase-root').click() //# botão + expandir comites
  }
  if (entidade === 'Operação') {
    cy.get('.mop-MuiIconButton-label > .mop-MuiSvgIcon-root').first().click()//#Ações da entidade no monitor operação
  } else if (entidade === 'Prospect') {
    cy.get('.prospeccao-MuiIconButton-label > .prospeccao-MuiSvgIcon-root').first().click()//#Ações da entidade no monitor prospect
  }
  cy.contains(acao).click()  
})

// Avança a esteira aberta na tela
Cypress.Commands.add('avancarEsteira', (parecer = null, botao = 'Avançar', entidade = 'Prospect') => {
  if (parecer !== null && parecer !== undefined) {
    if (entidade === 'Operação') {
      cy.wait(500)
      cy.get('[aria-label="Parecer"]').click()
      cy.get('.mop-MuiGrid-root > .mop-MuiButtonBase-root').click()//#Botão adicionar parecer operação
      cy.get('[name="parecer"]').type(parecer)
    } else if (entidade === 'Prospect') {
      cy.wait(500)
      cy.get('[title="Parecer"]').click()
      cy.get('.prospeccao-MuiGrid-root > .prospeccao-MuiButtonBase-root').click()//#Botão adicionar parecer prospect
      cy.get('[name="parecer"]').type(parecer)
    } else if (entidade === 'ORP') {
      cy.wait(500)
      cy.get('[aria-label="Parecer"]').click()
      cy.get('.MuiGrid-root > .MuiButtonBase-root').click()
      cy.get('[placeholder="Parecer"]').type(parecer)
    }
    cy.contains('Salvar').click()
    cy.tikCon('Confirmar')
  }
  if (botao !== 'Administradora') {
    cy.wait(500)
    cy.contains(botao).click()
    cy.contains('Confirmar').click()
    cy.get('body').then(($body) => {
      if ($body.text().includes('Não foi possível avançar esta proposta')) {
        cy.wait(500)
        cy.contains(botao).click()
        cy.contains('Confirmar').click()
      }
    })
  }
})

// support/commands.js
Cypress.Commands.add('tikGet', (elemento, tempo = 500000) => {
  cy.clock()
  cy.get(elemento).click()
  cy.wait(600)
  cy.tick(tempo)
  cy.clock().then((clock) => {
    clock.restore()
  })
})

Cypress.Commands.add('tikCon', (elemento, tempo = 500000) => {
  cy.clock()
  cy.contains(elemento).click()
  cy.wait(600)
  cy.tick(tempo)
  cy.clock().then((clock) => {
    clock.restore()
  })
})

Cypress.Commands.add('verificarLocal', (local = 'Buscar') => {
  cy.contains(local).should('be.visible')
})

const { urlFor } = require('./helpers')

Cypress.Commands.add('goTo', (app, path = '/') => {
  cy.visit(urlFor(app, path))
})

Cypress.Commands.add('armazenarKCTokenEmEnv', () => {
  cy.intercept(
  {
    method: 'POST',
    url: '**/protocol/openid-connect/token',
    middleware: true,
  },
  (req) => {
    req.continue((res) => {
    try {
      const body = typeof res.body === 'string' ? JSON.parse(res.body) : res.body
      const token = body?.access_token
      if (token) {
      Cypress.env('token', token)
      Cypress.log({ name: 'KC Token', message: 'access_token salvo em Cypress.env("token")' })
      }
    } catch (e) {
      Cypress.log({ name: 'KC Token', message: `falha ao ler token: ${e.message}` })
    }
    })
  }
  ).as('kcToken')
})

Cypress.Commands.add('finalizarEtapaEsteira', (situacao = 'APROVADO') => {
  const idEsteira = Cypress.env('idEsteira')
  const idEtapa = Cypress.env('idEtapa')
  const idParecer = Cypress.env('idOcorrencia') 

  return cy.request({
    method: 'POST',
    url: `${Cypress.env('BASE_URL_MULTIFLOW')}/api/v1/esteira/finalizarEtapa`,
    headers: {
      Authorization: `Bearer ${Cypress.env('token')}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: {
      idEsteira,
      idEtapa,
      idParecer,
      situacao
    }
  }).then((response) => {
    expect(response.status).to.eq(200)

    return cy.wrap(response.body)
  })
})

Cypress.Commands.add('capturarIdsParecer', () => {
  cy.intercept('POST', '**/mc-multiflow-ms/api/v1/ocorrencia/parecer*').as('parecerReq')
})

Cypress.Commands.add('aguardarParecer', () => {
  cy.wait('@parecerReq', { timeout: 20000 }).then(({ response }) => {
    const { id, idEtapa, idEsteira } = response.body

    Cypress.env('idOcorrencia', id)
    Cypress.env('idEtapa', idEtapa)
    Cypress.env('idEsteira', idEsteira)
  })
})

Cypress.Commands.add('aprovarAlcada', (parecer) => {
  cy.get('[name="votar"]').type(parecer)
  cy.get('[name="aprovar"] > .mop-MuiButton-label').click()//# botao aprovar alcada
  cy.contains('button', 'Confirmar').click()
})
