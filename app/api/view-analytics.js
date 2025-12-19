import connectDB from '../../lib/db';
import User from '../../models/user';
import Order from '../../models/order';
import Bid from '../../models/bid';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const [totalUsers, totalOrders, totalBids] = await Promise.all([
      User.countDocuments({}),
      Order.countDocuments({}),
      Bid.countDocuments({}),
    ]);

    return res.status(200).json({ totalUsers, totalOrders, totalBids });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch analytics', error: err.message });
  }
}
