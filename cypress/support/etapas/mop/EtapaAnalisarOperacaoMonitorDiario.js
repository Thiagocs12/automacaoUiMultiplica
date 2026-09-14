const EtapaBase = require('../EtapaBase')
const MonitorDiarioPage = require('../../pages/mop/MonitorDiarioPage')
const AnaliseOperacaoPage = require('../../pages/mop/AnaliseOperacaoPage')

class EtapaAnalisarOperacaoMonitorDiario extends EtapaBase {
  constructor() {
    super({ perfil: 'master' })
    this.cedenteCapturado = null
  }

  executar() {
    MonitorDiarioPage.navegarAte()
    MonitorDiarioPage.buscar()

    // A data padrão do Monitor Diário pode não trazer nenhuma operação (ou nenhuma fora de
    // "Inclusão OPE"); nesse caso, amplia a busca para a janela máxima de 29 dias antes de
    // desistir. Busca via `body.find` (em vez de `cy.get` direto) porque não pode falhar quando
    // a tabela ainda não tem nenhuma linha.
    cy.get('body').then(($body) => {
      const linhas = [...$body.find('table.MuiTable-root tbody tr')]
      const temOperacaoElegivel = linhas.some((tr) => {
        const status = tr.querySelector('.mop-MuiChip-label')?.textContent?.trim()
        return status && status !== 'Inclusão OPE'
      })

      if (!temOperacaoElegivel) {
        MonitorDiarioPage.ampliarJanelaBusca()
        MonitorDiarioPage.buscar()
      }
    })

    MonitorDiarioPage.selecionarOperacaoForaDeInclusaoOpe().then((cedente) => {
      this.cedenteCapturado = cedente
    })
  }

  validar() {
    AnaliseOperacaoPage.obterNomeEmpresa().then((nomeEmpresa) => {
      expect(nomeEmpresa).to.equal(this.cedenteCapturado)
    })
  }
}

module.exports = EtapaAnalisarOperacaoMonitorDiario
