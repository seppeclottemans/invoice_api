const supertest = require('supertest');
const http = require('http');

const app = require('../../server.js');
const request = supertest(app);

// randomly select an invoice number.
const invoiceNumber = Math.floor(Math.random() * 100000);

// create and update invoice
describe('create and update invoice check if invoice updates succesfully', () => {

    let invoice = {
        reference_number: "RF0812318152",
        business_name: "seppe corp",
        client_name: "google",
        amount_total: "58054600",
        invoice_number: invoiceNumber,
        due_date: "2022-01-05",
        type_id: "2"
    }

    test('create and update invoice', async (done) => {

        // create invoice
        const createInvoiceResponce = await request.post('/create-invoice').send(invoice);

        if (createInvoiceResponce.status == 400) {
            // invoice already existed
            expect(createInvoiceResponce.text).toStrictEqual("invoice with this invoice number already exists");
        } else {
            // new invoice created
            expect(createInvoiceResponce.text).toStrictEqual("invoice created succesfully.");
            expect(createInvoiceResponce.status).toStrictEqual(201);
        }


        // update invoice
        invoice.reference_number = "RF065496842634654"
        invoice.business_name = "new seppe corp"
        invoice.client_name = "microsoft"
        invoice.amount_total = 10000000.01
        invoice.due_date = "2025-02-20"
        invoice.type_id = 5
        const updateInvoiceResponce = await request.put(`/update-invoice/${invoiceNumber}`).send(invoice);

        expect(updateInvoiceResponce.text).toStrictEqual("invoice updated succesfully.");
        expect(updateInvoiceResponce.status).toStrictEqual(200);

        done();

    });

    test('get updated invoice', async (done) => {

        // get invoice
        const getInvoiceResponse = await request.get(`/get-by-invoice-number/${invoiceNumber}`);

        expect(getInvoiceResponse.status).toStrictEqual(200);

        // check if invoice was actually updated.
        expect(getInvoiceResponse.body.invoice.reference_number).toStrictEqual(invoice.reference_number);
        expect(getInvoiceResponse.body.invoice.business_name).toStrictEqual(invoice.business_name);
        expect(getInvoiceResponse.body.invoice.client_name).toStrictEqual(invoice.client_name);
        expect(getInvoiceResponse.body.invoice.amount_total).toStrictEqual(invoice.amount_total);
        expect(getInvoiceResponse.body.invoice.due_date).toStrictEqual(invoice.due_date);
        expect(getInvoiceResponse.body.invoice.type_id).toStrictEqual(invoice.type_id);
        expect(parseInt(getInvoiceResponse.body.invoice.invoice_number)).toStrictEqual(invoice.invoice_number);
        done();

    });

})

// check if invalid update requests fail.
describe('invalid update requests should fail', () => {

    test('try update with missing parameters', async (done) => {

        let updateInvoiceResponce = await request.put(`/update-invoice/${invoiceNumber}`).send({
            reference_number: "RF0812318152",
            business_name: "seppe corp",
            client_name: "google",
            invoice_number: invoiceNumber,
            due_date: "2022-01-05",
            type_id: 6
        });

        expect(updateInvoiceResponce.status).toStrictEqual(400);
        expect(updateInvoiceResponce.text).toStrictEqual('missing parameter amount_total');

        updateInvoiceResponce = await request.put(`/update-invoice/${invoiceNumber}`).send({
            reference_number: "RF0812318152",
            business_name: "seppe corp",
            amount_total: "58054600.01",
            client_name: "google",
            invoice_number: invoiceNumber,
            type_id: 6
        });

        expect(updateInvoiceResponce.status).toStrictEqual(400);
        expect(updateInvoiceResponce.text).toStrictEqual('missing parameter due_date');

        done();

    });

    test('try update with invalid parameters', async (done) => {

        let updateInvoiceResponce = await request.put(`/update-invoice/${invoiceNumber}`).send({
            reference_number: "RF0812318152",
            business_name: "seppe corp",
            client_name: "google",
            amount_total: 100000.05,
            invoice_number: invoiceNumber,
            due_date: "2050-01-35",
            type_id: 6
        });

        expect(updateInvoiceResponce.status).toStrictEqual(400);
        expect(updateInvoiceResponce.text).toStrictEqual('parameter due_date must be a valid date');

        updateInvoiceResponce = await request.put(`/update-invoice/${invoiceNumber}`).send({
            reference_number: "RF0812318152",
            business_name: "seppe corp",
            client_name: "google",
            amount_total: 100000.05,
            invoice_number: invoiceNumber,
            due_date: "2050-01-10",
            type_id: 205
        });

        expect(updateInvoiceResponce.status).toStrictEqual(400);
        expect(updateInvoiceResponce.text).toStrictEqual('invalid type_id.');

        done();
    });

})


