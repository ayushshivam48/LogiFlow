import connectDB from '../../lib/db';
import Bid from '../../models/bid';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { bidId, ...updates } = req.body || {};
  if (!bidId) return res.status(400).json({ message: 'bidId is required' });

  try {
    const bid = await Bid.findByIdAndUpdate(bidId, updates, { new: true });
    if (!bid) return res.status(404).json({ message: 'Bid not found' });
    return res.status(200).json({ message: 'Bid updated successfully', bid });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update bid', error: err.message });
  }
}
