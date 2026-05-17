import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
  credits: {
    type: Number,
    default: 100, 
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free'
    },
    planType: String,
    credits: Number,
    totalCredits: Number,
    purchasedAt: Date,
    expiresAt: Date,
    stripeSessionId: String,
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active'
    },
    lastPaymentDate: Date
  },
  paymentHistory: [{
    stripeSessionId: String,
    planType: String,
    amount: Number,
    credits: Number,
    purchasedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'failed'],
      default: 'completed'
    }
  }],
  totalCreditsPurchased: {
    type: Number,
    default: 100 
  },
  totalSpent: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model("User", userSchema);