# TODO

- [ ] Add phone number validation in `api/customers/create/index.js`:
  - [ ] If phone is provided: after normalization ensure it has exactly 11 digits
  - [ ] Ensure it starts with `09`
  - [ ] Return 400 with clear error message when validation fails
- [ ] Update create account logic so validation happens before OTP lookup/account uniqueness checks
- [ ] (After edit) Run a quick Node syntax check / lint (if available)
