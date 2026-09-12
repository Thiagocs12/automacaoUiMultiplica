# Cypress E2E — Multiplica

Suíte de testes end-to-end (Cypress) para a plataforma da Multiplica. O foco é validar **esteiras de negócio** (pipelines de aprovação) que passam por diferentes áreas/perfis até resultar numa transação financeira (antecipação de duplicata, pagamento de ordem de pagamento, alienação fiduciária de garantias, cessão entre fundos, etc.).

O trabalho começa pelo módulo **POC** (uma empresa é validada — validadores, alçadas, cadastro de fundos, cadastro de produtos — até virar um **cedente** apto a operar), segue para o **MOP** (submissão e validação de uma operação) e depois para os demais módulos, sempre reaplicando o mesmo padrão de arquitetura.

## Instalação

```bash
npm install
```

Copie `.env.example` para `.env` e preencha as URLs de ambiente e as credenciais dos usuários de
teste por perfil (ver `cypress/config/environments.js`).

## Rodando os testes

```bash
npm test           # cypress run (headless)
npm run test:open  # cypress open (interativo)
```

Rodar uma spec específica:

```bash
npx cypress run --spec "cypress/e2e/<caminho-da-spec>"
```

## Arquitetura da automação

A suíte é organizada em três camadas, para que uma etapa de negócio possa ser reaproveitada em várias esteiras sem duplicar código de tela:

1. **Pages** (`cypress/support/pages/`) — Page Object Model puro: um objeto por tela, com seletores e ações de baixo nível (preencher campo, clicar botão). Não sabe nada sobre regra de negócio.
2. **Etapas** (`cypress/support/etapas/`) — **uma classe por etapa de negócio** da esteira. Cada etapa sabe: qual perfil de usuário deve logar, quais ações executar (via Pages) e quais validações rodar. Contrato comum (`EtapaBase`): `logar()`, `executar()`, `validar()`.
3. **Esteiras** (`cypress/support/esteiras/`) — orquestradores em JS puro que compõem uma lista ordenada de Etapas representando um fluxo de negócio completo (ex: `EsteiraCedente` = a sequência de etapas que leva uma empresa a virar cedente).

### Onde entra o Cucumber

O Cucumber (`.feature` + `step_definitions`) é usado como **camada fina de legibilidade em cima das Esteiras** — ele não orquestra a ordem das etapas, só invoca os métodos da Esteira correspondente:

- `esteira.executarCompleta()` — roda todas as etapas em sequência (`logar → executar → validar` em cada uma). Usado pelo **fluxo simples/completo**: só garante que passar por tudo funciona e que o resultado final é o esperado (ex: empresa virou cedente ativo).
- `esteira.executarAte(EtapaX)` — roda as etapas em ordem até (e incluindo) uma etapa específica, sempre via UI desde o início (sem seed via API/DB). Usado pelos **cenários de validação isolada** (ex: só alçadas, só cadastro de fundo), que depois fazem asserções extras focadas naquela etapa.

```gherkin
# poc-fluxo-completo.feature
Cenário: Empresa completa o fluxo e vira cedente
  Quando o fluxo completo da esteira de cedente é executado
  Então a empresa deve aparecer como cedente ativo
```

```js
// step_definitions/poc/pocFluxoCompleto.js
Quando('o fluxo completo da esteira de cedente é executado', () => {
  new EsteiraCedente().executarCompleta();
});
```

Isso mantém a lógica de negócio (ordem das etapas, validações) testável e reaproveitável fora do Gherkin, e deixa o `.feature` livre para descrever o cenário em linguagem de negócio.

> Status: `@badeball/cypress-cucumber-preprocessor` já está instalado e configurado (`cypress.config.js` + `package.json`), como parte da fundação da arquitetura descrita em detalhe no [CLAUDE.md](CLAUDE.md).

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
    pages/          # Page Object Model, por módulo (shared/poc/mop)
    etapas/         # uma classe por etapa de negócio, por módulo
    esteiras/       # orquestradores (lista ordenada de Etapas), por módulo
    step_definitions/  # glue Cucumber -> Esteiras, por módulo
    commands.js     # cy.loginComoPerfil(perfil) via cy.session
  config/
    environments.js # mapa de usuários por perfil, por ambiente
```

Detalhamento completo (contrato de `EtapaBase`, orquestrador `EsteiraCedente`, estratégia de multi-perfil/login, ordem de execução do trabalho e checklist de verificação) está em [CLAUDE.md](CLAUDE.md).

## Fluxo de trabalho

Este repositório é mantido por agentes de automação (Claude Code): cada tarefa é implementada numa
branch nova a partir de `reviewAgents` por um subAgent, que commita e dá push ao concluir; um
Agent Master valida essa branch (resolve conflitos, roda os testes) e abre um **Pull Request**
contra `reviewAgents` — a aprovação e o merge de cada PR são sempre manuais, feitos por um humano
responsável à medida que valida cada tarefa. Detalhes completos do fluxo estão em
[CLAUDE.md](CLAUDE.md).
