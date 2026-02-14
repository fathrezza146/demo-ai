# Install dependencies and start both client and server

echo "Installing client dependencies..."
cd client
npm install
cd ..

echo "Installing server dependencies..."
cd server
npm install
cd ..

echo "Setup complete! To run the application:"
echo "1. Start the server: cd server && npm run dev"
echo "2. In a new terminal, start the client: cd client && npm start"