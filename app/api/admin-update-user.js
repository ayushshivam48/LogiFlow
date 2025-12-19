import connectDB from '../../lib/db';
import User from '../../models/user';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { userId, ...updates } = req.body || {};
  if (!userId) return res.status(400).json({ message: 'userId is required' });

  try {
    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('username email role isActive');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
}
