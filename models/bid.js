import mongoose from 'mongoose';

const BidSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    bidderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'withdrawn'], default: 'pending' },
    message: { type: String },
    // Optional UI fields for richer bid details
    estimatedDuration: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

const Bid = mongoose.models.Bid || mongoose.model('Bid', BidSchema);

export default Bid;
