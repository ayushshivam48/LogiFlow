import connectDB from '../../lib/db';
import Review from '../../models/review';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { itemId } = req.query || {};
  if (!itemId) return res.status(400).json({ message: 'itemId is required' });

  try {
    const reviews = await Review.find({ itemId }).sort({ createdAt: -1 });
    return res.status(200).json(reviews);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
}
