const Helpers = require('./../utils/helpers');

describe('check if uuid is valid', () => {

    test('check if string is given', () => {
        expect(Helpers.checkValidTitle()).toBeFalsy();
        expect(Helpers.checkValidTitle(null)).toBeFalsy();
        expect(Helpers.checkValidTitle(10)).toBeFalsy();
        expect(Helpers.checkValidTitle({})).toBeFalsy();
        expect(Helpers.checkValidTitle([])).toBeFalsy();
    });
    
    test('string must be a valid uuid', () => {
        expect(Helpers.checkValidUuid('This is not a valid uuid')).toBeFalsy();
    });

    test('valid uuid should return true', () => {
        expect(Helpers.checkValidUuid('ef73e7b0-2fec-11eb-988f-77262bbf5d7e')).toBe(true);
        expect(Helpers.checkValidUuid('31c30b40-2fee-11eb-b22a-ebac5daea745')).toBe(true);
    });

})