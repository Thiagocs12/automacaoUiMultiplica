const { When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const EsteiraCriarProspectPorCnpj = require('../../esteiras/poc/EsteiraCriarProspectPorCnpj')

When('o fluxo de criação de Prospect por CNPJ é executado', () => {
  new EsteiraCriarProspectPorCnpj().executarCompleta()
})

Then('o Prospect criado deve aparecer na listagem de Prospecções', () => {
  // A asserção real (redirecionamento para /monitor + linha com o Agente Comercial usado) já
  // acontece dentro de EtapaCriarProspectPorCnpj.validar(), chamada por executarCompleta() — este
  // step só documenta a expectativa em linguagem de negócio, seguindo o padrão Esteira/Cucumber
  // já usado pelo módulo mop.
})
