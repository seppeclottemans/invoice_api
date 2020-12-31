const express = require('express')
const bodyParser = require('body-parser');
const http = require('http');
const Helpers = require('./utils/helpers.js');
const databaseHelpers = require('./utils/databaseHelper.js');
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

app.get('/validate/:referenceNumber/:checkDigits', (req, res) => {
  const result = Helpers.validateReferenceNumber(req.params.referenceNumber, req.params.checkDigits);
  if(result){
    res.send(result);
  }else{
    res.send("invalid reference number.");
  }
})


// database
app.post('/create', async (req, res) => {
  // check if all parameters are given.
  const parameterGivenCheck = databaseHelpers.checkInvoiceParameters(req.body);

  if(parameterGivenCheck[0]){
    // check if parameters have the right types
    const parametersTypeCheck = databaseHelpers.checkInvoiceParametertypes(req.body)
    if(parametersTypeCheck[0]){
      const uuid = Helpers.generateUUID();
      await pg
      .table('invoices')
      .insert({uuid,
        reference_number: req.body.reference_number,
        buisiness_name: req.body.buisiness_name,
        client_name: req.body.client_name,
        amount_total: req.body.amount_total,
        invoice_number: req.body.invoice_number,
        due_date: req.body.due_date,
        type_id: req.body.type_id
      })
      res.status(202).send('invoice created succesfully.'); 
    }else{
      res.status(400).send(parametersTypeCheck[1]);
    }
  }else{
    res.status(400).send(parameterGivenCheck[1]);
  }
})

async function initialiseTables() {
  await pg.schema.hasTable('invoices').then(async (exists) => {
    if (!exists) {
      await pg.schema
        .createTable('invoices', (table) => {
          table.increments();
          table.uuid('uuid');
          table.string('reference_number');
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
        .createTable('invoice_types', (table) => {
          table.increments();
          table.string('name');
          table.timestamps(true, true);
        })
        .then(async () => {
          console.log('created table invoice_types');
          await pg.table('invoice_types').insert([{ name: 'Standard invoice' }, 
            { name: 'Credit invoice' },
            { name: 'Expence report' },
            { name: 'Debit invoice' },
            { name: 'Mixed invoice' },
            { name: 'Commercial invoice' },
            { name: 'Timesheet invoice' },
            { name: 'Pro forma invoice' },
            { name: 'Intrim invoice' },
            { name: 'Final invoice' },
            { name: 'Past due invoice' },
            { name: 'Recurring invoice' },
            { name: 'E-invoice' }
          ])
        });
    }
  });
}
initialiseTables();

module.exports = app;