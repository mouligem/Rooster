import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './Bt.css';

const OrderPage = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { phone } = location.state || {};

  useEffect(() => {
    const fetchHistory = async () => {
      if (phone) {
        try {
          const response = await axios.get(`http://localhost:3001/api/history/${phone}`);
          setOrders(response.data);
          console.log(response.data);
        } catch (err) {
          setError('Failed to fetch history');
          console.error('Error fetching history:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setError('No phone number provided');
        setLoading(false);
      }
    };
  
    fetchHistory();
  }, [phone]);
  

  const renderTableHeaders = (orderType) => {
    switch (orderType) {
      case 'Takeaway':
        return (
          <>
            <th>Order Code</th>
            <th>Total Price</th>
            <th>Order Type</th>
            <th>Items</th>
            <th>Payment Status</th>
            <th>Phone</th>
            <th>Takeaway Time</th>
          </>
        );
      case 'Table Booking':
        return (
          <>
            <th>Order Code</th>
            <th>Total Price</th>
            <th>Order Type</th>
            <th>Items</th>
            <th>Payment Status</th>
            <th>Selected Date</th>
            <th>Selected Table</th>
            <th>Selected Time</th>
            <th>Phone</th>
          </>
        );
      case 'Home Delivery':
        return (
          <>
            <th>Order Code</th>
            <th>Total Price</th>
            <th>Order Type</th>
            <th>Items</th>
            <th>Payment Status</th>
            <th>Phone</th>
            <th>Address</th>
          </>
        );
      default:
        return null;
    }
  };

  const renderTableRows = (order) => {
    switch (order.orderType) {
      case 'Takeaway':
        return (
          <tr key={order._id}>
            <td>{order.orderCode}</td>
            <td>₹{order.totalPrice.toFixed(2)}</td>
            <td>{order.orderType}</td>
            <td>
              <ul>
                {order.orderedItems.map((item, index) => (
                  <li key={index}>
                    {item.title} - Quantity: {item.quantity} - Price: ₹{item.price}
                  </li>
                ))}
              </ul>
            </td>
            <td>{order.paymentStatus}</td>
            <td>{phone}</td>
            <td>{order.takeawayTime}</td>
          </tr>
        );
      case 'Table Booking':
        return (
          <tr key={order._id}>
            <td>{order.orderCode}</td>
            <td>₹{order.totalPrice.toFixed(2)}</td>
            <td>{order.orderType}</td>
            <td>
              <ul>
                {order.orderedItems.map((item, index) => (
                  <li key={index}>
                    {item.title} - Quantity: {item.quantity} - Price: ₹{item.price}
                  </li>
                ))}
              </ul>
            </td>
            <td>{order.paymentStatus}</td>
            <td>{order.selectedDate}</td>
            <td>{order.selectedOption}</td>
            <td>{order.selectedTimes}</td>
            <td>{phone}</td>
          </tr>
        );
      case 'Home Delivery':
        return (
          <tr key={order._id}>
            <td>{order.orderCode}</td>
            <td>₹{order.totalPrice.toFixed(2)}</td>
            <td>{order.orderType}</td>
            <td>
              <ul>
                {order.orderedItems.map((item, index) => (
                  <li key={index}>
                    {item.title} - Quantity: {item.quantity} - Price: ₹{item.price}
                  </li>
                ))}
              </ul>
            </td>
            <td>{order.paymentStatus}</td>
            <td>{phone}</td>
            <td>{order.address}</td>
          </tr>
        );
      default:
        return null;
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const takeawayOrders = orders.filter(order => order.orderType === 'Takeaway');
  const tableBookingOrders = orders.filter(order => order.orderType === 'Table Booking');
  const homeDeliveryOrders = orders.filter(order => order.orderType === 'Home Delivery');

  return (
    <div className="order-page">
      <h2>Your Orders</h2>

      {/* Takeaway Orders Table */}
      {takeawayOrders.length > 0 && (
        <div>
          <h3>Takeaway Orders</h3>
          <table>
            <thead>
              <tr>
                {renderTableHeaders('Takeaway')}
              </tr>
            </thead>
            <tbody>
              {takeawayOrders.map(renderTableRows)}
            </tbody>
          </table>
        </div>
      )}

      {/* Table Booking Orders Table */}
      {tableBookingOrders.length > 0 && (
        <div>
          <h3>Table Booking Orders</h3>
          <table>
            <thead>
              <tr>
                {renderTableHeaders('Table Booking')}
              </tr>
            </thead>
            <tbody>
              {tableBookingOrders.map(renderTableRows)}
            </tbody>
          </table>
        </div>
      )}

      {/* Home Delivery Orders Table */}
      {homeDeliveryOrders.length > 0 && (
        <div>
          <h3>Home Delivery Orders</h3>
          <table>
            <thead>
              <tr>
                {renderTableHeaders('Home Delivery')}
              </tr>
            </thead>
            <tbody>
              {homeDeliveryOrders.map(renderTableRows)}
            </tbody>
          </table>
        </div>
      )}

      {/* If no orders */}
      {takeawayOrders.length === 0 && tableBookingOrders.length === 0 && homeDeliveryOrders.length === 0 && (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrderPage;
