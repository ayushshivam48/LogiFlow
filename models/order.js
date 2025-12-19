import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    loadFrom: { type: String },
    loadTo: { type: String },
    orderDate: { type: Date },
    deliveryDate: { type: Date },
    description: { type: String, required: true },
    // Optional UI-driven fields to support the frontend views
    title: { type: String },
    pickupAddress: { type: String },
    deliveryAddress: { type: String },
    packageType: { type: String },
    weight: { type: Number },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },
    urgency: { type: String, enum: ['standard', 'express', 'urgent'], default: 'standard' },
    preferredDate: { type: Date },
    status: { type: String, enum: ['pending', 'published', 'bidding', 'assigned', 'accepted', 'in_transit', 'delivered', 'cancelled'], default: 'published' },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bidAmount: { type: Number },
  },
  { timestamps: true }
);

// Avoid model overwrite errors in development / hot reload
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;
