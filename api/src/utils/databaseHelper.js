const expectedParameters = [{name: 'reference_number', type: 'string'},
        {name: 'business_name', type: 'string'},
        {name: 'client_name', type: 'string'},
        {name: 'amount_total', type: 'number'},
        {name: 'invoice_number', type: 'number'},
        {name: 'due_date', type: 'date'},
        {name: 'type_id', type: 'number'}];

const databaseHelpers = {
    checkInvoiceParameters: (parameters) => {

        // check if all required parameters are given.
        for (let i = 0; i < expectedParameters.length; i++) {
            if(!parameters.hasOwnProperty(expectedParameters[i].name)) {
                return [false, `missing parameter ${expectedParameters[i].name}`]
            }
        }

        return [true]
     },

     checkInvoiceParametertypes: (parameters) => {
        for (const parameter in parameters) {
            const expectedParameter = expectedParameters.find(expectedParameter => {return expectedParameter.name == parameter });

            // check if parameters have the right type
            if(expectedParameter.type == 'number' && isNaN(parameters[parameter])){
                return [false, `parameter ${parameter} must be numeric`]
            }else if(expectedParameter.type == 'date' && !databaseHelpers.isValidDate(parameters[parameter])){
                return [false, `parameter ${parameter} must be a valid date`]
            }
        }

        return [true]
     },

     isValidDate: (dateString) => {
        // source: https://stackoverflow.com/questions/18758772/how-do-i-validate-a-date-in-this-format-yyyy-mm-dd-using-jquery
        var regEx = /^\d{4}-\d{2}-\d{2}$/;
        if(!dateString.match(regEx)) return false;  // Invalid format
        var d = new Date(dateString);
        var dNum = d.getTime();
        if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
        return d.toISOString().slice(0,10) === dateString;
      }
  
  }
  
  module.exports = databaseHelpers