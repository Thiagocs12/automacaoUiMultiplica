const EtapaCriarProspectPorCnpj = require('../../etapas/poc/EtapaCriarProspectPorCnpj')

class EsteiraCriarProspectPorCnpj {
  constructor() {
    this.etapas = [new EtapaCriarProspectPorCnpj()]
  }

  executarCompleta() {
    this.etapas.forEach((etapa) => {
      etapa.logar()
      etapa.executar()
      etapa.validar()
    })
  }
}

module.exports = EsteiraCriarProspectPorCnpj
