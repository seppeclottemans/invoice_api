const supertest = require('supertest');
const http = require('http');

const app = require('../server.js');
const request = supertest(app);

// randomly select an invoice number.
const invoiceNumber = Math.floor(Math.random() * 100000);

let invoice = {
    reference_number: "",
    business_name: "seppe corp",
    client_name: "google",
    amount_total: "58054600",
    invoice_number: invoiceNumber,
    due_date: "2022-01-05",
    type_id: "8"
}

// RF546017710223

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

})