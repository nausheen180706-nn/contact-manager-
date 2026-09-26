const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [
        /^[+0-9()\-\s]{7,25}$/,
        'Please enter a valid phone number (min 7 digits)'
      ]
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        // Also provide status field ('active' | 'inactive') for frontend display compatibility
        ret.status = ret.isActive ? 'active' : 'inactive';
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.status = ret.isActive ? 'active' : 'inactive';
        return ret;
      }
    }
  }
);

// Helpful index for email uniqueness and fast search queries
contactSchema.index({ name: 'text', email: 'text', phone: 'text' });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