// delete invoice tests

// succesfully delete an invoice from the database.
describe('calling a delete on an existing invoice should succesfully delete the invoice from the database.', () => {

    const newInvoiceNumber = 10000000;

    test('create and delete an invoice.', async (done) => {

        // create invoice
        const invoice = {
            reference_number: "RF0812318152",
            business_name: "seppe corp",
            client_name: "google",
            amount_total: "58054600",
            invoice_number: newInvoiceNumber,
            due_date: "2022-01-05",
            type_id: "2"
        }
    
        const createInvoiceResponce = await request.post('/create-invoice').send(invoice);

        if (createInvoiceResponce.status == 400) {
            // invoice already existed
            expect(createInvoiceResponce.text).toStrictEqual("invoice with this invoice number already exists");
        } else {
            // new invoice created
            expect(createInvoiceResponce.text).toStrictEqual("invoice created succesfully.");
            expect(createInvoiceResponce.status).toStrictEqual(201);
        }

        // delete the invoice
        const deleteInvoiceResponce = await request.delete(`/delete-invoice/${newInvoiceNumber}`);

        expect(deleteInvoiceResponce.status).toStrictEqual(200);
        expect(deleteInvoiceResponce.text).toStrictEqual("invoice deleted succesfully.");

        done();

    });

    // deleted invoice should be empty
    test('try to get deleted invoice.', async (done) => {

        const getInvoiceResponse = await request.get(`/get-by-invoice-number/${newInvoiceNumber}`);

        // check if response is empty
        expect(getInvoiceResponse.status).toStrictEqual(200);
        expect(getInvoiceResponse.body).toStrictEqual({});
        expect(Object.keys(getInvoiceResponse.body).length).toStrictEqual(0);
        expect(getInvoiceResponse.body.constructor).toStrictEqual(Object);

        done();

    });

});



// check if invalid delete-invoice requests fail.
describe('invalid delete requests should fail', () => {

    test('try delete an invoice with invalid invoice number', async (done) => {

        let deleteInvoiceResponce = await request.delete(`/delete-invoice/{}`);

        expect(deleteInvoiceResponce.status).toStrictEqual(400);
        expect(deleteInvoiceResponce.text).toStrictEqual("invoiceNumber parameter needs to be a number");

        deleteInvoiceResponce = await request.delete(`/delete-invoice/azsdq`);

        expect(deleteInvoiceResponce.status).toStrictEqual(400);
        expect(deleteInvoiceResponce.text).toStrictEqual("invoiceNumber parameter needs to be a number");

        deleteInvoiceResponce = await request.delete(`/delete-invoice/[]`);

        expect(deleteInvoiceResponce.status).toStrictEqual(400);
        expect(deleteInvoiceResponce.text).toStrictEqual("invoiceNumber parameter needs to be a number");


        done();
    });

})


// check if invalid update requests fail.
describe('update on non existing invoice should fail.', () => {

    test('try to update a non existing invoice.', async (done) => {

        const newInvoiceNumber = 12345678;

        // create invoice
        const invoice = {
            reference_number: "RF0812318152",
            business_name: "seppe corp",
            client_name: "google",
            amount_total: "58054600",
            invoice_number: newInvoiceNumber,
            due_date: "2022-01-05",
            type_id: "2"
        }
    
        const createInvoiceResponce = await request.post('/create-invoice').send(invoice);

        if (createInvoiceResponce.status == 400) {
            // invoice already existed
            expect(createInvoiceResponce.text).toStrictEqual("invoice with this invoice number already exists");
        } else {
            // new invoice created
            expect(createInvoiceResponce.text).toStrictEqual("invoice created succesfully.");
            expect(createInvoiceResponce.status).toStrictEqual(201);
        }

        // first delete the invoice
        const deleteInvoiceResponce = await request.delete(`/delete-invoice/${newInvoiceNumber}`);

        expect(deleteInvoiceResponce.status).toStrictEqual(200);
        expect(deleteInvoiceResponce.text).toStrictEqual("invoice deleted succesfully.");

        // try to update the invoice
        const updateInvoiceResponce = await request.put(`/update-invoice/${newInvoiceNumber}`).send(invoice);

        expect(updateInvoiceResponce.text).toStrictEqual('An invoice with this invoice number does not exist.');
        expect(updateInvoiceResponce.status).toStrictEqual(400);


        done();

    });

});