import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function createDemoUsers() {
  try {
    console.log('🔗 Connecting to database...');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI environment variable is not set');
      console.log('Please make sure your .env file contains:');
      console.log('MONGODB_URI=mongodb://localhost:27017/your-database-name');
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    const { default: User } = await import('../models/user.js');

    // Clear existing demo users to avoid duplicates
    await User.deleteMany({
      email: { 
        $in: ['user@demo.com', 'owner@demo.com', 'admin@demo.com'] 
      }
    });
    console.log('🧹 Cleared existing demo users');

    // Create demo users
    const demoUsers = [
      {
        username: 'demo_user',
        email: 'user@demo.com',
        password: 'password',
        role: 'user'
      },
      {
        username: 'demo_owner',
        email: 'owner@demo.com',
        password: 'password',
        role: 'owner'
      },
      {
        username: 'demo_admin',
        email: 'admin@demo.com',
        password: 'password',
        role: 'admin'
      }
    ];

    for (const userData of demoUsers) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(userData.password, salt);

      const user = await User.create({
        username: userData.username,
        email: userData.email,
        passwordHash: passwordHash,
        role: userData.role,
        isActive: true
      });

      console.log(`✅ Created ${userData.role} user: ${user.email}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Password: ${userData.password}`);
      console.log(`   Role: ${user.role}`);
      console.log('---');
    }

    // Verify the users were created
    const users = await User.find({});
    console.log(`\n📊 Total users in database: ${users.length}`);
    
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.role}) - Active: ${user.isActive}`);
    });

    await mongoose.disconnect();
    console.log('\n🎉 Demo users created successfully!');
    console.log('You can now login with:');
    console.log('   User: user@demo.com / password');
    console.log('   Owner: owner@demo.com / password');
    console.log('   Admin: admin@demo.com / password');

  } catch (error) {
    console.error('💥 Error creating demo users:', error.message);
    console.error('Stack:', error.stack);
    
    if (error.name === 'MongoServerError' && error.code === 8000) {
      console.log('\n🔧 Database connection issue detected:');
      console.log('1. Make sure MongoDB is running');
      console.log('2. Check your MONGODB_URI in .env file');
      console.log('3. Verify the database server is accessible');
    }
  }
}

createDemoUsers();
