# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2021-01-15

### Added

- End to end test of the API.

### Fixed

- Mistakes in endpoints documentation fixed.
- Compares json response after delete invoice instead of text response. 

## [2.0.0] - 2021-01-15

### Added

- Fully working api endpoint to store an invoice in the database.
- Fully working api endpoint to get an invoice from the database by its invoice number.
- Fully working api endpoint to update an invoice in the database.
- Fully working api endpoint to delete an invoice in the database.
- Integration tests for the: create-invoice, get-by-invoice-number, update-invoice and delete-invoice endpoints. 
- Documentation for each of these enpoints.

## [1.4.0] - 2021-01-15

### Added

- Delete-invoice api endpoint.
- Integration tests for the delete-invoice api endpoint.
- Integration test for trying to update an unexisting invoice.
- Documentation for the delete-invoice api endpoint.

## [1.3.1] - 2021-01-15

### Fixed

- Succesfully creating an invoice returns status code 201 instead of 202.

## [1.3.0] - 2021-01-15

### Added

- update-invoice api endpoint.

### Fixed

- amount_total changed in database from a bigInteger to a double.
- Retrieve dates in correct format from database.
- Integration tests for the update-invoice api endpoint.

## [1.2.3] - 2021-01-14

### Added

- Integration tests for the update-invoice api endpoint.

## [1.2.2] - 2021-01-12

### Added

- Integration tests for the create-invoice api endpoint.
- Integration tests for the get-by-invoice-number api endpoint.

### Fixed

- ci pipeline doesn't run integration tests.

## [1.2.1] - 2021-01-12

### Added

- documentation for each function added containing: a description of what the function or endpoint does, all needed parameters and expected types and what the function or endpoint returns.
- missing indentations.

### Fixed

- fixed mistake in readme file.

## [1.2.0] - 2021-01-05

### Added

- Fully working api endpoint to get invoices by invoice number.
- Documentation for the create and get invoice endpoints.

## [1.1.1] - 2021-01-01

### Added

- Check if invoice doesn't already exists before creation.
- Check if invoice type id exists. 

## [1.1.0] - 2020-12-30

### Added

- Fully working api endpoint to store an invoince in the database.
- Parameter validation functions for the create invoice api endpoint.
- Unit tests for the Parameter validation functions in the databaseHelper file.
- Database structure on project build.
- invoice_types table automaticlly filled on build.

## [1.0.0] - 2020-12-30

### Description

- Fully working api endpoint to validate a reference number.
- Fully working api endpoint to get check digits from a reference.
- Unit tests for each of these helper functions. 

## [0.1.2] - 2020-12-30

### Added

- Fully working api endpoint to validate a reference number.
- Unit tests for the Helper function to validate a reference number.

## [0.1.1] - 2020-12-29

### Fixed

- Fixed a bug that when the number was too big the check digits would be incorrect.

## [0.1.0] - 2020-12-29

### Added

- Fully working api endpoint to get check digits from a reference.

## [0.0.2] - 2020-12-29

### Added

- Unit tests for the Helper function to get check digits from a reference.

## [0.0.1] - 2020-12-28

### Added

- API endpoint to get check digits from a reference.
- Helper function to get check digits from a reference.
