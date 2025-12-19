import connectDB from '../../lib/db';
import User from '../../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from '../../lib/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'; // Fallback for development

if (!JWT_SECRET) {
  logger.logSecurityEvent('JWT_SECRET_MISSING', { message: 'JWT_SECRET environment variable is required' });
  throw new Error('JWT_SECRET environment variable is required');
}

// Add connection timeout (10 seconds)
const CONNECTION_TIMEOUT = 10000;

// Rate limiting configuration
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const loginAttempts = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { usernameOrEmail, password } = req.body || {};
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'] || 'Unknown';
  
  if (!usernameOrEmail || !password) {
    logger.logLoginFailure(usernameOrEmail || 'Unknown', clientIP, userAgent, 'Missing credentials');
    return res.status(400).json({ 
      success: false,
      message: 'Invalid credentials',
      details: 'Username/email and password are required',
      error: 'MISSING_CREDENTIALS'
    });
  }

  if (typeof usernameOrEmail !== 'string' || typeof password !== 'string') {
    logger.logLoginFailure(usernameOrEmail, clientIP, userAgent, 'Invalid input format');
    return res.status(400).json({ 
      success: false,
      message: 'Invalid credentials',
      details: 'Invalid input format',
      error: 'INVALID_INPUT_FORMAT'
    });
  }

  // Rate limiting check
  const now = Date.now();
  const attempts = loginAttempts.get(usernameOrEmail) || [];
  const recentAttempts = attempts.filter(time => now - time < WINDOW_MS);
  
  if (recentAttempts.length >= MAX_ATTEMPTS) {
    logger.logSecurityEvent('RATE_LIMIT_EXCEEDED', {
      username: usernameOrEmail,
      ip: clientIP,
      attempts: recentAttempts.length
    });
    return res.status(429).json({
      message: 'Too many login attempts',
      details: 'Please try again in 15 minutes'
    });
  }

  try {
    // Database connection with timeout
    const connectPromise = connectDB();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout')), CONNECTION_TIMEOUT)
    );
    
    await Promise.race([connectPromise, timeoutPromise]);

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    }).select('+passwordHash').maxTimeMS(5000);

    if (!user) {
      // Record failed attempt for rate limiting
      recentAttempts.push(now);
      loginAttempts.set(usernameOrEmail, recentAttempts);
      
      logger.logLoginFailure(usernameOrEmail, clientIP, userAgent, 'User not found');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials',
        details: 'No user found with the provided username/email',
        error: 'USER_NOT_FOUND'
      });
    }

    if (!user.isActive) {
      logger.logLoginFailure(usernameOrEmail, clientIP, userAgent, 'Account deactivated');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials',
        details: 'Account has been deactivated',
        error: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Password comparison with timeout
    const comparePromise = bcrypt.compare(password, user.passwordHash);
    const compareTimeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Password comparison timeout')), 3000)
    );
    
    const match = await Promise.race([comparePromise, compareTimeoutPromise]);

    if (!match) {
      // Record failed attempt for rate limiting
      recentAttempts.push(now);
      loginAttempts.set(usernameOrEmail, recentAttempts);
      
      logger.logLoginFailure(usernameOrEmail, clientIP, userAgent, 'Incorrect password');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials',
        details: 'Incorrect password',
        error: 'INCORRECT_PASSWORD'
      });
    }

    // Clear successful login attempts
    loginAttempts.delete(usernameOrEmail);

    // Generate JWT token
    const token = jwt.sign(
      { sub: user._id.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    logger.logLoginSuccess(user.username, clientIP, userAgent);
    return res.status(200).json({
      message: 'Authenticated successfully',
      token,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      },
    });
  } catch (err) {
    // More specific error responses
    if (err.message.includes('timeout')) {
      logger.logLoginFailure(usernameOrEmail, clientIP, userAgent, 'Authentication timeout');
      return res.status(504).json({ 
        success: false,
        message: 'Authentication timeout',
        details: 'Authentication service timeout. Please try again.',
        error: 'AUTHENTICATION_TIMEOUT'
      });
    }
    
    if (err.name === 'MongoError' || err.name === 'MongoNetworkError') {
      logger.logDatabase('ERROR', 'users', { error: err.message, operation: 'login' });
      return res.status(503).json({ 
        success: false,
        message: 'Database error',
        details: 'Database connection issue. Please try again later.',
        error: 'DATABASE_ERROR'
      });
    }

    logger.logLoginFailure(usernameOrEmail, clientIP, userAgent, `Unexpected error: ${err.message}`);
    return res.status(500).json({ 
      success: false,
      message: 'Authentication error',
      details: 'An unexpected error occurred during authentication',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
}
