const Helpers = require('../utils/helpers');

describe('check if uuid is valid', () => {
    
    test('string must be a valid uuid', () => {
        expect(Helpers.checkValidUuid('This is not a valid uuid')).toBeFalsy();
    });

    test('valid uuid should return true', () => {
        expect(Helpers.checkValidUuid('ef73e7b0-2fec-11eb-988f-77262bbf5d7e')).toBe(true);
        expect(Helpers.checkValidUuid('31c30b40-2fee-11eb-b22a-ebac5daea745')).toBe(true);
    });

});


describe('check if given reference returns valid check digits', () => {
    
    //examples tested on https://www.mobilefish.com/services/creditor_reference/creditor_reference.php
    references = ['5496842634654', '12318152 ', 454, '36524564', 78975, '9875614324'];
    expectedCheckDigits = ['06', '08', '65', '80', '30', '42'];

    test('valid references should return the expected check digits', () => {
        references.forEach(function (reference, i) {
            expect(Helpers.getCheckDigits(reference)).toStrictEqual([200, expectedCheckDigits[i]]);
        });
    });

});

describe('check if given invalid reference returns error status with error message', () => {
    
    // test with letters
    test('invalid reference strings returns error status with error message', () => {
        expect(Helpers.getCheckDigits('4203B224A')).toStrictEqual([400, "The reference needs to be an integer. It can not contain any letters."]);
        expect(Helpers.getCheckDigits('RF47374')).toStrictEqual([400, "The reference needs to be an integer. It can not contain any letters."]);
        expect(Helpers.getCheckDigits('febfjezbf')).toStrictEqual([400, "The reference needs to be an integer. It can not contain any letters."]);
    });

    // test with invalid types
    test('invalid reference types returns error status with error message', () => {
        expect(Helpers.getCheckDigits({})).toStrictEqual([400, "The reference needs to be an integer. It can not contain any letters."]);
        expect(Helpers.getCheckDigits({"test": 12345})).toStrictEqual([400, "The reference needs to be an integer. It can not contain any letters."]);
        expect(Helpers.getCheckDigits([])).toStrictEqual([400, "The reference needs to be an integer. It can not contain any letters."]);
    });

    // test with negative numbers
    test('negative references returns error status with message', () => {
        expect(Helpers.getCheckDigits(-454)).toStrictEqual([400, "The reference can not be negative."]);
        expect(Helpers.getCheckDigits(-12318152)).toStrictEqual([400, "The reference can not be negative."]);
        expect(Helpers.getCheckDigits('-12318152')).toStrictEqual([400, "The reference can not be negative."]);
        expect(Helpers.getCheckDigits('-5496842634654')).toStrictEqual([400, "The reference can not be negative."]);
    });

});