#language: pt

Funcionalidade: Login na plataforma

  Esquema do Cenário: Validar login com diferentes credenciais
    Dado que o usuário acessa a página de login
    Quando ele preenche o email "<email>" e a senha "<senha>" e clica no botão de login
    Então ele deve ver a mensagem "<mensagem>"

    Exemplos:
      | email     | senha    | mensagem                 |
      | valido    | invalido | Bem-vindo ao dashboard   |
      | invalido  | valido   | Email ou senha inválidos |
      | valido    | valido   | Bem-vindo ao dashboard   |