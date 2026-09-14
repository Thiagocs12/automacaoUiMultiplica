# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Cypress E2E test suite for Multiplica's platform. The login foundation (Keycloak SSO) is implemented; feature branches add further test suites and are merged into `reviewAgents` via a human-approved Pull Request opened by an automated Agent Master (see Collaboration workflow below).

## Commands

```bash
npm test           # cypress run (headless)
npm run test:open  # cypress open (interactive runner)
```

To run a single spec: `npx cypress run --spec "cypress/e2e/<path-to-spec>"`.

Every run records a video to `cypress/videos/` (gitignored) — check it instead of running
`cypress open` interactively when you just need to watch a past run. `viewportWidth`/
`viewportHeight` (1920x1080, set in `cypress.config.js`) control the app's rendered size during
the test, but **not** the recorded `.mp4` resolution — Cypress exposes no config for that; video
capture is a separate internal pipeline. Measured real resolution (reading the `.mp4`'s `tkhd`
box) by mode: Electron headless (default `npm test`/`cypress run`, what automation uses) →
1280x720; Chrome headless (`--browser chrome --headless`) → 1264x624; Electron `--headed` (manual
use only) → 1920x982 (width matches, height varies by window chrome/DPI).

## Architecture (current state)

- `cypress.config.js` — `e2e` config with spec pattern `cypress/e2e/**/*.feature` and `@badeball/cypress-cucumber-preprocessor` + esbuild bundler wired in.
- `cypress/support/e2e.js` — imports `commands.js`; add global setup here.
- `cypress/support/commands.js` — `cy.loginComoPerfil(perfil)` and `cy.tentarLoginComCredenciais(username, password)` (see Login atual below); add further custom commands here as the suite grows.
- `cypress/support/pages/shared/LoginPage.js`, `cypress/config/environments.js`, `cypress/e2e/features/shared/login.feature`, `cypress/support/step_definitions/shared/login.js` — login foundation (see Planned architecture below).
- `cypress/fixtures/example.json` — default Cypress fixture.

## Planned architecture (POC → MOP → demais módulos)

O sistema real a ser testado gira em torno de **esteiras** (pipelines de aprovação) que passam por diferentes áreas/perfis até resultar numa transação financeira (antecipação de duplicata, pagamento de ordem de pagamento, alienação fiduciária de garantias, cessão entre fundos, etc.). O trabalho começa pelo módulo **POC** (uma empresa é validada — validadores, alçadas, cadastro de fundos, cadastro de produtos — até virar um **cedente** apto a operar) e depois seguirá para o módulo **MOP** (submissão e validação de uma operação), repetindo o mesmo padrão para os módulos seguintes.

A unidade de reuso é uma classe **por etapa** da esteira, responsável por saber: qual perfil de usuário deve logar, quais ações executar, e quais validações rodar naquela etapa. Etapas raramente se repetem entre módulos, mas é comum se repetirem entre esteiras diferentes de um **mesmo** módulo (ex: duas esteiras do POC podem compartilhar a etapa "cadastro de fundo"). Os testes de validação específica (ex: só alçadas, só cadastro de fundos) sempre percorrem a esteira via UI desde o início — sem seed direto via API/DB.

O objetivo da primeira fase é montar a fundação (Page Object Model + abstração de Etapa/Esteira) e entregar a POC como módulo de referência: etapas de validação isoladas + um fluxo completo (empresa → cedente operando). O padrão criado aqui será reaplicado no MOP e nos módulos seguintes.

### Três camadas

1. **Pages** (`cypress/support/pages/`) — Page Object Model puro: um objeto por tela, com seletores e ações de baixo nível (preencher campo, clicar botão). Reutilizável por qualquer etapa que precise daquela tela.
2. **Etapas** (`cypress/support/etapas/`) — uma classe por etapa de negócio da esteira. Contrato comum (`EtapaBase`), implementações concretas organizadas **por módulo** (`poc/`, `mop/`), reaproveitáveis entre esteiras do mesmo módulo.
3. **Esteiras** (`cypress/support/esteiras/`) — orquestradores que compõem uma lista ordenada de Etapas para representar um fluxo de negócio completo (ex: `EsteiraCedente` = a sequência de etapas que leva uma empresa a virar cedente).

