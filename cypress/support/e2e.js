import './commands'

// Bug conhecido do widget de menu do Beyond (mc-menu.js): ao abrir "Beyond BackOffice" o
// componente às vezes lança "Cannot read properties of undefined (reading 'content')" num
// evento assíncrono próprio (não afeta a navegação visual real). Sem isso o Cypress falha o
// teste por uma exceção não tratada da aplicação que não tem relação com a asserção do cenário.
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes("Cannot read properties of undefined (reading 'content')")) {
    return false
  }
})
