import connectDB from '../../lib/db';
import Notification from '../../models/notification';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { userId } = req.query || {};
  if (!userId) return res.status(400).json({ message: 'userId is required' });

  try {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(notifications);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch notifications', error: err.message });
  }
}
