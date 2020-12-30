const databaseHelpers = require('../utils/databaseHelper');

// invoice parameter check tests
describe('valid parameters should return true', () => {
    
    const parameters = {
        reference_number: 'RF0812318152',
        buisiness_name: 'seppe corp',
        client_name: 'google',
        amount_total:'10000',
        invoice_number:'100',
        due_date: '2000-01-02',
        type_id:'2'}

    // checkInvoiceParameters function tests
    test('valid parameters return true', () => {
        expect(databaseHelpers.checkInvoiceParameters(parameters)).toStrictEqual([true]);
    });

    // checkInvoiceParametertypes function tests
    test('valid parameters return true', () => {
        expect(databaseHelpers.checkInvoiceParametertypes(parameters)).toStrictEqual([true]);
        parameters.amount_total = '100.01';
        expect(databaseHelpers.checkInvoiceParametertypes(parameters)).toStrictEqual([true]);
    });

});


describe('invalid parameters should return false with error message', () => {
    
    let parameters = {
        reference_number: 'RF0812318152',
        buisiness_name: 'seppe corp',
        client_name: 'google',
        amount_total:'10000',
        due_date: '2000-01-02',
        type_id:'2'}

    // checkInvoiceParameters function tests
    test('invalid parameters return false', () => {
        expect(databaseHelpers.checkInvoiceParameters(parameters)).toStrictEqual([false, "missing parameter invoice_number"]);
    });

    // checkInvoiceParametertypes function tests
    test('invalid parameters return false', () => {
        parameters.invoice_number = 'aza'
        expect(databaseHelpers.checkInvoiceParametertypes(parameters)).toStrictEqual([false, 'parameter invoice_number must be numeric']);
        parameters.invoice_number = '100';
        
        
        parameters.amount_total = '100k';
        expect(databaseHelpers.checkInvoiceParametertypes(parameters)).toStrictEqual([false, 'parameter amount_total must be numeric']);
        parameters.amount_total = '100';

        // tests validate date
        parameters.due_date = 'fdfs';
        expect(databaseHelpers.checkInvoiceParametertypes(parameters)).toStrictEqual([false, "parameter due_date must be a valid date"]);

        parameters.due_date = '20-02-2020';
        expect(databaseHelpers.checkInvoiceParametertypes(parameters)).toStrictEqual([false, "parameter due_date must be a valid date"]);

        parameters.due_date = '20-13-2019';
        expect(databaseHelpers.checkInvoiceParametertypes(parameters)).toStrictEqual([false, "parameter due_date must be a valid date"]);
    });

});