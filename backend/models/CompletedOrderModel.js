const mongoose = require('mongoose');

const CompletedOrderSchema = new mongoose.Schema({
  orderCode: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  orderedItems: { type: [Object], required: true },
  paymentStatus: { type: String, required: true },
  username: { type: String, required: true },
  phone: { type: String, required: true },
  orderType: { type: String, required: true },
  selectedOption: { type: String, required: false },
  selectedDate: { type: Date, required: false },
  selectedTimes: { type: [String], required: false },
  takeawayTime: { type: String, required: false },
  address: { type: String, required: false },
  email: { type: String, required: false }, // Make email optional
  createdAt: { type: Date, default: Date.now }, // Automatically set to current date and time
  updatedAt: { type: Date, default: Date.now }  // Automatically set to current date and time
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

module.exports = mongoose.model('CompletedOrder', CompletedOrderSchema);
