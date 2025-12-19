import connectDB from '../../lib/db';
import Notification from '../../models/notification';
import logger from '../../lib/logger';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { userId, message } = req.body || {};
  
  // Validation
  if (!userId || !message) {
    return res.status(400).json({ message: 'userId and message are required' });
  }

  if (message.length > 500) {
    return res.status(400).json({ message: 'Notification message cannot exceed 500 characters' });
  }

  // Sanitize message to prevent XSS
  const sanitizedMessage = message.replace(/[<>]/g, '');

  try {
    const notification = await Notification.create({ userId, message: sanitizedMessage });
    
    logger.logDatabase('CREATE', 'notifications', { 
      userId, 
      messageLength: sanitizedMessage.length,
      notificationId: notification._id 
    });
    
    return res.status(201).json({ message: 'Notification sent successfully', notification });
  } catch (err) {
    logger.logDatabase('ERROR', 'notifications', { 
      error: err.message, 
      operation: 'send-notification',
      userId
    });
    
    return res.status(500).json({ message: 'Failed to send notification', error: err.message });
  }
}
