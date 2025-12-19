import connectDB from '../../lib/db';
import Bid from '../../models/bid';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { userId, orderId } = req.query || {};
  try {
    const filter = {};
    if (userId) filter.bidderId = userId;
    if (orderId) filter.orderId = orderId;

    const bids = await Bid.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(bids);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch bids', error: err.message });
  }
}
