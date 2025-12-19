import connectDB from '../../lib/db';
import User from '../../models/user';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import logger from '../../lib/logger';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email, token, newPassword } = req.body || {};

  // Email validation
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    if (email && !token && !newPassword) {
      // initiate reset
      const user = await User.findOne({ email });
      if (!user) {
        // Return generic message for security
        return res.status(200).json({ message: 'If that email exists, a reset link has been sent' });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
      user.resetToken = resetToken;
      user.resetTokenExpiry = resetTokenExpiry;
      await user.save();

      logger.logSecurityEvent('PASSWORD_RESET_INITIATED', { email, userId: user._id });

      // In real app, send email containing the token
      return res.status(200).json({ message: 'Reset token generated', resetToken });
    }

    if (token && newPassword) {
      // Password validation
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }

      const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: new Date() } });
      if (!user) {
        logger.logSecurityEvent('PASSWORD_RESET_FAILED', { reason: 'Invalid or expired token', token });
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      user.passwordHash = await bcrypt.hash(newPassword, 10);
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();

      logger.logSecurityEvent('PASSWORD_RESET_SUCCESS', { email: user.email, userId: user._id });

      return res.status(200).json({ message: 'Password reset successful' });
    }

    return res.status(400).json({ message: 'Invalid request' });
  } catch (err) {
    logger.logDatabase('ERROR', 'users', { 
      error: err.message, 
      operation: 'reset-password',
      email
    });
    
    return res.status(500).json({ message: 'Reset failed', error: err.message });
  }
}
