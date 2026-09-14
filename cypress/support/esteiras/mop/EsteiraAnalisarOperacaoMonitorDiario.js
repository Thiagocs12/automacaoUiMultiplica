const EtapaAnalisarOperacaoMonitorDiario = require('../../etapas/mop/EtapaAnalisarOperacaoMonitorDiario')

class EsteiraAnalisarOperacaoMonitorDiario {
  constructor() {
    this.etapas = [new EtapaAnalisarOperacaoMonitorDiario()]
  }

  executarCompleta() {
    this.etapas.forEach((etapa) => {
      etapa.logar()
      etapa.executar()
      etapa.validar()
    })
  }
}

module.exports = EsteiraAnalisarOperacaoMonitorDiario
