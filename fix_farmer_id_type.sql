-- Fix the farmer_id column type in the properties table
-- Change from citext to uuid

BEGIN;

-- First, let's see the current structure
\d properties;

-- Add a temporary uuid column
ALTER TABLE properties ADD COLUMN farmer_id_uuid uuid;

-- Update the new column with converted values
UPDATE properties SET farmer_id_uuid = farmer_id::uuid WHERE farmer_id IS NOT NULL;

-- Drop the old column
ALTER TABLE properties DROP COLUMN farmer_id;

-- Rename the new column to the original name
ALTER TABLE properties RENAME COLUMN farmer_id_uuid TO farmer_id;

-- Add back any constraints if needed
-- ALTER TABLE properties ADD CONSTRAINT fk_properties_farmer_id FOREIGN KEY (farmer_id) REFERENCES farmers(id);

COMMIT;

-- Verify the change
\d properties;
