import './commands'
import './comandos'
import './helpers'
import './querysSql'
import './requests'
import "cypress-real-events"
import 'cypress-file-upload'

Cypress.env('user', {
  usuario: Cypress.env('APP_USER'),
  senha:   Cypress.env('APP_PASS'),
})

 Cypress.env('empresa2', {
   cnpj: '88651500000134',
   razaoSocial: 'BUZIN TRANSPORTES E COMERCIO LTDA',
   fundos: [
     'MULTIPLICA FUNDO DE INVESTIMENTO EM D',
     'MULTIFRIGO FUNDO DE INVESTIMENTO EM DIREITOS CREDITORIOS NAO PADRONIZADOS'
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
     'CCB/NC':  { limite: '500000000', prazo: '365', taxa: '2.00', concentracao: '100' },
     'ANCORA':  { limite: '500000000', prazo: '365', taxa: '2.00', concentracao: '100' },
     'BOLETO':  { limite: '500000000', prazo: '365', taxa: '2.00', concentracao: '100' }
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

Cypress.env('user', {
  usuario: Cypress.env('APP_USER'),
  senha:   Cypress.env('APP_PASS'),
})

 Cypress.env('empresa', {
   cnpj: '98670003000137',
   razaoSocial: 'VINHOS NOE',
   fundos: [
     'MULTIPLICA FUNDO DE INVESTIMENTO EM D',
     'MULTIFRIGO FUNDO DE INVESTIMENTO EM DIREITOS CREDITORIOS NAO PADRONIZADOS'
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
     'CCB/NC':  { limite: '500000000', prazo: '365', taxa: '2.00', concentracao: '100' },
     'ANCORA':  { limite: '500000000', prazo: '365', taxa: '2.00', concentracao: '100' },
     'BOLETO':  { limite: '500000000', prazo: '365', taxa: '2.00', concentracao: '100' }
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
    'MULTIPLICA FUNDO DE INVESTIMENTO EM D',
    'MULTIFRIGO FUNDO DE INVESTIMENTO EM DIREITOS CREDITORIOS NAO PADRONIZADOS'
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
    ['CCB/NC']: { limite: '500000000', prazo: '365', taxa: '2.00', concentracao: '100' },
    ['ANCORA']: { limite: '500000000', prazo: '365', taxa: '2.00', concentracao: '100' },
    ['BOLETO']: { limite: '500000000', prazo: '365', taxa: '2.00', concentracao: '100' }
  }
});


Cypress.on('uncaught:exception', (err) => {

  if (
    /Cannot read properties of undefined \(reading 'content'\)/.test(err.message) ||
    /Request failed with status code 502/.test(err.message) ||
    /Request failed with status code 406/.test(err.message) ||
    /Request failed with status code 404/.test(err.message) ||
    /Request failed with status code 500/.test(err.message) ||
    /Network Error/.test(err.message) ||
    err.message.includes('ResizeObserver loop completed with undelivered notifications') ||
    err.message.includes('ResizeObserver loop limit exceeded')
  ) {
    return false
  }

})

