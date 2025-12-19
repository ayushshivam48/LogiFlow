import connectDB from '../../lib/db';
import Bid from '../../models/bid';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { bidId } = req.body || {};
  if (!bidId) return res.status(400).json({ message: 'bidId is required' });

  try {
    const bid = await Bid.findByIdAndDelete(bidId);
    if (!bid) return res.status(404).json({ message: 'Bid not found' });
    return res.status(200).json({ message: 'Bid deleted successfully', bidId });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete bid', error: err.message });
  }
}
