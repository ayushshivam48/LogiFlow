import connectDB from '../../lib/db';
import User from '../../models/user';
import bcrypt from 'bcryptjs';
import logger from '../../lib/logger';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { username, email, password, role, adminCode } = req.body || {};
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  // Role validation
  if (role && !['user', 'owner', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  // Admin registration requires admin code
  if (role === 'admin') {
    const expected = process.env.ADMIN_REGISTRATION_CODE;
    if (!expected) {
      return res.status(500).json({ message: 'Admin registration is not configured' });
    }
    if (!adminCode || adminCode !== expected) {
      return res.status(403).json({ message: 'Invalid admin registration code' });
    }
  }

  try {
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(409).json({ message: 'Username or email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash, role: role || 'user' });

    logger.logRegistration(username, email, req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.headers['user-agent'] || 'Unknown');

    return res.status(201).json({ message: 'User created successfully', user: { id: user._id, username, email, role: user.role } });
  } catch (err) {
    logger.logDatabase('ERROR', 'users', { 
      error: err.message, 
      operation: 'create-user',
      username,
      email
    });
    
    return res.status(500).json({ message: 'Failed to create user', error: err.message });
  }
}
