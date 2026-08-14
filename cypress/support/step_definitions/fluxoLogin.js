import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { getApiConfig } from '../../support/envHelper'

const apiConfig = getApiConfig()

Given('que o usuário acessa a página de login', () => {
  cy.visit(`${apiConfig.baseUrl}`)
})

When('ele preenche o email {string}', (email) => {
})

When('ele preenche a senha {string}', (senha) => {
})

When('clica no botão de entrar', () => {
})

Then('ele deve ver a mensagem {string}', (mensagem) => {
})