const supertest = require('supertest');
const http = require('http');

const app = require('../../server.js');
const request = supertest(app);

let validInvoice = {
    reference_number: "RF0812318152",
    business_name: "seppe corp",
    client_name: "google",
    amount_total: "58054600",
    invoice_number: 1,
    due_date: "2022-01-05",
    type_id: "2"
}

// create and get a invoice record
describe('add record to the invoices table and retrieve that record', () => {

    it('add and retrieve invoice', async (done) => {

        const invoiceNumber = Math.floor(Math.random() * 100000);

        // create invoice
        validInvoice.invoice_number = invoiceNumber;
        const createInvoiceResponce = await request.post('/create-invoice').send(validInvoice);


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


// invalid create and get a invoice record requests.
describe('try to create invalid invoices', () => {

    test('add and retrieve invoice', async (done) => {

        const invoiceNumber = Math.floor(Math.random() * 100000);
        let invalidInvoice = {
            reference_number: "RF0812318152",
            business_name: "seppe corp",
            client_name: "google",
            amount_total: "58054600",
            invoice_number: invoiceNumber,
            due_date: "2022-01-05",
            type_id: "100"
        };

        // try to create invoice with invalid type_id.
        let createInvoiceResponce = await request.post('/create-invoice').send(invalidInvoice);

        expect(createInvoiceResponce.text).toStrictEqual('invalid type_id.');


        // try to create invoice with invalid date.
        invalidInvoice.type_id = "3";
        invalidInvoice.due_date = "2022-01-40";
        createInvoiceResponce = await request.post('/create-invoice').send(invalidInvoice);

        expect(createInvoiceResponce.text).toStrictEqual('parameter due_date must be a valid date');

        done()

    });

    // try to create a second invoice with an invoice number which already exists.
    test('try to create a dubble invoice', async (done) => {

        const invoiceNumber = Math.floor(Math.random() * 100000);

        validInvoice.invoice_number = invoiceNumber;
        let createInvoiceResponce = await request.post('/create-invoice').send(validInvoice);

        if (createInvoiceResponce.status == 400) {
            // invoice already existed
            expect(createInvoiceResponce.text).toStrictEqual("invoice with this invoice number already exists");
        } else {
            // new invoice created
            expect(createInvoiceResponce.text).toStrictEqual("invoice created succesfully.");
            expect(createInvoiceResponce.status).toStrictEqual(202);
        }

        createInvoiceResponce = await request.post('/create-invoice').send(validInvoice);
        expect(createInvoiceResponce.text).toStrictEqual("invoice with this invoice number already exists");
        expect(createInvoiceResponce.status).toStrictEqual(400);

        done()

    });

    
})