
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import '../orderManagement.css';
import rooster from '../assets/rooster.png';
import './allord.css';

function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/orders/history/${phoneNumber}`);
      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        console.error('Unexpected response data format:', response.data);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  const sortOrdersByDate = (orders) => {
    return [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

  const takeawayOrders = orders.filter(order => order.orderType === 'Takeaway');
  const tableBookingOrders = orders.filter(order => order.orderType === 'Table Booking');
  const homeDeliveryOrders = orders.filter(order => order.orderType === 'Home Delivery');

  return (
    <div className="abg">
      <div className="order-management-container">
        <div className="profile-header">
          <img src={rooster} width={100} height={100} alt="Rooster Logo" />
          <h2 className="hea">User Order Profile</h2>
        </div>
        <hr /><br />

        <div className="searchbar">
          <input
            type="text"
            className="ip"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
          />
          <button onClick={handleSearch} className="btns">Search</button>
        </div>
        <br />

        {/* Takeaway Orders */}
        {takeawayOrders.length > 0 && (
          <div className="order-section">
            <h3 className="order-title">Takeaway Orders</h3>
            <div className="order-list">
              {sortOrdersByDate(takeawayOrders).map((order) => (
                <div key={order._id} className="order-card">
                  <h4>{order.username}'s Takeaway</h4>
                  <p><strong>Order Code:</strong> {order.orderCode}</p>
                  <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
                  <p><strong>Takeaway Time:</strong> {order.takeawayTime}</p>
                  <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                  <div className="order-items">
                    <strong>Items:</strong>
                    {Array.isArray(order.orderedItems) && order.orderedItems.length > 0 ? (
                      <ul>
                        {order.orderedItems.map((item, index) => (
                          <li key={index}>{item.title} - ₹{item.price} x {item.quantity}</li>
                        ))}
                      </ul>
                    ) : <p>No items</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table Booking Orders */}
        {tableBookingOrders.length > 0 && (
          <div className="order-section">
            <h3 className="order-title">Table Booking Orders</h3>
            <div className="order-list">
              {sortOrdersByDate(tableBookingOrders).map((order) => (
                <div key={order._id} className="order-card">
                  <h4>{order.username}'s Table Booking</h4>
                  <p><strong>Order Code:</strong> {order.orderCode}</p>
                  <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
                  <p><strong>Selected Date:</strong> {new Date(order.selectedDate).toLocaleDateString()}</p>
                  <p><strong>Selected Time:</strong> {order.selectedTimes}</p>
                  <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                  <div className="order-items">
                    <strong>Items:</strong>
                    {Array.isArray(order.orderedItems) && order.orderedItems.length > 0 ? (
                      <ul>
                        {order.orderedItems.map((item, index) => (
                          <li key={index}>{item.title} - ₹{item.price} x {item.quantity}</li>
                        ))}
                      </ul>
                    ) : <p>No items</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Home Delivery Orders */}
        {homeDeliveryOrders.length > 0 && (
          <div className="order-section">
            <h3 className="order-title">Home Delivery Orders</h3>
            <div className="order-list">
              {sortOrdersByDate(homeDeliveryOrders).map((order) => (
                <div key={order._id} className="order-card">
                  <h4>{order.username}'s Delivery</h4>
                  <p><strong>Order Code:</strong> {order.orderCode}</p>
                  <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
                  <p><strong>Address:</strong> {order.address}</p>
                  <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                  <div className="order-items">
                    <strong>Items:</strong>
                    {Array.isArray(order.orderedItems) && order.orderedItems.length > 0 ? (
                      <ul>
                        {order.orderedItems.map((item, index) => (
                          <li key={index}>{item.title} - ₹{item.price} x {item.quantity}</li>
                        ))}
                      </ul>
                    ) : <p>No items</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {orders.length === 0 && <p>No orders found for this phone number</p>}
      </div>
    </div>
  );
}

export default AllOrders;





