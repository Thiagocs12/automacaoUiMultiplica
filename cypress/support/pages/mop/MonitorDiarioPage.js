// Seletores baseados em classes MUI/JSS geradas com o prefixo fixo do módulo ("menu-"/"mop-"),
// estáveis entre execuções (não são hashes aleatórios). Índices numéricos tipo "mop-mop124" são
// evitados de propósito por serem mais frágeis a mudanças de build.
const SELECTORS = {
  drawerComercial: '.menu-MuiDrawer-paper',
  itemDrawerPorTestId: (testId) => `.menu-MuiDrawer-paper .menu-MuiListItem-root:has([data-testid="${testId}"])`,
  dataInicialInput: 'input[type="date"]',
  linhasResultado: 'table.MuiTable-root tbody tr',
}

const JANELA_MAXIMA_DIAS = 29

class MonitorDiarioPage {
  navegarAte() {
    cy.contains('Beyond BackOffice').click()
    cy.wait(2000)
    cy.contains('Comercial').click()
    cy.wait(2000)

    // O drawer do módulo Comercial só mostra ícones; clicar no ícone de "Loop" expande/fixa o
    // menu revelando o texto dos itens (é o que permite localizar "Monitor Diário" com segurança,
    // em vez de depender de posição/índice do ícone). Sem force: um backdrop de transição do MUI
    // cobre o drawer por instantes logo após navegar, e o retry natural do Cypress espera ele sumir.
    cy.get(SELECTORS.itemDrawerPorTestId('LoopIcon')).click()
    // A expansão do drawer é uma transição CSS de largura: aguardar aqui evita clicar em
    // "Monitor Diário" enquanto os itens ainda estão deslizando para a posição final (o que já
    // causou clique acidental em outro item da lista durante a investigação desta tela).
    cy.wait(1500)
    // O `*` é essencial: `cy.contains(SELECTORS.drawerComercial, texto)` sem ele casaria com o
    // próprio container do drawer (que "contém" o texto como descendente, mas não tem onClick),
    // em vez do elemento interno clicável.
    cy.contains(`${SELECTORS.drawerComercial} *`, 'Monitor Diário', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })

    cy.location('pathname', { timeout: 15000 }).should('eq', '/mop/monitor')
    cy.get(SELECTORS.dataInicialInput, { timeout: 30000 }).should('have.length.at.least', 1)
  }

  // Não assume que sempre haverá alguma operação: a data padrão pode não trazer nenhuma linha,
  // caso em que quem chama decide ampliar a janela (ver EtapaAnalisarOperacaoMonitorDiario).
  buscar() {
    cy.contains('button', 'Buscar').click()
    cy.wait(5000)
  }

  ampliarJanelaBusca() {
    // Input de data é controlado por React: setar via .val() do jQuery não dispara o onChange —
    // precisa do setter nativo do protótipo antes do dispatchEvent.
    cy.get(SELECTORS.dataInicialInput).eq(0).then(($el) => {
      const input = $el[0]
      const dataFinal = new Date(input.value)
      const dataInicial = new Date(dataFinal)
      dataInicial.setDate(dataInicial.getDate() - (JANELA_MAXIMA_DIAS - 1))

      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
      nativeSetter.call(input, dataInicial.toISOString().slice(0, 10))
      input.dispatchEvent(new Event('input', { bubbles: true }))
      input.dispatchEvent(new Event('change', { bubbles: true }))
    })
  }

  // Localiza, na listagem já carregada, uma operação fora do status "Inclusão OPE" (preferindo
  // uma "Middle") e retorna o nome do cedente capturado ANTES de abrir a operação — precisa ser
  // lido aqui porque a operação escolhida varia a cada execução (dado real de HML).
  selecionarOperacaoForaDeInclusaoOpe() {
    return cy.get(SELECTORS.linhasResultado, { timeout: 15000 }).should('have.length.at.least', 1).then(($rows) => {
      const rows = [...$rows]
      const statusDaLinha = (tr) => tr.querySelector('.mop-MuiChip-label')?.textContent?.trim()

      const candidata =
        rows.find((tr) => statusDaLinha(tr) === 'Middle') ||
        rows.find((tr) => statusDaLinha(tr) && statusDaLinha(tr) !== 'Inclusão OPE')

      if (!candidata) {
        throw new Error(
          'Nenhuma operação fora do status "Inclusão OPE" encontrada na janela de busca do Monitor Diário'
        )
      }

      const cedente = candidata.querySelectorAll('td')[3].textContent.trim()

      cy.wrap(candidata).scrollIntoView()
      cy.wrap(candidata).find('button').last().click()
      cy.contains('Analisar Operação').click()

      return cy.wrap(cedente)
    })
  }
}

module.exports = new MonitorDiarioPage()
