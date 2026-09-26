const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

// Fix for Windows / router DNS failing to resolve MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (err) {
  // Gracefully fallback to default resolver
}

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Contact = require('../models/Contact');

const sampleContacts = [
  {
    name: 'Arun Kumar',
    email: 'arun@example.com',
    phone: '9876543210',
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1) // 1 day ago
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '9876543211',
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
  },
  {
    name: 'Rahul Kumar',
    email: 'rahul@example.com',
    phone: '9876543212',
    isActive: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3 days ago
  },
  {
    name: 'Nisha Patel',
    email: 'nisha@example.com',
    phone: '9876543213',
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4) // 4 days ago
  },
  {
    name: 'Karthik Raj',
    email: 'karthik@example.com',
    phone: '9876543214',
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) // 5 days ago
  },
  {
    name: 'Meena Devi',
    email: 'meena@example.com',
    phone: '9876543215',
    isActive: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10) // 10 days ago
  },
  {
    name: 'Vijay Anand',
    email: 'vijay@example.com',
    phone: '9876543216',
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12) // 12 days ago
  },
  {
    name: 'Anjali S',
    email: 'anjali@example.com',
    phone: '9876543217',
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15) // 15 days ago
  }
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    console.log(`Connecting to MongoDB Atlas for seeding...`);
    
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully.');

    // Clear existing contacts
    await Contact.deleteMany({});
    console.log('Cleared existing contacts from database.');

    // Insert sample contacts
    const createdContacts = await Contact.insertMany(sampleContacts);
    console.log(`Successfully seeded ${createdContacts.length} contacts into MongoDB Atlas!`);

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
