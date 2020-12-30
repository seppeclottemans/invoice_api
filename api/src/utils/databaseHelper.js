const databaseHelpers = {
    checkInvoiceParameters: (parameters) => {
        // check if all required parameters are given.
        if(parameters.hasOwnProperty('reference_number') && 
        parameters.hasOwnProperty('buisiness_name') &&
        parameters.hasOwnProperty('client_name') &&
        parameters.hasOwnProperty('amount_total') &&
        parameters.hasOwnProperty('invoice_number') &&
        parameters.hasOwnProperty('due_date') && 
        parameters.hasOwnProperty('type_id')
        ){
            return true;
        }else{
            return false;
        }
     },
  
  }
  
  module.exports = databaseHelpers