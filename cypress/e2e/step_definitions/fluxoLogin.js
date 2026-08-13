import { Dado, Quando, Então } from '@badeball/cypress-cucumber-preprocessor';

Dado('que o usuário acessa a página de login', () => {
  cy.visit('/login');
  cy.get('[data-testid="login-form"]').should('be.visible');
});

Quando('ele preenche o email {string}', (email) => {
  cy.get('[data-testid="email-input"]').clear().type(email);
});

Quando('ele preenche a senha {string}', (senha) => {
  cy.get('[data-testid="password-input"]').clear().type(senha);
});

Quando('clica no botão de entrar', () => {
  cy.get('[data-testid="login-button"]').click();
});

Então('ele deve ver a mensagem {string}', (mensagem) => {
  cy.get('[data-testid="message"]', { timeout: 5000 }).should('contain', mensagem);
});