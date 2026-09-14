const { When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const EsteiraAnalisarOperacaoMonitorDiario = require('../../esteiras/mop/EsteiraAnalisarOperacaoMonitorDiario')

When('o fluxo de análise de operação pelo Monitor Diário é executado', () => {
  new EsteiraAnalisarOperacaoMonitorDiario().executarCompleta()
})

Then('a tela de análise deve exibir o mesmo cedente capturado no Monitor Diário', () => {
  // A asserção real (comparação do nome da empresa) já acontece dentro de
  // EtapaAnalisarOperacaoMonitorDiario.validar(), chamada por executarCompleta() — este step só
  // documenta a expectativa em linguagem de negócio, seguindo o padrão Esteira/Cucumber do
  // repositório (o Cucumber não orquestra nem valida sozinho).
})
