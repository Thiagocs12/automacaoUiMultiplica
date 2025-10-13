import './commands'
import './poc'
import './helpers'
import './querysSql'
import './requests'
import './operacao'
import "cypress-real-events"
import 'cypress-file-upload'

Cypress.env('user', {
  usuario: Cypress.env('APP_USER'),
  senha:   Cypress.env('APP_PASS'),
})

Cypress.env('empresa', {
  cnpj: '98670003000137',
  razaoSocial: 'VINHOS NOE',
  fundos: [
    'MULTIPLICA',
    'MULTIFRIGO'
  ],
  kyc: [
    'Clube de Futebol',
    'Mútuo Petro',
    'Participação Estrangeira',
    'Mútuo SUS'
  ],
  socio: {
    cpf: '02245983092',
    tipoAssinatura: 'Individual'
  },
  pessoaLigada: {
    cpf: '64534685068',
    tipoPessoa: 'Devedor Solidario'
  },
  contaBancaria: {
    banco: '33 - SANTANDER',
    agencia: '0001',
    conta: '02538695',
    digito: '1',
    nomeContato: 'NOE',
    emailContato: 'noe@vinhosnoe.com.br',
    ddi: 55,
    ddd: 11,
    telefone: 999999999,
    tipoConta: 'NORMAL'
  },
  produtos: {
    'CCB/NC':  { limite: '5000000', prazo: '365', taxa: '2.00', concentracao: '100' },
    'ANCORA':  { limite: '5000000', prazo: '365', taxa: '2.00', concentracao: '100' },
    'BOLETO':  { limite: '5000000', prazo: '365', taxa: '2.00', concentracao: '100' }
  },
  contato: {
    nome: 'NOE',
    email: 'noe@vinhosnoe.com.br',
    ddi: 55,
    ddd: 11,
    telefone: 999999999
  },
  telefones: {
    'NOE':   { ddi: 55, ddd: 11, telefone: 999999999 },
    'TIAGO': { ddi: 55, ddd: 11, telefone: 999999998 }
  }
});

Cypress.env('grupoEconomico', {
  nome: 'STERICYCLE',
  empresasGrupo: {
    ['01568077000125']: { principal: true, razaoSocial: 'STERICYCLE' },
    ['05462743000105']: { principal: false, razaoSocial: 'ABORGAMA DO BRASIL LTDA' },
    ['11568295000113']: { principal: false, razaoSocial: 'B Green Novas Participacoes LTDA' }
  },
  fundos: [
    'MULTIPLICA',
    'MULTIFRIGO'
  ],
  kyc: [
    'Clube de Futebol',
    'Mútuo Petro',
    'Participação Estrangeira',
    'Mútuo SUS'
  ],
  contaBancaria: {
    banco: '33 - SANTANDER',
    agencia: '0001',
    conta: '02538695',
    digito: '1',
    nomeContato: 'NOE',
    emailContato: 'noe@vinhosnoe.com.br',
    ddi: 55,
    ddd: 11,
    telefone: 999999999,
    tipoConta: 'NORMAL'
  },
  produtos: {
    ['CCB/NC']: { limite: '5000000', prazo: '365', taxa: '2.00', concentracao: '100' },
    ['ANCORA']: { limite: '5000000', prazo: '365', taxa: '2.00', concentracao: '100' },
    ['BOLETO']: { limite: '5000000', prazo: '365', taxa: '2.00', concentracao: '100' }
  }
});


Cypress.on('uncaught:exception', (err) => {
  if (
    /Cannot read properties of undefined \(reading 'content'\)/.test(err.message)
  ) {
    return false
  }
})

Cypress.on('uncaught:exception', (err) => {
  if (/Request failed with status code 502/.test(err.message)) {
    return false
  }
})

Cypress.on('uncaught:exception', (err) => {
  if (/Request failed with status code 406/.test(err.message)) {
    return false
  }
})

Cypress.on('uncaught:exception', (err) => {
  if (/Request failed with status code 404/.test(err.message)) {
    return false
  }
})

Cypress.on('uncaught:exception', (err) => {
  if (/Request failed with status code 500/.test(err.message)) {
    return false
  }
})
Cypress.on('uncaught:exception', (err) => {
  if (/Network Error/.test(err.message)) {
    return false
  }
})

Cypress.on('uncaught:exception', (err) => {
  const msg = err?.message || ''
  if (
    msg.includes('ResizeObserver loop completed with undelivered notifications') ||
    msg.includes('ResizeObserver loop limit exceeded')
  ) {
    return false
  }
})
