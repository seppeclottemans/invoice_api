const databaseHelpers = {
    checkInvoiceParameters: (parameters) => {
        const expectedParameters = ['reference_number', 'buisiness_name', 'client_name', 'amount_total', 'invoice_number', 'due_date', 'type_id'];

        // check if all required parameters are given.
        for (let i = 0; i < expectedParameters.length; i++) {
            if(!parameters.hasOwnProperty(expectedParameters[i])) {
                return [false, `missing parameter ${expectedParameters[i]}`]
            }
        }

        return [true]
     },

     checkInvoiceParametertypes: (parameters) => {
         return true;
     }
  
  }
  
  module.exports = databaseHelpers