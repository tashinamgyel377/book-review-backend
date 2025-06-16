import dotenv from 'dotenv'
import app from './app'
import connectDB from './config/db'

// Load environment variables
dotenv.config()
const port = process.env.PORT || 3000


// Connect to MongoDB
// Connect to MongoDB and then start the server
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });


