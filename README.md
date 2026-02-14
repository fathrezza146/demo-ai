# React Client + Express Server Demo

This is a minimal setup demonstrating a React TypeScript client communicating with an Express server that integrates with PostgreSQL.

## Project Structure

```
demo-ai/
├── client/           # React TypeScript application
└── server/           # Express server with PostgreSQL
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database

### Client Setup (React + TypeScript)

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The client will run on `http://localhost:3000`.

### Server Setup (Express + PostgreSQL)

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Make sure PostgreSQL is running on your system

4. Update the `.env` file with your PostgreSQL credentials if needed

5. Start the server:
```bash
npm run dev  # for development with nodemon
# OR
npm start    # for production
```

The server will run on `http://localhost:5000`.

## Features

- React client with TypeScript
- Express server with PostgreSQL integration
- Sample API endpoint (`/api/data`) that creates a table, inserts sample data, and retrieves it
- CORS enabled for cross-origin requests

## API Endpoints

- `GET /` - Basic server status
- `GET /api/data` - Retrieves sample data from PostgreSQL

## Notes

- The client is configured to proxy API requests to the server
- The server automatically creates a sample table and populates it with data if it doesn't exist
- Remember to install and configure PostgreSQL before running the server# demo-ai
