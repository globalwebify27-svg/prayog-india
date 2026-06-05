-- Add from_date, to_date, and institute_name columns to certificates table
-- Run this migration on your database before using these features

ALTER TABLE certificates 
  ADD COLUMN from_date DATE DEFAULT NULL AFTER qr_code_data, 
  ADD COLUMN to_date DATE DEFAULT NULL AFTER from_date,
  ADD COLUMN institute_name VARCHAR(255) DEFAULT NULL AFTER to_date;
