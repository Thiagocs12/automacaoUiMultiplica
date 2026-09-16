const EtapaBase = require('../EtapaBase')
const NovoProspectPage = require('../../pages/poc/NovoProspectPage')
const MonitorProspectPage = require('../../pages/poc/MonitorProspectPage')

const CNPJ_TESTE = '67.903.430/0001-94'
const AGENTE_COMERCIAL = 'GERENTE AUTOMAÇÃO'

class EtapaCriarProspectPorCnpj extends EtapaBase {
  constructor() {
    super({ perfil: 'master' })
  }

  executar() {
    NovoProspectPage.navegarAte()
    NovoProspectPage.preencherCnpj(CNPJ_TESTE)

    // Achado documentado (docs/documentacao.md): a consulta do CNPJ NÃO preenche os 3 campos
    // obrigatórios automaticamente, ao contrário do esperado. Esta validação acusa o dia em que
    // esse comportamento mudar, em vez de simplesmente seguir preenchendo manualmente sem notar.
    NovoProspectPage.validarCamposNaoPreenchidosAutomaticamentePeloCnpj()

    NovoProspectPage.salvar()
    NovoProspectPage.aguardarCamposObrigatoriosHabilitados()

    NovoProspectPage.selecionarTipoProspect('PROSPECT')
    NovoProspectPage.selecionarAgenteComercial(AGENTE_COMERCIAL)
    NovoProspectPage.selecionarTipoEmpresa('Matriz')

    NovoProspectPage.salvar()
  }

  validar() {
    MonitorProspectPage.estaNaTelaDeListagem()
    MonitorProspectPage.prospectCriadoApareceNaListagem(AGENTE_COMERCIAL)
  }
}

module.exports = EtapaCriarProspectPorCnpj
