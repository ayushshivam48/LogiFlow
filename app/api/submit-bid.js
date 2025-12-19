import connectDB from '../../lib/db';
import Bid from '../../models/bid';
import logger from '../../lib/logger';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { orderId, bidderId, amount, message, estimatedDuration, description } = req.body || {};
  
  // Validation
  if (!orderId || !bidderId || typeof amount !== 'number') {
    return res.status(400).json({ message: 'orderId, bidderId and amount are required' });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: 'Bid amount must be greater than 0' });
  }

  try {
    const bid = await Bid.create({ orderId, bidderId, amount, message, estimatedDuration, description });
    
    logger.logDatabase('CREATE', 'bids', { 
      orderId, 
      bidderId, 
      amount, 
      bidId: bid._id 
    });
    
    return res.status(201).json({ message: 'Bid submitted successfully', bid });
  } catch (err) {
    logger.logDatabase('ERROR', 'bids', { 
      error: err.message, 
      operation: 'submit-bid',
      orderId,
      bidderId
    });
    
    return res.status(500).json({ message: 'Failed to submit bid', error: err.message });
  }
}
