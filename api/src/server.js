const express = require('express')
const bodyParser = require('body-parser');
const http = require('http');
const Helpers = require('./utils/helpers.js');
const databaseHelpers = require('./utils/databaseHelper.js');

const types = require('pg').types;
// override parsing date column to Date()
types.setTypeParser(1082, val => val);


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

/**
 * Returns the check digits of the given reference.
 * @param {integer} reference
 * @returns {integer} checkdigits of the given reference
 */
app.get('/get-check-digits/:reference', (req, res) => {
  let result = Helpers.getCheckDigits(req.params.reference);
  res.status(result[0]);
  res.send(result[1]);
})

/**
 * Validates the reference number with the given check digits.
 * @param {string} referenceNumber (invoice number)
 * @param {integer} checkDigits
 * @returns {(boolean|string)} true if valid referenceNumber else string: "invalid reference number."
 */
app.get('/validate/:referenceNumber/:checkDigits', (req, res) => {
  const result = Helpers.validateReferenceNumber(req.params.referenceNumber, req.params.checkDigits);
  if (result) {
    res.send(result);
  } else {
    res.send("invalid reference number.");
  }
})


// database endpoints



/**
 * Creates a new invoice.
 * @param {string} referenceNumber (invoice number)
 * @param {string} buisiness_name
 * @param {string} client_name
 * @param {number} amount_total
 * @param {integer} invoice_number
 * @param {date} due_date
 * @param {integer} type_id
 * @returns {string} returns feedback if invalid requests else returns: "invoice created succesfully."
 */
app.post('/create-invoice', async (req, res) => {
  // check if all parameters are given.
  const parameterGivenCheck = databaseHelpers.checkInvoiceParameters(req.body);

  if (parameterGivenCheck[0]) {
    // check if parameters have the right types
    const parametersTypeCheck = databaseHelpers.checkInvoiceParametertypes(req.body)
    if (parametersTypeCheck[0]) {

      //check if invoice doesn't already exist
      const invoice = await pg.count('invoice_number').from('invoices').where({
        invoice_number: req.body.invoice_number
      })
      if (invoice[0].count == 0) {

        // check if invoice type exists
        const invoiceType = await pg.count('id').from('invoice_types').where({
          id: req.body.type_id
        })
        if (invoiceType[0].count == 1) {
          const uuid = Helpers.generateUUID();
          await pg
            .table('invoices')
            .insert({
              uuid,
              reference_number: req.body.reference_number,
              business_name: req.body.business_name,
              client_name: req.body.client_name,
              amount_total: req.body.amount_total,
              invoice_number: req.body.invoice_number,
              due_date: req.body.due_date,
              type_id: req.body.type_id
            })
          res.status(201).send('invoice created succesfully.');
        } else {
          res.status(400).send('invalid type_id.');
        }

      } else {
        res.status(400).send('invoice with this invoice number already exists');
      }

    } else {
      res.status(400).send(parametersTypeCheck[1]);
    }

  } else {
    res.status(400).send(parameterGivenCheck[1]);
  }
})

/**
 * Gets an invoice by its invoice number.
 * @param {integer} invoiceNumber
 * @returns {(json|string)} json object with the invoice in it. or string with invalid request feedback.
 */
app.get('/get-by-invoice-number/:invoiceNumber', async (req, res) => {
  if (!isNaN(req.params.invoiceNumber)) {
    const invoice = await pg
      .first('*')
      .from('invoices')
      .where({
        invoice_number: req.params.invoiceNumber
      })
    res.json({
      invoice: invoice
    })
  } else {
    res.status(400)
    res.send('invoiceNumber parameter needs to be a number')
  }
})



/**
 * Updates an existing invoice with the new values invoice.
 * Prameters in the URL:
 * @param {integer} invoice_number
 * Body parameters:
 * @param {string} referenceNumber (invoice number)
 * @param {string} buisiness_name
 * @param {string} client_name
 * @param {number} amount_total
 * @param {integer} invoice_number
 * @param {date} due_date
 * @param {integer} type_id
 * @returns {string} returns feedback if invalid requests else returns: "invoice updated succesfully."
 */
app.put('/update-invoice/:invoiceNumber', async (req, res) => {

  if (!isNaN(req.params.invoiceNumber)) {

    // check if all parameters are given.
    const parameterGivenCheck = databaseHelpers.checkInvoiceParameters(req.body);

    if (parameterGivenCheck[0]) {
      // check if parameters have the right types
      const parametersTypeCheck = databaseHelpers.checkInvoiceParametertypes(req.body)
      if (parametersTypeCheck[0]) {

        //check if invoice exists
        const invoice = await pg.count('invoice_number').from('invoices').where({
          invoice_number: req.params.invoiceNumber
        })
        if (invoice[0].count == 1) {

          // check if invoice type exists
          const invoiceType = await pg.count('id').from('invoice_types').where({
            id: req.body.type_id
          })
          if (invoiceType[0].count == 1) {
            await pg
              .table('invoices')
              .where('invoice_number', req.params.invoiceNumber)
              .update({
                reference_number: req.body.reference_number,
                business_name: req.body.business_name,
                client_name: req.body.client_name,
                amount_total: req.body.amount_total,
                due_date: req.body.due_date,
                type_id: req.body.type_id
              })
            res.status(200).send('invoice updated succesfully.');
          } else {
            res.status(400).send('invalid type_id.');
          }

        } else {
          res.status(400).send('An invoice with this invoice number does not exist.');
        }

      } else {
        res.status(400).send(parametersTypeCheck[1]);
      }

    } else {
      res.status(400).send(parameterGivenCheck[1]);
    }
  } else {
    res.status(400).send('invoiceNumber parameter needs to be a number');
  }
})


/**
 * Deletes an invoice by its invoice number.
 * @param {integer} invoiceNumber
 * @returns {string} returns feedback if invalid requests else returns: "invoice deleted succesfully."
 */
app.delete('/delete-invoice/:invoiceNumber', async (req, res) => {
  if (!isNaN(req.params.invoiceNumber)) {
    await pg
      .from('invoices')
      .where({
        invoice_number: req.params.invoiceNumber
      })
      .del()
    res.status(200).send('invoice deleted succesfully.');
  } else {
    res.status(400)
    res.send('invoiceNumber parameter needs to be a number')
  }
})

// create and fill database automatically
async function initialiseTables() {
  await pg.schema.hasTable('invoices').then(async (exists) => {
    if (!exists) {
      await pg.schema
        .createTable('invoices', (table) => {
          table.increments();
          table.uuid('uuid');
          table.string('reference_number');
          table.string('business_name');
          table.string('client_name');
          table.double('amount_total');
          table.bigInteger('invoice_number').unique();
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
          // fill table with different invoice types
          await pg.table('invoice_types').insert([
            { name: 'Standard invoice' }, 
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