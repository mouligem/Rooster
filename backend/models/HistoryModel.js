// models/HistoryModel.js
const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  orderCode: String,
  totalPrice: Number,
  orderedItems: Array,
  paymentStatus: String,
  username: String,
  phone: String,
  orderType: String,
  selectedOption: String,
  selectedDate: String,
  selectedTimes: Array,
  takeawayTime: String,
  address: String,
  email: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const History = mongoose.model('History', HistorySchema);

module.exports = History;
