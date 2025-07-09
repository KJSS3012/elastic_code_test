-- Script SQL para verificar os tipos das colunas
SELECT 
    table_name, 
    column_name, 
    data_type, 
    udt_name 
FROM information_schema.columns 
WHERE table_name IN ('farmer', 'property', 'property_crop_harvest') 
AND column_name LIKE '%id%'
ORDER BY table_name, column_name;
