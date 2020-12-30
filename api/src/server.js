const express = require('express')
const bodyParser = require('body-parser');
const http = require('http');
const Helpers = require('./utils/helpers.js')
const port = 3000


const pg = require('knex')({
  client: 'pg',
  version: '9.6',      
  searchPath: ['knex', 'public'],
  connection: process.env.PG_CONNECTION_STRING ? process.env.PG_CONNECTION_STRING : 'postgres://example:example@localhost:5432/invoice_api_db'
});


const app = express();
http.Server(app); 


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);  

app.get('/test', (req, res) => {
  res.status(200).send();
})


async function initialiseTables() {
  await pg.schema.hasTable('invoices').then(async (exists) => {
    if (!exists) {
      await pg.schema
        .createTable('invoices', (table) => {
          table.increments();
          table.string('buisiness_name');
          table.string('client_name');
          table.bigInteger('amount_total');
          table.bigInteger('invoice_number');
          table.date('due_date');
          table.integer('type_id');
          table.timestamps(true, true);
        })
        .then(async () => {
          console.log('created table invoices');
        });
    }
  });

  await pg.schema.hasTable('invoice_types').then(async (exists) => {
    if (!exists) {
      await pg.schema
        .createTable('invoices', (table) => {
          table.increments();
          table.string('name');
          table.timestamps(true, true);
        })
        .then(async () => {
          console.log('created table invoice_types');
        });
    }
  });
}
initialiseTables();

module.exports = app;