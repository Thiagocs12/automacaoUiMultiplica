function slugify(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

class EtapaBase {
  constructor({ perfil }) {
    this.perfil = perfil
    this._numeroPasso = 0
  }

  logar() {
    cy.loginComoPerfil(this.perfil)
  }

  // Registra um par de screenshots (antes/depois) ao redor de uma ação relevante da Etapa, para
  // alimentar o relatório em PDF (scripts/gerar-relatorio-pdf.cjs) — não precisa envolver toda
  // ação de baixo nível, só o suficiente para demonstrar visualmente o que a Etapa fez.
  passo(descricao, acao) {
    this._numeroPasso += 1
    const cenario = (typeof Cypress !== 'undefined' && Cypress.currentTest && Cypress.currentTest.title) || 'cenario'
    const numero = String(this._numeroPasso).padStart(2, '0')
    const nomeBase = `${slugify(cenario)}__${numero}-${slugify(descricao)}`

    cy.screenshot(`${nomeBase}-antes`, { overwrite: true })
    acao()
    cy.screenshot(`${nomeBase}-depois`, { overwrite: true })
  }

  executar() {
    throw new Error('executar() não implementado')
  }

  validar() {
    throw new Error('validar() não implementado')
  }
}

module.exports = EtapaBase
