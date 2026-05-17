import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['ai', 'user'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
}, { timestamps: true });


const AnalyticsSchema = new mongoose.Schema({
  visits: {
    type: Number,
    default: 0
  },
  lastVisitedAt: {
    type: Date
  },
  loadTime: {
    type: Number,
    default: 0
  },
  performanceScore: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const WebsiteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    default: "Untitled"
  },
  lcode: {
    type: String,
    required: true
  },
    images: {
    type: [String],
    default: []
  },
  heroImage: {
    type: String,
    default: ''
  },
  conversion: [MessageSchema],
  deploy: {
    type: Boolean,
    default: false
  },
  deployedUrl: {
    type: String,
    default: ''
  },
  deployedAt: {
    type: Date
  },
  isPermanent: {
    type: Boolean,
    default: false
  },
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  websiteType: {
    type: String,
    enum: ['Portfolio', 'E-commerce', 'Blog', 'Business', 'Landing Page', 'Other'],
    default: 'Other'
  },
  analytics: {
    type: AnalyticsSchema,
    default: () => ({})
  }
}, { timestamps: true });


WebsiteSchema.index({ user: 1, createdAt: -1 });
WebsiteSchema.index({ user: 1, deploy: 1 });
WebsiteSchema.index({ websiteType: 1 });
WebsiteSchema.index({ slug: 1 });

const Website = mongoose.model('Website', WebsiteSchema);
export default Website;