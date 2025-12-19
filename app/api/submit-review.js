import connectDB from '../../lib/db';
import Review from '../../models/review';
import logger from '../../lib/logger';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { userId, itemId, review, rating } = req.body || {};
  
  // Validation
  if (!userId || !itemId || !review) {
    return res.status(400).json({ message: 'userId, itemId, and review are required' });
  }

  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  if (review.length > 1000) {
    return res.status(400).json({ message: 'Review cannot exceed 1000 characters' });
  }

  try {
    const doc = await Review.create({ userId, itemId, review, rating });
    
    logger.logDatabase('CREATE', 'reviews', { 
      userId, 
      itemId, 
      rating,
      reviewId: doc._id 
    });
    
    return res.status(201).json({ message: 'Review submitted successfully', review: doc });
  } catch (err) {
    logger.logDatabase('ERROR', 'reviews', { 
      error: err.message, 
      operation: 'submit-review',
      userId,
      itemId
    });
    
    return res.status(500).json({ message: 'Failed to submit review', error: err.message });
  }
}
