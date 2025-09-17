// Define a origem do Keycloak a partir das variáveis de ambiente
const kcOrigin = Cypress.env('BASE_URL_KEYCLOAK');

// Comando customizado para login bem-sucedido via Keycloak
Cypress.Commands.add('loginKeycloak', (usuario, senha) => {
  // Garante que está na aplicação antes de trocar de domínio
  cy.visit('/');
  // Executa o fluxo de login no domínio do Keycloak
  cy.origin(kcOrigin, { args: { usuario, senha } }, ({ usuario, senha }) => {
      cy.get('#username').clear().type(usuario);
      cy.get('#password').clear().type(senha, { log: false });
      cy.get('form').submit();
    }
  );
  // Verifica se retornou para o domínio da aplicação
  cy.location('origin', { timeout: 60000 }).should('eq', Cypress.config('baseUrl'));
});

// Comando customizado para login com erro via Keycloak
Cypress.Commands.add('loginKeycloakError', (usuario, senha) => {
  cy.visit('/');
  cy.origin(kcOrigin, { args: { usuario, senha } }, ({ usuario, senha }) => {
      cy.get('#username').clear().type(usuario);
      cy.get('#password').clear().type(senha, { log: false });
      cy.get('form').submit();
      // Valida que a mensagem de erro aparece
      cy.contains('Usuário ou senha inválidos').should('be.visible')
  });
});

// Comando customizado para acessar algum menu aplicação
Cypress.Commands.add('menu', (modulo, area, entidade) => {
  cy.contains(modulo).click();
  cy.contains(area).click();
  cy.contains('Home').trigger('mouseover');
  if (area !== 'Compliance') {
    cy.contains(entidade).click();
  }
});

// Avança a esteira aberta na tela
Cypress.Commands.add('avancarEsteira', (parecer) => {
  cy.get('[title="Parecer"]').click()
  cy.get('.prospeccao-MuiGrid-root > .prospeccao-MuiButtonBase-root').click()//#Botão adicionar parecer
  cy.get('[name="parecer"]').type(parecer)
  cy.contains('Salvar').click()
  cy.contains('Confirmar').click()
  cy.contains('Avançar').click()
  cy.contains('Confirmar').click()
})

