-- Cap wrong OTP guesses. verify-otp increments this and deletes the code at 5.
alter table otp_codes
  add column if not exists attempts integer not null default 0;
