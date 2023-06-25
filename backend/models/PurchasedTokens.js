const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    minlength: 11,
    maxlength: 11,
    default: () => Math.floor(10000000000 + Math.random() * 90000000000), // Generates a random 11-digit number
  },
  meter_number: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 6,
  },
  token: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 8,
  },
  token_status: {
    type: String,
    enum: ['USED', 'NEW', 'EXPIRED'],
    required: true,
  },
  token_value_days: {
    type: Number,
    required: true,
    minlength: 11,
    maxlength: 11,
  },
  purchased_date: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
    minlength: 11,
    maxlength: 11,
  },
  expiry_date: {
    type: Date,
  },
});


// Calculate expiry_date based on purchased_date and token_value_days
tokenSchema.pre('save', function(next) {
  const expiryDate = new Date(this.purchased_date);
  expiryDate.setDate(expiryDate.getDate() + this.token_value_days);
  this.expiry_date = expiryDate;
  next();
});

// Middleware to automatically update token_status when the expiry date is reached
tokenSchema.pre('save', function(next) {
  if (this.expiry_date <= Date.now()) {
    this.token_status = 'EXPIRED';
  }
  next();
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
