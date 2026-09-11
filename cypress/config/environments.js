function montarAmbientes() {
  return {
    hml: {
      appBaseUrl: Cypress.env('HML_APP_BASE_URL'),
      keycloakUrl: Cypress.env('HML_KEYCLOAK_URL'),
      usuarios: {
        master: {
          username: Cypress.env('HML_MASTER_USERNAME'),
          password: Cypress.env('HML_MASTER_PASSWORD'),
        },
        // Demais perfis (operador, aprovador, etc.) entram aqui conforme forem
        // provisionados em hml — não redesenhar a estrutura, só adicionar chaves.
      },
    },
  }
}

function getEnvironment(nomeAmbiente = 'hml') {
  const ambiente = montarAmbientes()[nomeAmbiente]
  if (!ambiente) {
    throw new Error(`Ambiente "${nomeAmbiente}" não configurado em environments.js`)
  }
  return ambiente
}

function getUsuario(perfil, nomeAmbiente = 'hml') {
  const ambiente = getEnvironment(nomeAmbiente)
  const usuario = ambiente.usuarios[perfil]
  if (!usuario || !usuario.username || !usuario.password) {
    throw new Error(
      `Usuário de teste para o perfil "${perfil}" não configurado no ambiente "${nomeAmbiente}" (verifique o .env)`
    )
  }
  return usuario
}

module.exports = { getEnvironment, getUsuario }