### Estrutura de pastas alvo

```
cypress/
  e2e/features/
    poc/
      poc-validadores.feature      # cenários isolados: alçadas, cadastro de fundo, cadastro de produto...
      poc-fluxo-completo.feature   # empresa -> cedente operando, ponta a ponta
    mop/
      mop-validadores.feature
      mop-fluxo-completo.feature
  support/
    pages/
      shared/
        LoginPage.js               # reaproveita/substitui o cy.ambienteLogin atual
      poc/
        CadastroFundoPage.js
        CadastroProdutoPage.js
        AlcadaPage.js
      mop/
        OperacaoPage.js
    etapas/
      EtapaBase.js                 # contrato: perfil, logar(), executar(), validar()
      poc/
        EtapaCadastroFundo.js
        EtapaCadastroProduto.js
        EtapaValidacaoAlcada.js
      mop/
        Etapa...Operacao.js
    esteiras/
      poc/
        EsteiraCedente.js          # lista ordenada de Etapas do POC
      mop/
        EsteiraOperacao.js
    step_definitions/
      poc/
        pocValidadores.js
        pocFluxoCompleto.js
      mop/
        ...
    commands.js                    # cy.loginComoPerfil(perfil) via cy.session, substitui/evolui cy.ambienteLogin
  config/
    environments.js                # adicionar mapa `usuarios` por perfil, por ambiente
```

> Nota: as `.feature` + `step_definitions` implicam Gherkin/Cucumber — `@badeball/cypress-cucumber-preprocessor` já está instalado e configurado (`cypress.config.js`, `package.json`).

### Contrato de Etapa (`EtapaBase`)

```js
class EtapaBase {
  constructor({ perfil }) { this.perfil = perfil; }
  logar() { cy.loginComoPerfil(this.perfil); }   // usa cy.session internamente, cacheia por perfil
  executar() { throw new Error('executar() não implementado'); }
  validar() { throw new Error('validar() não implementado'); }
}
```

Cada Etapa concreta (ex: `EtapaCadastroFundo`) estende isso, define o `perfil` correto, usa as Pages relevantes em `executar()`, e roda as assertivas de regra de negócio daquela etapa em `validar()`.

### Orquestrador de Esteira

```js
class EsteiraCedente {
  constructor() {
    this.etapas = [
      new EtapaCadastroFundo({ perfil: 'operador' }),
      new EtapaCadastroProduto({ perfil: 'operador' }),
      new EtapaValidacaoAlcada({ perfil: 'aprovador' }),
      // ...
    ];
  }
  executarCompleta() {
    this.etapas.forEach(e => { e.logar(); e.executar(); e.validar(); });
  }
  executarAte(EtapaClasse) {
    // roda etapas em ordem até (e incluindo) a etapa alvo — usado pelos cenários de validação isolada
  }
}
```

Os cenários de "validador específico" chamam `executarAte(EtapaX)` (sempre via UI, do início) e então fazem assertivas adicionais focadas naquela etapa. O cenário de "fluxo completo" chama `executarCompleta()` e valida o resultado final (empresa virou cedente ativo).

### Papel do Cucumber (camada fina)

Importante não confundir quem orquestra o quê: quem sabe a ordem das etapas de negócio é a classe **Esteira**, em JS puro — não o Cucumber. O `.feature` + os `step_definitions` são só uma casca de legibilidade em cima dela:

```gherkin
# poc-fluxo-completo.feature
Cenário: Empresa completa o fluxo e vira cedente
  Quando o fluxo completo da esteira de cedente é executado
  Então a empresa deve aparecer como cedente ativo

# poc-validadores.feature
Cenário: Alçada rejeita valor acima do limite do aprovador
  Quando a esteira é executada até a etapa de validação de alçada
  E é submetido um valor acima do limite do perfil aprovador
  Então a etapa deve rejeitar a operação
```

```js
// step_definitions/poc/pocFluxoCompleto.js
Quando('o fluxo completo da esteira de cedente é executado', () => {
  new EsteiraCedente().executarCompleta();
});

// step_definitions/poc/pocValidadores.js
Quando('a esteira é executada até a etapa de validação de alçada', () => {
  cy.wrap(new EsteiraCedente()).as('esteira').invoke('executarAte', EtapaValidacaoAlcada);
});
```

