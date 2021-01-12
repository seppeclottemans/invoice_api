const supertest = require('supertest');
const http = require('http');

const app = require('../server.js');
const request = supertest(app);

// create and get a invoice record
describe('add record to the invoices table and retrieve that record', () => {



    it('add and retrieve invoice', async (done) => {

        const invoiceNumber = Math.floor(Math.random() * 100000);

        // create invoice
        const createInvoiceResponce = await request.post('/create-invoice').send({
            reference_number: "RF0812318152",
            business_name: "seppe corp",
            client_name: "google",
            amount_total: "58054600",
            invoice_number: invoiceNumber,
            due_date: "2022-01-05",
            type_id: "2"
        })


        if (createInvoiceResponce.status == 400) {
            // invoice already existed
            expect(createInvoiceResponce.text).toStrictEqual("invoice with this invoice number already exists");
        } else {
            // new invoice created
            expect(createInvoiceResponce.text).toStrictEqual("invoice created succesfully.");
            expect(createInvoiceResponce.status).toStrictEqual(202);
        }

        // get invoice
        const invoice = await request.get(`/get-by-invoice-number/${invoiceNumber}`)

        expect(invoice.status).toBe(200);

        // expect the right types of return values
        expect(typeof invoice.body.invoice).toBe('object');
        expect(typeof invoice.body.invoice.reference_number).toBe('string');
        expect(typeof invoice.body.invoice.business_name).toBe('string');
        expect(typeof invoice.body.invoice.client_name).toBe('string');
        expect(typeof invoice.body.invoice.amount_total).toBe('string');
        expect(typeof invoice.body.invoice.invoice_number).toBe('string');
        expect(typeof invoice.body.invoice.due_date).toBe('string');
        expect(typeof invoice.body.invoice.type_id).toBe('number');
        
        // expect the right invoice to return
        expect(BigInt(invoice.body.invoice.invoice_number)).toBe(BigInt(invoiceNumber));

        done()

    });
})