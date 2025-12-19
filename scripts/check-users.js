const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

async function checkUsers() {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set');
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database successfully');
    
    const User = require('../models/user.js');
    const users = await User.find({});
    console.log('Total users in database:', users.length);
    
    if (users.length > 0) {
      console.log('\nUser details:');
      users.forEach((user, index) => {
        console.log(`\nUser ${index + 1}:`);
        console.log('  ID:', user._id);
        console.log('  Username:', user.username);
        console.log('  Email:', user.email);
        console.log('  Role:', user.role);
        console.log('  Active:', user.isActive);
        console.log('  Has password:', !!user.passwordHash);
        console.log('  Created:', user.createdAt);
      });
    } else {
      console.log('No users found in database');
      
      // Check if we can create a test user
      console.log('\nTesting user creation...');
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('testpassword', salt);
      
      const testUser = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: passwordHash,
        role: 'user'
      });
      
      console.log('Test user created successfully:', testUser._id);
    }
    
    await mongoose.disconnect();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

checkUsers();
