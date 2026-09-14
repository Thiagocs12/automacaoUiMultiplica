class EtapaBase {
  constructor({ perfil }) {
    this.perfil = perfil
  }

  logar() {
    cy.loginComoPerfil(this.perfil)
  }

  executar() {
    throw new Error('executar() não implementado')
  }

  validar() {
    throw new Error('validar() não implementado')
  }
}

module.exports = EtapaBase
