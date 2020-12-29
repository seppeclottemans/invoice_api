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

app.get('/get-check-digits/:reference', (req, res) => {
  let result = Helpers.getCheckDigits(req.params.reference);
  res.status(result[0]);
  res.send(result[1]);
})

app.get('/validate/:reference/:checkDigits', (req, res) => {
  const result = Helpers.validateReferenceNumber(req.params.reference, req.params.checkDigits);
  if(result){
    res.send(result);
  }else{
    res.send("invalid reference number.");
  }
})

async function initialiseTables() {
  await pg.schema.hasTable('invoices').then(async (exists) => {
    if (!exists) {
      await pg.schema
        .createTable('invoices', (table) => {
          table.increments();
          table.timestamps(true, true);
        })
        .then(async () => {
          console.log('created table invoices');
        });

    }
  });
}
initialiseTables();

module.exports = app;