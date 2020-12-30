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
| `reference` | `string` | **Required**. A invoice reference | 5496842634654

### Response

    check digits
    example: 06



### Request

`GET /validate/:referenceNumber/:checkDigits`
    
    http://localhost:3000/referenceNumber/checkDigits

| Parameters | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `referenceNumber` | `string` | **Required**. A invoice reference number | RF53810888428933129078686
| `checkDigits` | `string` | **Required**. check digits of the refrence number | 53

### Response

    returns true if refrence number and check digits are valid.
    if invalid it returns: "invalid reference number."


## Where can I find help?
If you have a question you can email me at *seppe.clottemans@student.ehb.be*.
## Project Status
This project is currently **in development**.
## Authors
* Seppe Clottemans
