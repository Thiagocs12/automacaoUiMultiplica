// Importa a função que ajuda a definir as configs do Cypress
const { defineConfig } = require('cypress');
require('dotenv').config(); // carrega o .env

module.exports = defineConfig({
  e2e: {
    // baseUrl será definido dinamicamente no setupNodeEvents
    env: {
      // expõe credenciais/urls que você já usa nos testes
      APP_PASS: process.env.APP_PASS,
      APP_USER: process.env.APP_USER,
      BASE_URL_KEYCLOAK: process.env.BASE_URL_KEYCLOAK,
    },

    setupNodeEvents(on, config) {
      // ---------------- MULTI-APP ----------------
      const APPS = {
        backoffice: process.env.BASE_URL_BACKOFFICE,
        banking: process.env.BASE_URL_BANKING,
        bank: process.env.BASE_URL_BANK,
        // opcional
        keycloak: process.env.BASE_URL_KEYCLOAK,
      };

      // escolha da app por CLI: --env app=backoffice | banking | bank
      const app = (config.env.app || 'backoffice').toLowerCase();
      if (!APPS[app]) {
        throw new Error(
          `App desconhecida: ${app}. Use uma de: ${Object.keys(APPS).join(', ')}`
        );
      }
      config.baseUrl = APPS[app];
      // expõe o mapa de apps para uso em commands/testes
      config.env.apps = APPS;

      // ---------------- DB (MSSQL) ----------------
      const sql = require('mssql');
      let pool; // conexão única reaproveitável

      const toBool = (v, def = false) => {
        if (v == null) return def;
        const s = String(v).toLowerCase();
        return s === '1' || s === 'true' || s === 'yes';
      };

      async function getPool() {
        if (pool) return pool;
        try {
          pool = await new sql.ConnectionPool({
            server: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT || 1433),
            options: {
              encrypt: toBool(process.env.DB_ENCRYPT, true),
              trustServerCertificate: toBool(process.env.DB_TRUST_SERVER_CERT, false),
            },
            connectionTimeout: Number(process.env.DB_CONNECTION_TIMEOUT || 15000),
            requestTimeout: Number(process.env.DB_REQUEST_TIMEOUT || 60000),
          }).connect();
          return pool;
        } catch (e) {
          throw new Error(`Falha ao conectar no MSSQL: ${e.message}`);
        }
      }

      function bindParams(req, params) {
        if (!params) return;
        if (Array.isArray(params)) {
          for (const p of params) {
            const { name, type, value } = p;
            if (!name) continue;
            const t = typeof type === 'string' ? sql[type] : type;
            t ? req.input(name, t, value) : req.input(name, value);
          }
        } else if (typeof params === 'object') {
          for (const [name, value] of Object.entries(params)) {
            req.input(name, value);
          }
        }
      }

      function normalize(input) {
        if (typeof input === 'string') return { sqlText: input, params: undefined };
        if (input && typeof input === 'object') {
          const sqlText = input.sql || input.query;
          return { sqlText, params: input.params };
        }
        return { sqlText: undefined, params: undefined };
      }

      async function runQuery(input) {
        const { sqlText, params } = normalize(input);
        if (!sqlText) throw new Error("db:exec requer objeto { sql|query, params? } ou string SQL");

        const p = await getPool();
        const req = p.request();
        req.multiple = true;

        bindParams(req, params);

        if (toBool(process.env.DB_LOG_SQL, false)) {
          console.log('[DB] Executando SQL:\n', sqlText);
          if (params) console.log('[DB] Params:', params);
        }

        const result = await req.query(sqlText);

        return {
          rowsAffected: result.rowsAffected,
          recordset: result.recordset || [],
          recordsets: result.recordsets || [],
        };
      }

      on('task', {
        async queryDb(input) {
          const out = await runQuery(input);
          return out.recordset; // compat: primeiro recordset
        },
        async 'db:exec'(input = {}) {
          return runQuery(input);
        },
      });

      process.on('exit', async () => {
        try { if (pool) await pool.close(); } catch {}
      });

      return config;
    },

    defaultCommandTimeout: 60000,
    pageLoadTimeout: 60000,
    testIsolation: true,
    chromeWebSecurity: false,
    // viewportWidth: 1366,
    // viewportHeight: 768,
  },

  video: true,
  screenshotOnRunFailure: false,
});
