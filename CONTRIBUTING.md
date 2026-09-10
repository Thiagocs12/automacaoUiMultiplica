# Contribuindo com o projeto

Este repositório é colaborativo. Estas regras existem para evitar que trabalho de outras pessoas seja sobrescrito e para manter a suíte de testes estável.

## Fluxo de branches

1. **Nunca commite direto em `reviewAgents` ou `main`.** Toda mudança começa em uma branch nova, criada a partir de `reviewAgents` atualizada:
   ```bash
   git checkout reviewAgents
   git pull origin reviewAgents
   git checkout -b minha-mudanca
   ```
2. Nomeie a branch pelo propósito: `feature/nome`, `fix/nome`, `chore/nome`.
3. Ao terminar, abra um **Pull Request com destino `reviewAgents`** (não `main`). `main` só recebe merge de `reviewAgents` em momentos de release.
4. PRs devem passar no CI (`.github/workflows/cypress.yml`) antes do merge.

## Auto-pull da reviewAgents

O Claude Code está configurado (`.claude/settings.json`, hook `SessionStart`) para, ao iniciar uma sessão neste repositório:
- Sempre rodar `git fetch origin reviewAgents`.
- Se a branch atual for `reviewAgents` **e** a árvore de trabalho estiver limpa, rodar `git pull origin reviewAgents` automaticamente.
- Caso contrário (branch diferente ou mudanças não commitadas), apenas avisar — nunca troca de branch nem sobrescreve trabalho em andamento sozinho.

Se o hook não disparar logo após ser criado/alterado, abra `/hooks` uma vez ou reinicie a sessão para que o Claude Code releia a configuração.

## Conflitos de merge

Use a skill `/resolve-conflicts` (`.claude/skills/resolve-conflicts/`) em vez de resolver conflitos às cegas. Ela orienta a entender os dois lados de cada mudança antes de mesclar, e a manter arquivos de teste e suas dependências (comandos, fixtures, config) consistentes entre si.

## CI

`.github/workflows/cypress.yml` roda `npm test` (Cypress headless) em todo PR para `reviewAgents`/`main` e em todo push para `reviewAgents`. Sobe screenshots (em falha) e vídeos como artefatos.

## Múltiplas contas do Claude Code em clones paralelos

Se você usa mais de uma conta do Claude Code e quer rodar tarefas em paralelo em clones diferentes deste repositório, cada clone pode fixar sua própria conta via a variável de ambiente `CLAUDE_CONFIG_DIR`, definida **antes** do `claude` iniciar (não dá pra fazer isso pelo `settings.json`, que só é lido depois que as credenciais já foram carregadas).

Este repo já tem um `claude-start.ps1` (git-ignored, pessoal) de exemplo: rode `.\claude-start.ps1` em vez de `claude` diretamente. No outro clone, copie o script trocando o nome da pasta de credenciais (ex: `contaA` → `contaB`) para logar com a segunda conta.

## Proteção da branch `reviewAgents` (passo manual, uma vez)

Não há `gh` CLI nem token configurado neste ambiente para automatizar isto — precisa ser feito manualmente por alguém com permissão de admin no repositório:

1. GitHub → repositório → **Settings → Branches → Add branch protection rule**.
2. Branch name pattern: `reviewAgents`.
3. Marcar:
   - **Require a pull request before merging** (e opcionalmente "Require approvals": 1+).
   - **Require status checks to pass before merging** → selecionar o job `cypress-run` (aparece depois da primeira execução do workflow).
4. Repetir para `main` se quiser o mesmo nível de proteção.

## Sugestões adicionais (ainda não aplicadas)

- Template de PR (`.github/pull_request_template.md`) com checklist (testes rodados, `.env` não commitado, ambiente testado).
- `CODEOWNERS` se quiser revisores obrigatórios por área do repo.
