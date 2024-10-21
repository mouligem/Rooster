const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  price: { type: Number, required: true },
  guestCount: { type: Number, required: true },
  eventDate: { type: Date, required: true },
  paymentStatus: { type: String, required: true },
  bookingReference: { type: String, required: true },
  status: { type: String, default: 'Not Completed' } // Added status field
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
