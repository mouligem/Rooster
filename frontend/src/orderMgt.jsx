import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './orderManagement.css';
import rooster from './assets/rooster.png';

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [sortAscending, setSortAscending] = useState(false);
  const [editOrderId, setEditOrderId] = useState(null);
  const [inputCode, setInputCode] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState(new Set());
  const [activeOrderType, setActiveOrderType] = useState('All');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/orders');
        console.log('Orders fetched:', response.data);

        if (Array.isArray(response.data)) {
          setOrders(response.data);
          // Initialize filteredOrders with all orders not marked as completed
          setFilteredOrders(response.data.filter(order => !completedOrders.has(order._id)));
        } else {
          console.error('Unexpected response data format:', response.data);
          setOrders([]);
          setFilteredOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
        setFilteredOrders([]);
      }
    };

    fetchOrders();
  }, [completedOrders]);

  useEffect(() => {
    // Filter orders based on the active order type and completed status
    const filterOrders = () => {
      if (activeOrderType === 'All') {
        setFilteredOrders(orders.filter(order => !completedOrders.has(order._id)));
      } else {
        setFilteredOrders(orders.filter(order => order.orderType === activeOrderType && !completedOrders.has(order._id)));
      }
    };

    filterOrders();
  }, [activeOrderType, orders, completedOrders]);

  const sortOrdersByDate = () => {
    const sortedOrders = [...filteredOrders].sort((a, b) => {
      return sortAscending
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt);
    });
    setFilteredOrders(sortedOrders);
    setSortAscending(!sortAscending);
  };

  const handleCompleteClick = (orderId) => {
    setEditOrderId(orderId);
    setInputCode('');
  };

  const handleCompleteSubmit = async (orderId, orderCode) => {
    if (inputCode === orderCode) {
      try {
        // Remove the order from the backend
        await axios.delete(`http://localhost:3001/api/orders/${orderCode}`);
  
        // Update local state to hide the completed order
        setCompletedOrders(prev => new Set(prev).add(orderId));
  
        // Remove order from the view
        setFilteredOrders(filteredOrders.filter(order => order._id !== orderId));
  
        setEditOrderId(null);
      } catch (error) {
        console.error('Error completing order:', error);
        alert('There was an error completing the order.');
      }
    } else {
      alert('The entered code does not match the order code.');
    }
  };

  const handleSearch = () => {
    const filtered = orders.filter((order) =>
      order.orderCode.includes(searchCode)
    );
    setFilteredOrders(filtered.filter(order => !completedOrders.has(order._id)));
  };

  const handleFilterByType = (type) => {
    setActiveOrderType(type);
  };

  // Calculate counts
  const totalOrdersCount = filteredOrders.length;
  const takeawayOrdersCount = filteredOrders.filter(order => order.orderType === 'Takeaway').length;
  const tableBookingOrdersCount = filteredOrders.filter(order => order.orderType === 'Table Booking').length;
  const homeDeliveryOrdersCount = filteredOrders.filter(order => order.orderType === 'Home Delivery').length;

  const filteredTakeawayOrders = filteredOrders.filter(order => order.orderType === 'Takeaway');
  const filteredTableBookingOrders = filteredOrders.filter(order => order.orderType === 'Table Booking');
  const filteredHomeDeliveryOrders = filteredOrders.filter(order => order.orderType === 'Home Delivery');

  return (
    <div className='abg'>
      <div className='order-management-container'>
        <div className='place'>
          <img src={rooster} width={100} height={100} alt='Rooster Logo' />
          <h2 className='hea'>Order Management</h2>
        </div>
        <hr /><br />
        
        {/* Display counts */}
        <div className='counts'>
          <p>Total Orders: {totalOrdersCount}</p>
          <p>Takeaway Orders: {takeawayOrdersCount}</p>
          <p>Table Booking Orders: {tableBookingOrdersCount}</p>
          <p>Home Delivery Orders: {homeDeliveryOrdersCount}</p>
        </div>

        {/* Search and filter functionality */}
        <div className='searchbar'>
          <div className='search-bar'>
            <input
              type='text'
              className='ip'
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder='Search by order code'
            />
            
          </div>
          <div className='shortitems'>
          <button onClick={handleSearch} className='btns'>Search</button>
            <button onClick={() => handleFilterByType('All')} className='btns'>All Orders</button>
            <button onClick={() => handleFilterByType('Takeaway')} className='btns'>Takeaway Orders</button>
            <button onClick={() => handleFilterByType('Table Booking')} className='btns'>Table Booking Orders</button>
            <button onClick={() => handleFilterByType('Home Delivery')} className='btns'>Home Delivery Orders</button>
          </div>
        </div>

        {/* Takeaway Orders Table */}
        {filteredTakeawayOrders.length > 0 && (
          <div>
            <h3>Takeaway Orders</h3>
            <table className='orders-table'>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Order Code</th>
                  <th>Order Type</th>
                  <th>Payment</th>
                  <th>Phone</th>
                  <th>Takeaway Time</th>
                  <th>Order Date</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {filteredTakeawayOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.username}</td>
                    <td>
                      {Array.isArray(order.orderedItems) && order.orderedItems.length > 0 ? (
                        <ul>
                          {order.orderedItems.map((item, index) => (
                            <li key={index}>
                              {item.title} - ₹{item.price} x {item.quantity}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No items</p>
                      )}
                    </td>
                    <td>₹{order.totalPrice}</td>
                    <td>{order.orderCode}</td>
                    <td>{order.orderType}</td>
                    <td>{order.paymentStatus}</td>
                    <td>{order.phone}</td>
                    <td>{order.takeawayTime}</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>
                      {editOrderId === order._id ? (
                        <div>
                          <input 
                            type="text" 
                            value={inputCode} 
                            className='ip'
                            onChange={(e) => setInputCode(e.target.value)} 
                            placeholder="Enter order code"
                          />
                          <button onClick={() => handleCompleteSubmit(order._id, order.orderCode)} className='btns'>Submit</button>
                        </div>
                      ) : (
                        <button onClick={() => handleCompleteClick(order._id)} className='btns'>
                          Mark as Completed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Booking Orders Table */}
        {filteredTableBookingOrders.length > 0 && (
          <div>
            <h3>Table Booking Orders</h3>
            <table className='orders-table'>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Order Code</th>
                  <th>Order Type</th>
                  <th>Selected Option</th>
                  <th>Selected Date</th>
                  <th>Phone</th>
                  <th>Selected Time</th>
                  <th>Payment</th>
                  <th>Order Date</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {filteredTableBookingOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.username}</td>
                    <td>
                      {Array.isArray(order.orderedItems) && order.orderedItems.length > 0 ? (
                        <ul>
                          {order.orderedItems.map((item, index) => (
                            <li key={index}>
                              {item.title} - ₹{item.price} x {item.quantity}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No items</p>
                      )}
                    </td>
                    <td>₹{order.totalPrice}</td>
                    <td>{order.orderCode}</td>
                    <td>{order.orderType}</td>
                    <td>{order.selectedOption}</td>
                    <td>{order.selectedDate}</td>
                    <td>{order.phone}</td>
                    <td>{order.selectedTimes}</td>
                    <td>{order.paymentStatus}</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>
                      {editOrderId === order._id ? (
                        <div>
                          <input 
                            type="text" 
                            value={inputCode} 
                            className='ip'
                            onChange={(e) => setInputCode(e.target.value)} 
                            placeholder="Enter order code"
                          />
                          <button onClick={() => handleCompleteSubmit(order._id, order.orderCode)} className='btns'>Submit</button>
                        </div>
                      ) : (
                        <button onClick={() => handleCompleteClick(order._id)} className='btns'>
                          Mark as Completed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Home Delivery Orders Table */}
        {filteredHomeDeliveryOrders.length > 0 && (
          <div>
            <h3>Home Delivery Orders</h3>
            <table className='orders-table'>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Order Code</th>
                  <th>Order Type</th>
                  <th>Payment</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Order Date</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {filteredHomeDeliveryOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.username}</td>
                    <td>
                      {Array.isArray(order.orderedItems) && order.orderedItems.length > 0 ? (
                        <ul>
                          {order.orderedItems.map((item, index) => (
                            <li key={index}>
                              {item.title} - ₹{item.price} x {item.quantity}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No items</p>
                      )}
                    </td>
                    <td>₹{order.totalPrice}</td>
                    <td>{order.orderCode}</td>
                    <td>{order.orderType}</td>
                    <td>{order.paymentStatus}</td>
                    <td>{order.phone}</td>
                    <td>{order.address}</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>
                      {editOrderId === order._id ? (
                        <div>
                          <input 
                            type="text" 
                            value={inputCode} 
                            className='ip'
                            onChange={(e) => setInputCode(e.target.value)} 
                            placeholder="Enter order code"
                          />
                          <button onClick={() => handleCompleteSubmit(order._id, order.orderCode)} className='btns'>Submit</button>
                        </div>
                      ) : (
                        <button onClick={() => handleCompleteClick(order._id)} className='btns'>
                          Mark as Completed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* If no orders */}
        {filteredTakeawayOrders.length === 0 && filteredTableBookingOrders.length === 0 && filteredHomeDeliveryOrders.length === 0 && (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default OrderManagement;
