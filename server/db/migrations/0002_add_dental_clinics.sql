-- Create dental_clinics table
CREATE TABLE IF NOT EXISTS dental_clinics (
  id SERIAL PRIMARY KEY,
  clinic_name TEXT NOT NULL,
  doctor_name TEXT,
  address TEXT,
  city TEXT,
  pin_code TEXT,
  state TEXT,
  mobile_number TEXT,
  phone_number TEXT,
  email TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_dental_clinics_city ON dental_clinics(city);
CREATE INDEX IF NOT EXISTS idx_dental_clinics_state ON dental_clinics(state);
CREATE INDEX IF NOT EXISTS idx_dental_clinics_pin_code ON dental_clinics(pin_code);
