$env:PGPASSWORD='Bienestar25'
& 'C:\Program Files\PostgreSQL\17\bin\psql.exe' -h localhost -U postgres -d postgres -c "CREATE USER erp_user WITH PASSWORD 'erp_password_2025';"
& 'C:\Program Files\PostgreSQL\17\bin\psql.exe' -h localhost -U postgres -d postgres -c "GRANT CONNECT ON DATABASE \"respaldo-sistema-mantenimiento\" TO erp_user;"
& 'C:\Program Files\PostgreSQL\17\bin\psql.exe' -h localhost -U postgres -d 'respaldo-sistema-mantenimiento' -c "GRANT USAGE ON SCHEMA public TO erp_user; GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO erp_user; ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO erp_user;"
Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
Write-Output 'ERP user creation script finished.'
