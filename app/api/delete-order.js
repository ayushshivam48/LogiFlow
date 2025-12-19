import connectDB from '../../lib/db';
import Order from '../../models/order';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { orderId } = req.body || {};
  if (!orderId) {
    return res.status(400).json({ message: 'orderId is required' });
  }

  try {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.status(200).json({ message: 'Order deleted successfully', orderId });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete order', error: err.message });
  }
}
