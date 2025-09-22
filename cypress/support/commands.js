// Define a origem do Keycloak a partir das variáveis de ambiente
const kcOrigin = Cypress.env('BASE_URL_KEYCLOAK');
const getApps = Cypress.env('apps');

// Comando customizado para login bem-sucedido via Keycloak
Cypress.Commands.add('loginKeycloak', (usuario, senha, plataforma = 'backoffice') => {
    // Garante que está na aplicação antes de trocar de domínio
    cy.goTo(plataforma, '/');
    // Executa o fluxo de login no domínio do Keycloak
    cy.origin(kcOrigin, { args: { usuario, senha } }, ({ usuario, senha }) => {
        cy.get('#username').clear().type(usuario);
        cy.get('#password').clear().type(senha, { log: false });
        cy.get('form').submit();
    });
    // Verifica se retornou para o domínio da aplicação
    const expectedOrigin = new URL(getApps[plataforma]).origin;
    cy.location('origin', { timeout: 60000 }).should('eq', expectedOrigin);
});

// Comando customizado para login com erro via Keycloak
Cypress.Commands.add('loginKeycloakError', (usuario, senha, plataforma = 'backoffice') => {
    cy.goTo(plataforma, '/');
    cy.origin(kcOrigin, { args: { usuario, senha } }, ({ usuario, senha }) => {
        cy.get('#username').clear().type(usuario);
        cy.get('#password').clear().type(senha, { log: false });
        cy.get('form').submit();
        // Valida que a mensagem de erro aparece
        cy.contains('Usuário ou senha inválidos').should('be.visible');
    });
});

// Comando customizado para acessar algum menu aplicação
Cypress.Commands.add('menu', (modulo, area, entidade, home = 'Home') => {
    cy.contains(modulo).click();
    cy.contains(area).click();
    cy.contains(home).trigger('mouseover');
    if (area !== 'Compliance') {
        cy.contains(entidade).click();
    }
});

// Avança a esteira aberta na tela
Cypress.Commands.add('avancarEsteira', (parecer) => {
    cy.get('[title="Parecer"]').click();
    cy.get('.prospeccao-MuiGrid-root > .prospeccao-MuiButtonBase-root').click(); //#Botão adicionar parecer
    cy.wait(500);
    cy.get('[name="parecer"]').type(parecer);
    cy.contains('Salvar').click();
    cy.contains('Confirmar').click();
    cy.contains('Avançar').click();
    cy.contains('Confirmar').click();
});

Cypress.Commands.add('verificarLocal', (local = 'Buscar') => {
    //cy.scrollTo(0, 0);
    cy.contains(local).should('be.visible');
    cy.wait(500);
});

const { urlFor } = require('./helpers');

Cypress.Commands.add('goTo', (app, path = '/') => {
    cy.visit(urlFor(app, path));
});

// Dica: este comando **rende** uma string (via yield), então use com .then(...)
Cypress.Commands.add('urlFor', (app, path = '/') => {
    return urlFor(app, path);
});

// Com cypress-real-events instalado
Cypress.Commands.add('distribuirPropostaComite', (selOrigemHandle, selDestinoQualquer) => {
  const center = ($el) => {
    const r = $el[0].getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  const getDroppable = ($el) => {
    // Sobe na árvore até achar o droppable
    const droppable = $el.closest('[data-rbd-droppable-id]');
    if (droppable && droppable.length) return droppable;
    // fallback: se o seletor já é o próprio droppable
    return $el.is('[data-rbd-droppable-id]') ? $el : $el;
  };

  // Garante que o destino está visível na tela
  cy.get(selDestinoQualquer, { timeout: 10000 })
    .scrollIntoView()
    .should('be.visible')
    .then(($qualquer) => getDroppable($qualquer))
    .then(($droppable) => {
      cy.wrap($droppable).as('droppable');
    });

  // Lifte do drag no HANDLE correto
  cy.get(selOrigemHandle, { timeout: 10000 })
    .scrollIntoView()
    .should('be.visible')
    .then(($src) => {
      const start = center($src);
      // move o mouse até o handle e pressiona (botão esquerdo)
      cy.get('body').realMouseMove(start.x, start.y);
      cy.wrap($src).realMouseDown({ button: 'left' });
      // pequeno “jitter” para o RBD reconhecer o drag
      cy.get('body').realMouseMove(start.x + 8, start.y + 8, { position: 'topLeft' });
    });

  // Arrasta até o CENTRO do DROPPABLE e solta lá
  cy.get('@droppable').then(($tgt) => {
    const end = center($tgt);
    cy.get('body').realMouseMove(end.x, end.y);        // mouse sobre o droppable
    cy.wrap($tgt).realMouseUp({ button: 'left' });     // solta no droppable (não no body)
  });

  // Validação opcional: o item agora deve estar dentro do droppable
  // cy.get('@droppable').find(selOrigemHandle).should('exist');
});
