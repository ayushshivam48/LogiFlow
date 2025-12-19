import connectDB from '../../lib/db';
import User from '../../models/user';
import bcrypt from 'bcryptjs';
import logger from '../../lib/logger';

// Add connection timeout (10 seconds)
const CONNECTION_TIMEOUT = 10000;

// Rate limiting configuration for registration
const MAX_REGISTRATION_ATTEMPTS = 3;
const REGISTRATION_WINDOW_MS = 30 * 60 * 1000; // 30 minutes
const registrationAttempts = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { username, email, password, role, adminCode } = req.body || {};
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'] || 'Unknown';
  
  // Rate limiting check for registration
  const now = Date.now();
  const ipAttempts = registrationAttempts.get(clientIP) || [];
  const recentIpAttempts = ipAttempts.filter(time => now - time < REGISTRATION_WINDOW_MS);
  
  if (recentIpAttempts.length >= MAX_REGISTRATION_ATTEMPTS) {
    logger.logSecurityEvent('REGISTRATION_RATE_LIMIT_EXCEEDED', {
      ip: clientIP,
      attempts: recentIpAttempts.length
    });
    return res.status(429).json({
      success: false,
      message: 'Too many registration attempts',
      details: 'Please try again in 30 minutes',
      error: 'REGISTRATION_RATE_LIMIT_EXCEEDED'
    });
  }
  
  if (!username || !email || !password) {
    logger.logRegistrationFailure(username || 'Unknown', email || 'Unknown', clientIP, userAgent, 'Missing required fields');
    return res.status(400).json({ 
      success: false,
      message: 'Registration failed',
      details: 'Username, email, and password are required',
      error: 'MISSING_REQUIRED_FIELDS'
    });
  }

  // Input sanitization
  const sanitizedUsername = username.trim().toLowerCase();
  const sanitizedEmail = email.trim().toLowerCase();
  
  // Username validation
  if (sanitizedUsername.length < 3) {
    return res.status(400).json({
      success: false,
      message: 'Registration failed',
      details: 'Username must be at least 3 characters long',
      error: 'INVALID_USERNAME_LENGTH'
    });
  }

  if (!/^[a-zA-Z0-9_]+$/.test(sanitizedUsername)) {
    return res.status(400).json({
      success: false,
      message: 'Registration failed',
      details: 'Username can only contain letters, numbers, and underscores',
      error: 'INVALID_USERNAME_CHARACTERS'
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitizedEmail)) {
    return res.status(400).json({
      success: false,
      message: 'Registration failed',
      details: 'Please provide a valid email address',
      error: 'INVALID_EMAIL_FORMAT'
    });
  }

  // Password strength validation
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Registration failed',
      details: 'Password must be at least 8 characters long',
      error: 'PASSWORD_TOO_SHORT'
    });
  }
  if (role && !['user', 'owner', 'admin'].includes(role)) {
    return res.status(400).json({ 
      success: false,
      message: 'Registration failed',
      details: 'Invalid role specified',
      error: 'INVALID_ROLE'
    });
  }
  if (role === 'admin') {
    const expected = process.env.ADMIN_REGISTRATION_CODE;
    if (!expected) {
      logger.logRegistrationFailure(username, email, clientIP, userAgent, 'Admin registration not configured');
      return res.status(500).json({ 
        success: false,
        message: 'Registration failed',
        details: 'Admin registration is not configured',
        error: 'ADMIN_REGISTRATION_NOT_CONFIGURED'
      });
    }
    if (!adminCode || adminCode !== expected) {
      logger.logRegistrationFailure(username, email, clientIP, userAgent, 'Invalid admin code');
      return res.status(403).json({ 
        success: false,
        message: 'Registration failed',
        details: 'Invalid admin registration code',
        error: 'INVALID_ADMIN_CODE'
      });
    }
  }

  try {
    // Database connection with timeout
    const connectPromise = connectDB();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout')), CONNECTION_TIMEOUT)
    );
    
    await Promise.race([connectPromise, timeoutPromise]);

    const existing = await User.findOne({ $or: [{ username: sanitizedUsername }, { email: sanitizedEmail }] }).maxTimeMS(5000);
    if (existing) {
      return res.status(409).json({ 
        success: false,
        message: 'Registration failed',
        details: 'Username or email already in use',
        error: 'DUPLICATE_USER'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ 
      username: sanitizedUsername, 
      email: sanitizedEmail, 
      passwordHash, 
      role: role || 'user' 
    });

    // Record successful registration attempt
    recentIpAttempts.push(now);
    registrationAttempts.set(clientIP, recentIpAttempts);
    
    logger.logRegistration(username, email, clientIP, userAgent);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    // More specific error responses
    if (err.message.includes('timeout')) {
      logger.logRegistrationFailure(username, email, clientIP, userAgent, 'Registration timeout');
      return res.status(504).json({ 
        message: 'Registration timeout',
        details: 'Registration service timeout. Please try again.'
      });
    }
    
    if (err.name === 'MongoError' || err.name === 'MongoNetworkError') {
      logger.logDatabase('ERROR', 'users', { error: err.message, operation: 'registration' });
      return res.status(503).json({ 
        message: 'Database error',
        details: 'Database connection issue. Please try again later.'
      });
    }

    if (err.code === 11000) {
      logger.logRegistrationFailure(username, email, clientIP, userAgent, 'Duplicate username/email');
      return res.status(409).json({ 
        message: 'Registration failed',
        details: 'Username or email already in use'
      });
    }

    logger.logRegistrationFailure(username, email, clientIP, userAgent, `Unexpected error: ${err.message}`);
    return res.status(500).json({ 
      message: 'Registration failed',
      details: 'An unexpected error occurred during registration'
    });
  }
}
