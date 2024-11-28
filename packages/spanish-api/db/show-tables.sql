SELECT 
    TABLE_NAME as 'Table Name',
    TABLE_ROWS as 'Rows',
    CREATE_TIME as 'Created',
    UPDATE_TIME as 'Last Updated'
FROM 
    information_schema.tables 
WHERE 
    table_schema = DATABASE() AND
    TABLE_TYPE = 'BASE TABLE'
ORDER BY 
    TABLE_NAME;

-- Also show table structures
SELECT CONCAT('Table: ', TABLE_NAME, '\n',
       GROUP_CONCAT(
           CONCAT('- ', COLUMN_NAME, ' (', COLUMN_TYPE, 
                 CASE WHEN IS_NULLABLE = 'NO' THEN ' NOT NULL' ELSE '' END,
                 CASE WHEN COLUMN_KEY = 'PRI' THEN ' PRIMARY KEY' 
                      WHEN COLUMN_KEY = 'UNI' THEN ' UNIQUE'
                      WHEN COLUMN_KEY = 'MUL' THEN ' INDEX'
                      ELSE '' END,
                 ')'
           ) 
           ORDER BY ORDINAL_POSITION
       )
) as 'Table Structure'
FROM information_schema.columns
WHERE table_schema = DATABASE()
GROUP BY TABLE_NAME; 