// Seletores levantados ao vivo em HML (2026-09-15). Os dois campos "Tipo de Prospect"/"Agente
// Comercial" são MUI Autocomplete (input com id dinâmico tipo "mui-46697" — não usar o id, andar
// via label -> [role="combobox"] ancestral -> input). "Tipo Empresa" é um MUI Select com id
// estável derivado do `name` do campo ("mui-component-select-tipoEmpresa"), esse sim seguro de
// usar diretamente.
const SELECTORS = {
  cnpjInput: 'input[placeholder="CPF/CNPJ do Prospect"]',
  botaoSalvar: 'button',
  tipoEmpresaSelect: '#mui-component-select-tipoEmpresa',
  tipoEmpresaHiddenInput: 'input[name="tipoEmpresa"]',
  opcaoMenu: '[role="listbox"] li, .MuiAutocomplete-listbox li, .MuiMenu-list li',
}

function inputDoAutocomplete(labelTexto) {
  return cy.contains('label', labelTexto).parents('[role="combobox"]').first().find('input')
}

class NovoProspectPage {
  navegarAte() {
    // Mesmo caminho já mapeado pelo módulo mop (Beyond BackOffice -> Comercial -> drawer só com
    // ícones, expandido via LoopIcon) — reaproveitado aqui sem redescoberta.
    cy.contains('Beyond BackOffice').click()
    cy.wait(2000)
    cy.contains('Comercial').click()
    cy.wait(2000)
    cy.get('.menu-MuiDrawer-paper .menu-MuiListItem-root:has([data-testid="LoopIcon"])').click()
    cy.wait(1500)
    cy.contains('.menu-MuiDrawer-paper *', 'Prospect', { timeout: 10000 }).should('be.visible').click({ force: true })
    cy.wait(1500)
    cy.contains('.menu-MuiDrawer-paper *', 'Novo Prospect', { timeout: 10000 }).should('be.visible').click({ force: true })

    cy.location('pathname', { timeout: 15000 }).should('eq', '/prospeccao/form')
    // O app (single-spa, parcel "prospeccao") demora para montar o formulário depois da URL mudar;
    // aguardar o campo de CNPJ ficar visível em vez de um cy.wait fixo evita número mágico.
    cy.get(SELECTORS.cnpjInput, { timeout: 20000 }).should('be.visible')
  }

  preencherCnpj(cnpj) {
    cy.get(SELECTORS.cnpjInput).type(cnpj)
    // Não há um indicador de loading conhecido para a consulta do CNPJ; aguardar um tempo fixo
    // (mesmo valor usado durante a investigação) antes de inspecionar o resultado da consulta.
    cy.wait(8000)
  }

  // Achado bloqueante (ver docs/documentacao.md): a consulta do CNPJ NÃO preenche automaticamente
  // "Tipo de Prospect", "Agente Comercial" nem "Tipo Empresa" — os 3 continuam vazios/desabilitados
  // até uma tentativa de salvar. Esta validação existe para acusar o dia em que esse comportamento
  // for corrigido (deixaria de vir vazio) em vez de simplesmente seguir preenchendo manualmente sem
  // notar a mudança.
  validarCamposNaoPreenchidosAutomaticamentePeloCnpj() {
    inputDoAutocomplete('Tipo de Prospect').should('have.value', '')
    inputDoAutocomplete('Agente Comercial').should('have.value', '')
    cy.get(SELECTORS.tipoEmpresaHiddenInput).should('have.value', '')
  }

  salvar() {
    cy.contains(SELECTORS.botaoSalvar, 'Salvar').click()
  }

  // Os 3 campos obrigatórios ficam com a classe `Mui-disabled` até a primeira tentativa de
  // salvar; habilitar não é instantâneo, então esperar por essa condição (em vez de um cy.wait
  // fixo) evita o flake observado durante a investigação (clique caindo no input ainda
  // desabilitado, "element is disabled").
  aguardarCamposObrigatoriosHabilitados() {
    inputDoAutocomplete('Tipo de Prospect').should('not.be.disabled')
  }

  selecionarTipoProspect(valorExato) {
    this._selecionarOpcaoAutocomplete('Tipo de Prospect', valorExato)
  }

  selecionarAgenteComercial(valorExato) {
    this._selecionarOpcaoAutocomplete('Agente Comercial', valorExato)
  }

  selecionarTipoEmpresa(valorTexto) {
    cy.get(SELECTORS.tipoEmpresaSelect).click()
    cy.contains(SELECTORS.opcaoMenu, valorTexto).click()
  }

  _selecionarOpcaoAutocomplete(labelTexto, valorExato) {
    // Digitar o valor antes de escolher evita ambiguidade de "contains" por substring (ex.:
    // "PROSPECT" também é substring de "PROSPECT PESSOA FÍSICA") e reduz a lista renderizada.
    inputDoAutocomplete(labelTexto).click().clear().type(valorExato)
    cy.contains(SELECTORS.opcaoMenu, new RegExp(`^${valorExato}$`)).click()
  }
}

module.exports = new NovoProspectPage()
