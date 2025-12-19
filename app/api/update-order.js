import connectDB from '../../lib/db';
import Order from '../../models/order';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { orderId, ...updates } = req.body || {};
  if (!orderId) {
    return res.status(400).json({ message: 'orderId is required' });
  }

  try {
    const order = await Order.findByIdAndUpdate(orderId, updates, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.status(200).json({ message: 'Order updated successfully', order });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update order', error: err.message });
  }
}