Ou seja: o step definition não sabe nada sobre a sequência das etapas — ele só invoca `executarCompleta()`/`executarAte(EtapaX)` na Esteira e delega toda a lógica de orquestração e validação para lá. Isso mantém a ordem de negócio testável e reaproveitável fora do Gherkin (ex: em testes unitários da própria classe, se algum dia fizer sentido) e deixa o `.feature` livre para descrever o cenário em linguagem de negócio, sem acoplar a leitura do arquivo à implementação.

### Multi-perfil / login

- `cy.session(perfil, () => {...})` para cachear sessão por perfil e evitar relogin desnecessário entre etapas.
- Mapa de usuários por perfil (`{ operador: { username, password }, aprovador: { username, password }, ... }`) vindo de `environments.js` + `.env`/`.env.example` (ex: `HML_OPERADOR_USERNAME`, `HML_APROVADOR_USERNAME`, etc.).
- **Dependência externa (bloqueio conhecido):** os usuários de teste por perfil ainda não existem em hml. A estrutura de código fica pronta para recebê-los, mas os cenários multi-perfil (a maioria) não vão poder rodar de ponta a ponta até esses usuários serem provisionados. Isso deve ser tratado como pré-requisito paralelo, não como bloqueio do trabalho de arquitetura.

### Login atual

Implementado: `cypress/support/pages/shared/LoginPage.js` (seletores/ações puras da tela do
Keycloak) + `cy.loginComoPerfil(perfil)` em `commands.js` (usa `cy.session` para cache por perfil
e `cy.origin` para navegar ao Keycloak). Cenários em
`cypress/e2e/features/shared/login.feature` + `cypress/support/step_definitions/shared/login.js`,
com assertivas reais de sucesso/erro (substituindo o antigo `cy.pause()` sem assertiva da branch
`fluxoLogin`, já removida).

**Gotcha de `cy.session`**: o setup/validate do `cy.session` só restaura cookies/localStorage —
ele não deixa a página navegada na app depois de rodar. `cy.loginComoPerfil` faz um `cy.visit`
extra logo após o `cy.session` para garantir que o teste continue na aplicação autenticada (sem
isso, a URL fica em `about:blank` e a assertiva de login bem-sucedido falha mesmo com a sessão
válida).

### Ordem de execução

1. **Fundação**: `LoginPage`, `cy.loginComoPerfil` (com `cy.session`) e `environments.js`/`.env.example`
   com mapa de usuários por perfil já implementados e validados em HML (perfil `master`). Assertiva
   real de login bem-sucedido/erro já corrigida. `EtapaBase`/`etapas`/`esteiras` ainda não criados —
   entram na fase POC.
2. **POC — etapas isoladas**: implementar `EtapaCadastroFundo`, `EtapaCadastroProduto`, `EtapaValidacaoAlcada` (e outros validadores citados) com suas Pages, cada uma com cenário próprio em `poc-validadores.feature`.
3. **POC — fluxo completo**: `EsteiraCedente` completa + cenário `poc-fluxo-completo.feature`.
4. **MOP**: repetir o mesmo padrão (etapas de validação de operação + `EsteiraOperacao` completa), reaproveitando `EtapaBase`, `LoginPage` e o comando de login — sem reaproveitar etapas específicas do POC.
5. **Módulos seguintes**: mesmo padrão, módulo a módulo.

Fora de escopo por enquanto (não pedido nesta fase): seed via API/DB, CI/CD, relatórios (mochawesome/Allure) — podem ser propostos depois que a POC estiver estável.

### Arquivos-chave a criar/alterar

