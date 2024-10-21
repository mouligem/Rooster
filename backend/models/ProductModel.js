const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   price: { type: Number, required: true },
//   imageUrl: { type: String, required: true }, // Stores image URL
//   availability: { type: Number, enum: [0, 1], default: 1 }, // Now it accepts 0 or 1
// }, { timestamps: true });

// module.exports = mongoose.model('Product', productSchema);



const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  availability: { type: Number, enum: [0, 1], default: 1 },
  category: { type: String, required: true, enum: ['Soup', 'Starters', 'Veg-Gravy', 'Biryani', 'Non-Veg Gravy', 'Poratta', 'Soft Drinks', 'Fried Foods'] },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
