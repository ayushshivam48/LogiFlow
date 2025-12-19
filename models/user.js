import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'owner', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

// Remove duplicate index definitions since they're already defined in the schema with unique: true
UserSchema.index({ resetToken: 1 });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
