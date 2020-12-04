const {v1: uuidv1 } = require('uuid');
const { validate : uuidValidate }  = require('uuid');

const Helpers = {
  generateUUID: () => {
     const uuid = uuidv1();  
     return uuid;
  },

  checkValidUuid: (uuid) => {
    return uuidValidate(uuid)
  }
}

module.exports = Helpers