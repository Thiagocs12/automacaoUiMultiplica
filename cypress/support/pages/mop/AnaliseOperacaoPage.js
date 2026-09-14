const SELECTORS = {
  // A tela de análise mostra dois <h1> lado a lado: "OPERAÇÃO <n> -" e o nome da empresa logo em
  // seguida. Não dá pra simplesmente pegar "o h1 que não é o número da operação": a tela do
  // Monitor Diário (por trás, ainda montada) também tem um h1 próprio ("Operações"). Por isso
  // localizamos especificamente o h1 "OPERAÇÃO <número>" e pegamos o h1 seguinte a ele.
  titulos: 'h1.mop-MuiTypography-h1',
}

class AnaliseOperacaoPage {
  obterNomeEmpresa() {
    // A tela de análise carrega de forma assíncrona (XHR de pré-operações): usar `.should()` em
    // vez de `.then()` é o que garante retry até o h1 "OPERAÇÃO <n>" realmente aparecer, em vez de
    // resolver cedo com os headings ainda no estado anterior (da tela do Monitor Diário).
    return cy
      .get(SELECTORS.titulos, { timeout: 20000 })
      .should(($titulos) => {
        const indice = [...$titulos].findIndex((el) => /^OPERAÇÃO\s+\d/.test(el.textContent.trim()))
        expect(indice, 'h1 com "OPERAÇÃO <número>"').to.be.greaterThan(-1)
        expect($titulos[indice + 1], 'h1 seguinte, com o nome da empresa').to.exist
      })
      .then(($titulos) => {
        const els = [...$titulos]
        const indice = els.findIndex((el) => /^OPERAÇÃO\s+\d/.test(el.textContent.trim()))
        return els[indice + 1].textContent.trim()
      })
  }
}

module.exports = new AnaliseOperacaoPage()
