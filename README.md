# invoice_api

## What does it do?
This is an API which helps you to create European invoices.
- This API can generate check digits with a given reference (invoice number).
- It can validate a refence number by using the checkdigits.
- It can store, retrieve, update and delete invoice data.

## Getting Started
### Install

1. open the terminal at the api folder
2. run `npm install`

### Run docker container

1. open the terminal
2. run `docker-compose up`

## API endpoints

### Request

`GET /get-check-digits/:reference`
    
    http://localhost:3000/get-check-digits/reference

| Parameter | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `reference` | `integer` | **Required**. A invoice reference | 5496842634654

### Response

    check digits
    example: 06



### Request

`GET /validate/:referenceNumber/:checkDigits`
    
    http://localhost:3000/referenceNumber/checkDigits

| Parameters | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `referenceNumber` | `string` | **Required**. A invoice reference number | RF53810888428933129078686
| `checkDigits` | `integer` | **Required**. check digits of the refrence number | 53

### Response

    returns true if refrence number and check digits are valid.
    if invalid it returns: "invalid reference number."





### Request

`POST /create-invoice`
    
    http://localhost:3000/create-invoice

| Parameters | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `reference_number` | `string` | **Required**. A invoice reference number | RF0812318152
| `buisiness_name` | `string` | **Required**. Your business name | My business
| `client_name` | `string` | **Required**. Your client name | Google
| `amount_total` | `number` | **Required**. Total payment amunt | 1001.02
| `invoice_number` | `integer` | **Required**. The uniqe number of your invoice | 1002
| `due_date` | `date` | **Required**. The due date of the invoice format: yyyy-mm-dd | 2021-08-01
| `type_id` | `integer` | **Required**. The type id of your invoice see type id's in availeble invoice types. | 2

### Response

    returns status code 201 and message 'invoice created succesfully.' if request was send succesfully.
    if invalid it returns status code 400 and a message explaining whats wrong.    



### Request

`GET /get-by-invoice-number/:invoiceNumber`
    
    http://localhost:3000/get-by-invoice-number/invoiceNumber

| Parameters | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `invoiceNumber` | `integer` | **Required**. The uniqe number of your invoice | 1002

### Response

    returns the data of the invoice in json format
    example response:

```javascript
{
    "invoice": {
        "id": 1,
        "uuid": "2acb89a0-4f67-11eb-8b3e-0b8e106cdd95",
        "reference_number": "RF0812318152",
        "business_name": "My business",
        "client_name": "google",
        "amount_total": "10000",
        "invoice_number": "1002",
        "due_date": "2000-01-02",
        "type_id": 1,
        "created_at": "2021-01-05T15:03:28.315Z",
        "updated_at": "2021-01-05T15:03:28.315Z"
    }
}
```

### Request

`PUT /update-invoice`
    
    http://localhost:3000/update-invoice/invoiceNumber

| Parameters | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `invoiceNumber` | `integer` | **Required**. The uniqe number of your invoice **(URL param)** | 1002
| `referenceNumber` | `string` | **Required**. A invoice reference number **(Body param)** | RF0812318152
| `buisiness_name` | `string` | **Required**. Your business name **(Body param)** | My business
| `client_name` | `string` | **Required**. Your client name **(Body param)** | Google
| `amount_total` | `number` | **Required**. Total payment amunt **(Body param)** | 1001.02
| `invoice_number` | `integer` | **Required**. The uniqe number of your invoice **(Body param)** | 1002
| `due_date` | `date` | **Required**. The due date of the invoice format: yyyy-mm-dd **(Body param)** | 2021-08-01
| `type_id` | `integer` | **Required**. The type id of your invoice see type id's in availeble invoice types. **(Body param)** | 2

### Response

    returns status code 200 and message 'invoice updated succesfully.' if request was send succesfully.
    if invalid it returns status code 400 and a message explaining whats wrong.  


### Request

`DELETE /delete-invoice/:invoiceNumber`
    
    http://localhost:3000/delete-invoice/invoiceNumber

| Parameters | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `invoiceNumber` | `integer` | **Required**. The uniqe number of the invoice you want to delete. | 1002

### Response

    returns status code 200 and message 'invoice deleted succesfully.' if request was send succesfully.
    if invalid it returns status code 400 and a message explaining whats wrong.  


## Availeble invoice types

| id | name |
| :--- | :--- |
| `Standard invoice` | `1`
| `Credit invoice` | `2`
| `Expence report` | `3`
| `Debit invoice` | `4`
| `Mixed invoice` | `5`
| `Commercial invoice` | `6`
| `Timesheet invoice` | `7`
| `Pro forma invoice` | `8`
| `Intrim invoice` | `9`
| `Final invoice` | `10`
| `Past due invoice` | `11`
| `Recurring invoice` | `12`
| `E-invoice` | `13`

## Where can I find help?
If you have a question you can email me at *seppe.clottemans@student.ehb.be*.
## Project Status
This project is currently **in development**.
## Authors
* Seppe Clottemans
