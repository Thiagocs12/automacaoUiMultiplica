#language: pt

Funcionalidade: Login na plataforma Beyond via Keycloak

  Cenário: Login com credenciais válidas
    Quando o usuário realiza login com o perfil "master"
    Então ele deve ser autenticado com sucesso na aplicação Beyond

  Cenário: Login com credenciais inválidas
    Quando o usuário tenta logar com o usuário "usuario.invalido@teste.com" e a senha "senhaInvalida123"
    Então ele deve ver a mensagem de erro do Keycloak
    E ele não deve ser autenticado na aplicação Beyond
