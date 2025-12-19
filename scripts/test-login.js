const axios = require('axios');

async function testLogin() {
  console.log('🧪 Testing login functionality...\n');

  const testCases = [
    {
      name: 'Demo User Login',
      email: 'user@demo.com',
      password: 'password',
      role: 'user'
    },
    {
      name: 'Demo Owner Login',
      email: 'owner@demo.com',
      password: 'password',
      role: 'owner'
    },
    {
      name: 'Demo Admin Login',
      email: 'admin@demo.com',
      password: 'password',
      role: 'admin'
    },
    {
      name: 'Invalid Email',
      email: 'nonexistent@example.com',
      password: 'password',
      role: 'user',
      expectedError: true
    },
    {
      name: 'Wrong Password',
      email: 'user@demo.com',
      password: 'wrongpassword',
      role: 'user',
      expectedError: true
    }
  ];

  for (const testCase of testCases) {
    console.log(`📋 Test: ${testCase.name}`);
    console.log(`   Email: ${testCase.email}`);
    console.log(`   Role: ${testCase.role}`);
    
    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        usernameOrEmail: testCase.email,
        password: testCase.password
      }, {
        timeout: 10000,
        validateStatus: (status) => status < 500 // Don't throw for 4xx errors
      });

      console.log(`   Status: ${response.status}`);
      
      if (response.status === 200) {
        console.log('   ✅ SUCCESS: Login successful');
        console.log(`   User: ${response.data.user.username} (${response.data.user.role})`);
        console.log(`   Token: ${response.data.token ? 'Present' : 'Missing'}`);
      } else {
        console.log(`   ❌ FAILED: ${response.data.message}`);
        console.log(`   Details: ${response.data.details}`);
        
        if (testCase.expectedError) {
          console.log('   ⚠️  Expected error - test passed');
        }
      }
    } catch (error) {
      console.log(`   💥 ERROR: ${error.message}`);
      
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Message: ${error.response.data?.message}`);
        console.log(`   Details: ${error.response.data?.details}`);
      }
      
      if (testCase.expectedError) {
        console.log('   ⚠️  Expected error - test passed');
      }
    }
    
    console.log('---');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
  }
}

// Run the test
testLogin().catch(console.error);
