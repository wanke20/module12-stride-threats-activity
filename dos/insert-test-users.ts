import mongoose, { Schema, Document, Model } from 'mongoose';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/infodisclosure')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define an interface for the User document
interface IUser extends Document {
  username: string;
  password: string;
}

// Define a Mongoose schema
const userSchema: Schema<IUser> = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

// Create a Mongoose model based on the schema
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

// Sample usernames and passwords
const sampleUsers: Array<{ username: string; password: string }> = [
  { username: 'user99', password: 'password1' },
  { username: 'user89', password: 'password2' },
  { username: 'user79', password: 'password3' },
];

// Function to insert sample users into the database
async function insertSampleUsers(): Promise<void> {
  try {
    // Insert sample users
    const insertedUsers = await User.insertMany(sampleUsers);
    console.log('Sample users inserted successfully:', insertedUsers);
  } catch (error) {
    console.error('Error inserting sample users:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Call the function to insert sample users
insertSampleUsers();
