# PostgreSQL Setup Guide

## Installing PostgreSQL

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### macOS
```bash
brew install postgresql
```

### Windows
Download from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

## Initial Configuration

1. Start the PostgreSQL service:
   - Ubuntu/Debian: `sudo systemctl start postgresql`
   - macOS: `brew services start postgresql`
   - Windows: Start via Services app or pg_ctl

2. Switch to the postgres user and access PostgreSQL:
```bash
sudo -u postgres psql
```

3. Create a user (if needed):
```sql
CREATE USER postgres WITH PASSWORD 'postgres';
ALTER USER postgres CREATEDB;
\q
```

## Environment Variables

The application expects these environment variables in `server/.env`:
```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=demo_db
DB_PASSWORD=postgres
DB_PORT=5432
```

## Initialize Database

Run the initialization script to create the database and tables:
```bash
cd server
npm run init-db
```

## Troubleshooting

- If you get authentication errors, make sure your PostgreSQL is configured to accept connections with the credentials in `.env`
- On first installation, you might need to set a password for the postgres user
- Make sure PostgreSQL is running before starting the server