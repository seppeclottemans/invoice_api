const supertest = require('supertest');
const http = require('http');

const app = require('../server.js');
const request = supertest(app);

// randomly select an invoice number.
const invoiceNumber = Math.floor(Math.random() * 100000);
// const invoiceNumber = 10475

let invoice = {
    reference_number: "",
    business_name: "seppe corp",
    client_name: "apple",
    amount_total: 1024851,
    invoice_number: invoiceNumber,
    due_date: "2023-08-15",
    type_id: 8
}

const reference = 6017710223;

let checkDigits = "";
let referenceNumber = "";

describe('get check digits for the given reference and validate the invoice reference number.', () => {

    test('get check digits for the given reference', async (done) => {

        const getCheckDigitsResponce = await request.get(`/get-check-digits/${reference}`);

        expect(getCheckDigitsResponce.status).toStrictEqual(200);

        // return type should be string
        expect(typeof getCheckDigitsResponce.text).toStrictEqual("string");

        // always should return 2 numbers
        expect(getCheckDigitsResponce.text.length).toStrictEqual(2);

        checkDigits = getCheckDigitsResponce.text;

        // reference number consists of RF, the checkdigits and the reference.
        referenceNumber = "RF" + getCheckDigitsResponce.text + reference

        done();

    });

    test('validate if the given reference number is valid with the given checkdigits', async (done) => {

        const validateReferenceNumberResponce = await request.get(`/validate/${referenceNumber}/${checkDigits}`);

        expect(validateReferenceNumberResponce.status).toStrictEqual(200);

        // if valid referenceNumber it should return true.
        expect(typeof validateReferenceNumberResponce.body).toStrictEqual("boolean");
        expect(validateReferenceNumberResponce.body).toStrictEqual(true);

        done();

    });

});

// create/store a new invoice in the database.
describe('Create a new invoice in the database and check if it stored', () => {

    test('delete invoice if there already was one in the database then create a new invoice.', async (done) => {

        const getInvoiceResponse = await request.get(`/get-by-invoice-number/${invoiceNumber}`);

        expect(getInvoiceResponse.status).toStrictEqual(200);
        
        // check if invoice already exists
        if(!Object.keys(getInvoiceResponse.body).length == 0 && getInvoiceResponse.body.constructor == Object){
            // an invoice with this number already exists

            // delete existing invoice
            const deleteInvoiceResponce = await request.delete(`/delete-invoice/${invoiceNumber}`);

            expect(deleteInvoiceResponce.status).toStrictEqual(200);
            expect(deleteInvoiceResponce.text).toStrictEqual('invoice deleted succesfully.');
        }

        // create new invoice
        invoice.invoice_number = invoiceNumber;
        const createInvoiceResponce = await request.post('/create-invoice').send(invoice);

        expect(createInvoiceResponce.text).toStrictEqual("invoice created succesfully.");
        expect(createInvoiceResponce.status).toStrictEqual(201);



        done();
    });

    test('check if invoice was actually stored in the database.', async (done) => {

        // get invoice
        const getInvoiceResponse = await request.get(`/get-by-invoice-number/${invoiceNumber}`);

        expect(getInvoiceResponse.status).toStrictEqual(200);

        // check if the created invoice has all values
        expect(getInvoiceResponse.body.invoice.reference_number).toStrictEqual(invoice.reference_number);
        expect(getInvoiceResponse.body.invoice.business_name).toStrictEqual(invoice.business_name);
        expect(getInvoiceResponse.body.invoice.client_name).toStrictEqual(invoice.client_name);
        expect(getInvoiceResponse.body.invoice.amount_total).toStrictEqual(invoice.amount_total);
        expect(getInvoiceResponse.body.invoice.due_date).toStrictEqual(invoice.due_date);
        expect(getInvoiceResponse.body.invoice.type_id).toStrictEqual(invoice.type_id);
        expect(parseInt(getInvoiceResponse.body.invoice.invoice_number)).toStrictEqual(invoice.invoice_number);


        done();
    });

});