// cypress/support/helpers/urls.js
function getApps() {
  return Cypress.env('apps') || {}
}

function urlFor(app, path = '/') {
  const apps = getApps()
  const base = apps[app]
  if (!base) throw new Error(`App não configurada: ${app}`)
  return new URL(path, base).toString()
}

module.exports = { urlFor }
