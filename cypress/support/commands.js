// Define a origem do Keycloak a partir das variáveis de ambiente
const kcOrigin = Cypress.env('BASE_URL_KEYCLOAK')
const getApps = Cypress.env('apps')

// Comando customizado para login bem-sucedido via Keycloak
Cypress.Commands.add('loginKeycloak', (usuario, senha, plataforma = 'backoffice') => {
  // Garante que está na aplicação antes de trocar de domínio
  cy.goTo(plataforma, '/')
  // Executa o fluxo de login no domínio do Keycloak
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
    // Valida que a mensagem de erro aparece
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
  cy.wait(1000)
  
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
  cy.get(':nth-child(5) > .MuiPaper-root > .MuiTableContainer-root > .MuiTable-root > .MuiTableBody-root > .MuiTableRow-root > .MuiTableCell-alignCenter > .MuiButtonBase-root').click() //# botão + expandir comites
  }
  if (entidade === 'Operação') {
  cy.get('.mop-MuiIconButton-label > .mop-MuiSvgIcon-root').first().click()//#Ações da entidade no monitor operação
  } else if (entidade === 'Prospect') {
  cy.get('.prospeccao-MuiIconButton-label > .prospeccao-MuiSvgIcon-root').click()//#Ações da entidade no monitor prospect
  }
  cy.contains(acao).click()  
})

// Avança a esteira aberta na tela
Cypress.Commands.add('avancarEsteira', (parecer = null, botao = 'Avançar', entidade = 'Prospect') => {
  if (parecer !== null && parecer !== undefined) {
    if (entidade === 'Operação') {
      cy.get('[aria-label="Parecer"]').click()
      cy.get('.mop-MuiGrid-root > .mop-MuiButtonBase-root').click()//#Botão adicionar parecer operação
    } else if (entidade === 'Prospect') {
      cy.get('[title="Parecer"]').click()
      cy.get('.prospeccao-MuiGrid-root > .prospeccao-MuiButtonBase-root').click()//#Botão adicionar parecer prospect
    }
    cy.wait(1000)
    cy.get('[name="parecer"]').type(parecer)
    cy.contains('Salvar').click()
    cy.contains('Confirmar').click()
  }
  if (botao !== 'Administradora') {
    cy.wait(500)
    cy.contains(botao).click()
    cy.contains('Confirmar').click()
  }
})

Cypress.Commands.add('verificarLocal', (local = 'Buscar') => {
  cy.contains(local).should('be.visible')
  cy.wait(500)
})

const { urlFor } = require('./helpers')

Cypress.Commands.add('goTo', (app, path = '/') => {
  cy.visit(urlFor(app, path))
})

// Dica: este comando **rende** uma string (via yield), então use com .then(...)
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

// cypress/support/commands.js
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
