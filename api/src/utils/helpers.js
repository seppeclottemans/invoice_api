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
    if(isNaN(invoiceNumber) || typeof invoiceNumber === "object"){
      return [400 , "The reference needs to be an integer. It can not contain any letters."];
   }

   if(invoiceNumber < 0){
    return [400 , "The reference can not be negative."];
  }
    
      // Apply the modulo 97 to the invoice number / reference.
      invoiceNumber = BigInt(invoiceNumber) % BigInt(97);
      //The european ref number is prefixed by RF as an identifier.
      //R = 27
      //F = 15
      //Next add the translated character digits to the end of the reference followed by '00'.
      //Apply modulo 97 again and subtract the result from 98
      let checkDigits =  BigInt(98) - (BigInt(invoiceNumber + "271500") % BigInt(97));
      //This result gives you the check digits.
      if (checkDigits == 0) {
          //We always need check digits so if they are 0 we use '00' as check digits.
          return [200, "00"];
      } else if (checkDigits < 10) {
          //We always need 2 digits so if the check digits are smaller then 10 we prepend a '0'.
          return [200, "0" +  checkDigits];
      } else {
          return [200, checkDigits.toString()];
      }
  }
}

module.exports = Helpers