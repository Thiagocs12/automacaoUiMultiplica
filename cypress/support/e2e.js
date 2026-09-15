import './commands'

// Bug conhecido do widget de menu do Beyond (mc-menu.js): ao abrir "Beyond BackOffice" o
// componente às vezes lança "Cannot read properties of undefined (reading 'content')" num
// evento assíncrono próprio (não afeta a navegação visual real). Sem isso o Cypress falha o
// teste por uma exceção não tratada da aplicação que não tem relação com a asserção do cenário.
//
// "ResizeObserver loop completed with undelivered notifications": ruído conhecido de browser em
// telas com layout dinâmico (visto no Monitor Diário do MOP), sem relação com bug real de
// aplicação. Autorizado pelo Thiago em 2026-09-14 (ver agent-master/duvidas.md,
// 20260914130450-resolucao-viewport-e-video-execucao) a ignorar do mesmo jeito que o erro acima.
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes("Cannot read properties of undefined (reading 'content')")) {
    return false
  }
  if (err.message.includes('ResizeObserver loop completed with undelivered notifications')) {
    return false
  }
})
