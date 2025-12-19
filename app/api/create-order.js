import connectDB from '../../lib/db';
import Order from '../../models/order';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    // Legacy fields (still supported)
    loadFrom,
    loadTo,
    orderDate,
    deliveryDate,
    description,
    bidAmount,
    // UI form fields
    title,
    pickupAddress,
    deliveryAddress,
    packageType,
    weight,
    dimensions,
    urgency,
    preferredDate,
    status,
  } = req.body || {};

  // Allow either legacy payload or UI payload
  const isLegacy = !!(loadFrom && loadTo && orderDate && deliveryDate && description && bidAmount !== undefined);
  const isUI = !!(title && pickupAddress && deliveryAddress && description && weight && urgency && preferredDate);

  if (!isLegacy && !isUI) {
    return res.status(400).json({ message: 'Missing required fields for order creation' });
  }

  let ownerId;
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      ownerId = payload.sub;
    } catch {}
  }

  const newOrder = new Order({
    // legacy
    loadFrom,
    loadTo,
    orderDate,
    deliveryDate,
    description,
    bidAmount,
    // ui
    title,
    pickupAddress,
    deliveryAddress,
    packageType,
    weight,
    dimensions,
    urgency,
    preferredDate,
    status: status || 'published',
    ownerId,
  });

  try {
    const savedOrder = await newOrder.save();
    return res.status(201).json(savedOrder);
  } catch (error) {
    return res.status(500).json({ message: 'Error saving order', error: error.message });
  }
}
