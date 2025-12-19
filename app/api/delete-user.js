import connectDB from '../../lib/db';
import User from '../../models/user';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ message: 'userId is required' });

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ message: 'User deleted successfully', userId });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
}
