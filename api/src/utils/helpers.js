const {v1: uuidv1 } = require('uuid');
const { validate : uuidValidate }  = require('uuid');

const Helpers = {
  generateUUID: () => {
     const uuid = uuidv1();  
     return uuid;
  },

  checkValidUuid: (uuid) => {
    return uuidValidate(uuid)
  },

  getCheckDigits(invoiceNumber)
  {
      // Apply the modulo 97 to the invoice number / reference.
      invoiceNumber = invoiceNumber % 97;
      //The european ref number is prefixed by RF as an identifier.
      //R = 27
      //F = 15
      //Next add the translated character digits to the end of the reference followed by '00'.
      //Apply modulo 97 again and subtract the result from 98
      let checkDigits = 98 - (parseInt(invoiceNumber + "271500") % 97);
      //This result gives you the check digits.
      if (checkDigits == 0) {
          //We always need check digits so if they are 0 we use '00' as check digits.
          return "00";
      } else if (checkDigits < 10) {
          //We always need 2 digits so if the check digits are smaller then 10 we prepend a '0'.
          return "0" +  checkDigits;
      } else {
          return checkDigits.toString();
      }
  }
}

module.exports = Helpers