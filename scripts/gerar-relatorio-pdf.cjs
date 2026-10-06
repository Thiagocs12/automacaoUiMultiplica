// Gera um PDF por cenário (Cenário do Cucumber) a partir dos pares de screenshots antes/depois
// tirados por `EtapaBase.passo()` (cypress/support/etapas/EtapaBase.js) durante `cypress run`.
// Rodado depois de `npm test` (ver script "test" em package.json). Não falha o build se não
// houver screenshots — só não gera nada (ex.: nenhum cenário rodou `passo()` ainda).
const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'cypress', 'screenshots')
const RELATORIOS_DIR = path.join(__dirname, '..', 'relatorios')

const NOME_SCREENSHOT_REGEX = /^(.+)__(\d+)-(.+)-(antes|depois)$/

function listarPngsRecursivo(dir) {
  if (!fs.existsSync(dir)) return []
  const resultado = []
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const caminho = path.join(dir, entrada.name)
    if (entrada.isDirectory()) {
      resultado.push(...listarPngsRecursivo(caminho))
    } else if (entrada.isFile() && entrada.name.endsWith('.png')) {
      resultado.push(caminho)
    }
  }
  return resultado
}

function agruparPorCenario(arquivos) {
  const cenarios = new Map()

  for (const arquivoAbsoluto of arquivos) {
    const nomeBase = path.basename(arquivoAbsoluto, '.png')
    const match = nomeBase.match(NOME_SCREENSHOT_REGEX)
    if (!match) continue // screenshot fora do padrão de passo() (ex.: falha automática do Cypress) — ignorado aqui

    const [, cenarioSlug, numero, descricaoSlug, momento] = match
    if (!cenarios.has(cenarioSlug)) {
      cenarios.set(cenarioSlug, { cenarioSlug, passos: new Map() })
    }
    const cenario = cenarios.get(cenarioSlug)

    if (!cenario.passos.has(numero)) {
      cenario.passos.set(numero, { numero, descricaoSlug })
    }
    cenario.passos.get(numero)[momento] = arquivoAbsoluto
  }

  return [...cenarios.values()].map((cenario) => ({
    ...cenario,
    passos: [...cenario.passos.values()].sort((a, b) => a.numero.localeCompare(b.numero)),
  }))
}

function destacarTexto(slug) {
  return slug.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())
}

function gerarPdfCenario(cenario) {
  if (!fs.existsSync(RELATORIOS_DIR)) fs.mkdirSync(RELATORIOS_DIR, { recursive: true })

  const caminhoPdf = path.join(RELATORIOS_DIR, `${cenario.cenarioSlug}.pdf`)
  const doc = new PDFDocument({ margin: 40, autoFirstPage: false })
  doc.pipe(fs.createWriteStream(caminhoPdf))

  cenario.passos.forEach((passo, indice) => {
    ;['antes', 'depois'].forEach((momento) => {
      const imagem = passo[momento]
      if (!imagem) return

      doc.addPage()
      doc
        .fontSize(16)
        .text(destacarTexto(cenario.cenarioSlug), { align: 'center' })
        .moveDown(0.5)
        .fontSize(12)
        .text(`Passo ${Number(passo.numero)}: ${destacarTexto(passo.descricaoSlug)} — ${momento}`, {
          align: 'center',
        })
        .moveDown(1)

      const larguraDisponivel = doc.page.width - doc.page.margins.left - doc.page.margins.right
      const alturaDisponivel = doc.page.height - doc.y - doc.page.margins.bottom

      doc.image(imagem, doc.page.margins.left, doc.y, {
        fit: [larguraDisponivel, alturaDisponivel],
        align: 'center',
      })
    })
    void indice
  })

  doc.end()
  return caminhoPdf
}

function main() {
  const arquivos = listarPngsRecursivo(SCREENSHOTS_DIR)
  const cenarios = agruparPorCenario(arquivos)

  if (cenarios.length === 0) {
    console.log('[gerar-relatorio-pdf] Nenhum screenshot no padrão de EtapaBase.passo() encontrado — nenhum PDF gerado.')
    return
  }

  const gerados = cenarios.map(gerarPdfCenario)
  console.log(`[gerar-relatorio-pdf] ${gerados.length} PDF(s) gerado(s) em relatorios/:`)
  gerados.forEach((caminho) => console.log(`  - ${path.basename(caminho)}`))
}

main()