- ~~Criar: `cypress/support/pages/shared/LoginPage.js`~~ — feito.
- ~~Alterar: `cypress/support/commands.js` (novo `cy.loginComoPerfil`, substituindo/evoluindo `ambienteLogin`)~~ — feito.
- ~~Alterar: `cypress/config/environments.js` (mapa `usuarios` por ambiente)~~ — feito (perfil `master` em `hml`).
- ~~Alterar: `.env.example` (novas variáveis de usuários por perfil)~~ — feito.
- ~~Alterar/mover: `cypress/e2e/features/fluxoLogin.feature`~~ — substituído por `cypress/e2e/features/shared/login.feature` + `step_definitions/shared/login.js`, com assertivas reais.
- Criar: `cypress/support/etapas/EtapaBase.js`
- Criar: `cypress/support/etapas/poc/EtapaCadastroFundo.js`, `EtapaCadastroProduto.js`, `EtapaValidacaoAlcada.js` (+ Pages correspondentes em `pages/poc/`)
- Criar: `cypress/support/esteiras/poc/EsteiraCedente.js`
- Criar: `cypress/e2e/features/poc/poc-validadores.feature`, `poc-fluxo-completo.feature` + step definitions em `cypress/support/step_definitions/poc/`

**MOP — feito** (módulo `mop`, tarefa `20260911214610-monitor-diario-analisar-operacao`): `EtapaBase`
(`cypress/support/etapas/EtapaBase.js`) + `MonitorDiarioPage.js`/`AnaliseOperacaoPage.js`
(`pages/mop/`) + `EtapaAnalisarOperacaoMonitorDiario.js` (`etapas/mop/`) +
`EsteiraAnalisarOperacaoMonitorDiario.js` (`esteiras/mop/`) + `mop-monitor-diario.feature` +
`step_definitions/mop/mopMonitorDiario.js`. Cobre o fluxo: login `master` → Beyond BackOffice →
Comercial → Monitor Diário (drawer só com ícones; expandir via ícone `LoopIcon` revela o texto dos
itens) → localizar operação fora de "Inclusão OPE" (ampliando a busca para a janela de 29 dias
quando a data padrão não tem nenhuma) → capturar cedente na listagem → "Analisar Operação" →
validar que o nome de empresa exibido na tela de análise é igual ao cedente capturado.

### Verificação

- Cada cenário de `poc-validadores.feature` roda via UI do início e valida a regra correspondente corretamente (casos positivo e negativo).
- Rodar o cenário `poc-fluxo-completo.feature` ponta a ponta e confirmar que a empresa aparece como cedente ativo ao final (via UI, na tela correspondente).
- Confirmar que trocar de perfil entre etapas não força relogin desnecessário (checar cache de `cy.session` no relatório do Cypress).
- Assim que os usuários de teste por perfil forem provisionados, validar que `environments.js` os carrega corretamente por ambiente (hml pelo menos) antes de rodar os fluxos multi-perfil completos.

## Collaboration workflow

This repo is maintained by automated agents (Claude Code), with every integration gated by a
human-approved Pull Request:

- Each task is implemented by a subAgent on a new branch off `reviewAgents`; the subAgent commits
  and pushes that branch when the task is done and its self-test passes.
- An Agent Master validates the branch — a local test-merge against `reviewAgents` to catch
  conflicts (resolved with the `/resolve-conflicts` skill,
  `.claude/skills/resolve-conflicts/`, committed onto the feature branch itself) and a test run —
  then opens a **Pull Request** (`gh pr create --base reviewAgents --head <branch>`). The Agent
  Master **never merges or pushes directly** to `reviewAgents` or `main`.
- A human reviews and merges each PR manually on GitHub, one task at a time, as they validate it
  (typically by running the suite against that branch first). The Agent Master picks up the merge
  afterward (`git pull origin reviewAgents`) — it never merges the PR itself.
- `main` only ever receives merges from `reviewAgents`, at release time — never a direct commit.
- A project-level hook (`.claude/settings.json`, `SessionStart`) fetches `origin/reviewAgents` when
  a session starts and auto-pulls it only if the current branch is `reviewAgents` with a clean
  working tree; otherwise it just warns instead of switching branches or overwriting local work.
- CI (`.github/workflows/cypress.yml`) runs `npm test` on every PR into `reviewAgents`/`main` and
  on every push to `reviewAgents`.
- Each agent instance (subAgent or Agent Master) pins its own Claude Code account via
  `CLAUDE_CONFIG_DIR`, set before `claude` starts — this is configured centrally in the
  Supervisor's automation folder (outside this repo), not per-clone here. The Agent Master also
  authenticates the `gh` CLI via a `GH_TOKEN` environment variable, set the same way.
