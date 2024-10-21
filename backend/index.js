// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const app = express();

// Importing models
const RegisterModel = require('./models/RegisterModel');
const Product = require('./models/ProductModel');
const Order = require('./models/OrderModel');
const History = require('./models/HistoryModel');
const Feedback = require('./models/feedbackModel');
const CompletedOrder = require('./models/CompletedOrderModel');
const Event = require('./models/EventModel'); 

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/ROOSTER')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Multer storage setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Serve files in the uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Authentication Routes
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await RegisterModel.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        res.json({
          message: 'success',
          user: {
            username: user.username,
            email: user.email,
            role: user.role
          }
        });
      } else {
        res.status(400).json({ message: 'Incorrect password' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    let user = await RegisterModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new RegisterModel({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// app.post('/api/products', upload.single('image'), async (req, res) => {
//   const { title, price } = req.body;

//   try {
//     if (!req.file) {  
//       return res.status(400).json({ message: 'Image file is required' });
//     }

//     const newProduct = new Product({
//       title,
//       price,
//       imageUrl: req.file.path
//     });

//     await newProduct.save();
//     res.status(201).json({ message: 'Product added successfully!' });
//   } catch (error) {
//     console.error('Error adding product:', error);
//     res.status(500).json({ message: 'Failed to add product', error: error.message });
//   }
// });


app.post('/api/products', upload.single('image'), async (req, res) => {
  const { title, price, category } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    if (!title || !price || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newProduct = new Product({
      title,
      price,
      category,
      imageUrl: req.file.path
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully!' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Failed to add product', error: error.message });
  }
});



app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// app.get('/api/products/available', async (req, res) => {
//   try {
//     const availableProducts = await Product.find({ availability: 1 });
//     res.status(200).json(availableProducts);
//   } catch (error) {
//     console.error('Error fetching available products:', error);
//     res.status(500).json({ message: 'Failed to fetch available products', error: error.message });
//   }
// });

app.get('/api/products/available', async (req, res) => {
  try {
    const { category } = req.query; // Get category from query parameters
    const query = { availability: 1 };
    
    if (category) {
      query.category = category; // Add category filter if provided
    }

    const availableProducts = await Product.find(query);
    res.status(200).json(availableProducts);
  } catch (error) {
    console.error('Error fetching available products:', error);
    res.status(500).json({ message: 'Failed to fetch available products', error: error.message });
  }
});


app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

// app.put('/api/products/:id', upload.single('image'), async (req, res) => {
//   try {
//     const { title, price, availability } = req.body;
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     product.title = title || product.title;
//     product.price = price || product.price;
//     product.availability = availability !== undefined ? parseInt(availability, 10) : product.availability;

//     if (req.file) {
//       product.imageUrl = req.file.path;
//     }

//     await product.save();
//     res.status(200).json({ message: 'Product updated successfully' });
//   } catch (error) {
//     console.error('Error updating product:', error);
//     res.status(500).json({ message: 'Failed to update product', error: error.message });
//   }
// });

app.put('/api/products/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, price, availability, category } = req.body; // Include category in destructuring
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.title = title || product.title;
    product.price = price || product.price;
    product.availability = availability !== undefined ? parseInt(availability, 10) : product.availability;
    product.category = category || product.category; // Update category if provided

    if (req.file) {
      product.imageUrl = req.file.path; // Update image URL if a new image is uploaded
    }

    await product.save();
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});


app.post('/api/orders', async (req, res) => {
  const {
    orderCode,
    totalPrice,
    orderedItems,
    paymentStatus,
    username,
    phone,
    orderType,
    selectedOption,
    selectedDate,
    selectedTimes,
    takeawayTime,
    address,
    email
  } = req.body;

  try {
    const newOrder = new Order({
      orderCode,
      totalPrice,
      orderedItems,
      paymentStatus,
      username,
      phone,
      orderType,
      selectedOption,
      selectedDate,
      selectedTimes,
      takeawayTime,
      address,
      email // email is now optional
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully!' });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
});

app.get('/api/history/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    // Replace `Order` with the appropriate model or data source for history
    const history = await History.find({ phone });
    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ message: 'Failed to fetch history', error: error.message });
  }
});

app.post('/api/history', async (req, res) => {
  const {
    orderCode,
    totalPrice,
    orderedItems,
    paymentStatus,
    username,
    phone,
    orderType,
    selectedOption,
    selectedDate,
    selectedTimes,
    takeawayTime,
    address,
    email
  } = req.body;

  try {
    // Create a new history record
    const newHistory = new History({
      orderCode,
      totalPrice,
      orderedItems,
      paymentStatus,
      username,
      phone,
      orderType,
      selectedOption,
      selectedDate,
      selectedTimes,
      takeawayTime,
      address,
      email
    });

    await newHistory.save();
    res.status(201).json({ message: 'History record created successfully!' });
  } catch (error) {
    console.error('Error creating history record:', error);
    res.status(500).json({ message: 'Failed to create history record', error: error.message });
  }
});

// Route to fetch all history records
app.get('/api/history', async (req, res) => {
  try {
    const histories = await History.find(); // Fetch all history records
    res.status(200).json(histories);
  } catch (error) {
    console.error('Error fetching history records:', error);
    res.status(500).json({ message: 'Failed to fetch history records', error: error.message });
  }
});

// Route to fetch a history record by order code
app.get('/api/history/:orderCode', async (req, res) => {
  const { orderCode } = req.params;

  try {
    const history = await History.findOne({ orderCode }); // Fetch a specific history record
    if (history) {
      res.status(200).json(history);
    } else {
      res.status(404).json({ message: 'History record not found' });
    }
  } catch (error) {
    console.error('Error fetching history record:', error);
    res.status(500).json({ message: 'Failed to fetch history record', error: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete order by orderCode and move to CompletedOrders
app.delete('/api/orders/:orderCode', async (req, res) => {
  try {
    const { orderCode } = req.params;

    // Find and delete the order
    const order = await Order.findOneAndDelete({ orderCode });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create a new CompletedOrder document
    const completedOrder = new CompletedOrder(order.toObject());

    // Save the completed order
    await completedOrder.save();

    res.status(200).json({ message: 'Order completed and deleted successfully' });
  } catch (error) {
    console.error('Error completing and deleting order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Route to update an order's status by order code
app.put('/api/orders/:orderCode/status', async (req, res) => {
  const { orderCode } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findOneAndUpdate(
      { orderCode },
      { $set: { status } },
      { new: true }
    );

    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
});

app.get('/api/orders/avail-time', async (req, res) => {
  const { tableId, selectedDate } = req.query;

  try {
    // Check that both tableId and selectedDate are provided
    if (!tableId || !selectedDate) {
      return res.status(400).json({ message: 'Missing tableId or selectedDate' });
    }

    // Find orders for the selected table and date with the orderType 'Table Booking'
    const orders = await Order.find({
      selectedOption: tableId,
      selectedDate: selectedDate,
      orderType: 'Table Booking'
    }, 'selectedTimes'); // Fetch only selectedTimes field

    // Collect all booked times from the orders (assumes selectedTimes is an array)
    const bookedTimes = orders.reduce((acc, order) => {
      return acc.concat(order.selectedTimes || []);
    }, []);

    // Return the booked times array
    res.status(200).json({ bookedTimes });
  } catch (error) {
    console.error('Error fetching available times:', error);
    res.status(500).json({ message: 'Error fetching available times', error: error.message });
  }
});

app.post('/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    const feedback = new Feedback({ name, email, phone, message });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Error submitting feedback' });
  }
});

app.get('/api/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ message: 'Failed to fetch feedbacks', error: error.message });
  }
});

app.delete('/api/feedbacks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Feedback.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: 'Feedback successfully deleted' });
    } else {
      res.status(404).json({ message: 'Feedback not found' });
    }
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ message: 'Failed to delete feedback', error: error.message });
  }
});

app.get('/api/completedOrders', async (req, res) => {
  try {
    const completedOrders = await CompletedOrder.find();
    res.json(completedOrders);
  } catch (error) {
    console.error('Error fetching completed orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const { eventType, name, email, phone, price, guestCount, eventDate, paymentStatus, bookingReference } = req.body;

    // Convert price to a number, handle case where price might be already a number
    const cleanedPrice = typeof price === 'string' ? parseFloat(price.replace(/[^\d.-]/g, '')) : parseFloat(price);

    // Create a new event record
    const newEvent = new Event({
      eventType,
      name,
      email,
      phone,
      price: cleanedPrice, // Use the cleaned price
      guestCount,
      eventDate,
      paymentStatus,
      bookingReference // Ensure this field is included
    });

    // Save the event record to the database
    await newEvent.save();

    // Respond with a success message
    res.status(200).json({ message: 'Payment processed successfully' });
  } catch (error) {
    console.error('Error saving payment data:', error); // Log full error
    res.status(500).json({ message: 'Error saving payment data' });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/events/:bookingReference', async (req, res) => {
  try {
    const event = await Event.findOne({ bookingReference: req.params.bookingReference });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to mark an event as completed
app.post('/api/mark-completed', async (req, res) => {
  const { bookingReference } = req.body; // Expecting bookingReference to be in the request body
  try {
    const event = await Event.findOneAndUpdate(
      { bookingReference },
      { $set: { status: 'Completed' } },
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error updating event status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/check-date', async (req, res) => {
  const { eventDate } = req.query; // Use query parameter for GET request

  if (!eventDate) {
    return res.status(400).json({ error: 'Event date is required' });
  }

  try {
    // Convert the eventDate to a Date object for MongoDB query
    const startDate = new Date(eventDate);
    const endDate = new Date(startDate).setHours(23, 59, 59, 999);

    const events = await Event.find({
      eventDate: {
        $gte: startDate,
        $lt: endDate
      }
    });

    const isBooked = events.length > 0;
    res.json({ booked: isBooked });
  } catch (error) {
    console.error('Error checking date:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch all user details
app.get('/api/users', async (req, res) => {
  try {
    const users = await RegisterModel.find({}, '-password'); // Exclude the password field
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// Update user role
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const updatedUser = await RegisterModel.findByIdAndUpdate(
      id,
      { role },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/orders/history/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const historyOrders = await History.find({ phone }); // Fetch orders by phone number
    res.json(historyOrders);
  } catch (error) {
    console.error('Error fetching orders by phone:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Start the server
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
