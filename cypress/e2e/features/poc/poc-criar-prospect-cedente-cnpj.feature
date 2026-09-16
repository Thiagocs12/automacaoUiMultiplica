#language: pt

Funcionalidade: Criação de Prospect por CNPJ

  Cenário: Criar um Prospect a partir do CNPJ e confirmar que aparece na listagem
    Quando o fluxo de criação de Prospect por CNPJ é executado
    Então o Prospect criado deve aparecer na listagem de Prospecções
