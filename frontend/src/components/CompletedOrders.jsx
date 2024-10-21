
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../orderManagement.css'; // Use the same CSS file
import rooster from '../assets/rooster.png'; // Adjust the path if needed

function CompletedOrders() {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [searchCode, setSearchCode] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterType, setFilterType] = useState(''); // To track which type of orders to show

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/completedOrders');
        if (Array.isArray(response.data)) {
          setCompletedOrders(response.data);
          setFilteredOrders(response.data);
        } else {
          console.error('Unexpected response data format:', response.data);
          setCompletedOrders([]);
          setFilteredOrders([]);
        }
      } catch (error) {
        console.error('Error fetching completed orders:', error);
        setCompletedOrders([]);
        setFilteredOrders([]);
      }
    };

    fetchCompletedOrders();
  }, []);

  const handleSearch = () => {
    const filtered = completedOrders.filter((order) =>
      order.orderCode.includes(searchCode)
    );
    setFilteredOrders(filtered);
  };

  const filterOrders = (type) => {
    if (type === 'Takeaway') return filteredOrders.filter(order => order.orderType === 'Takeaway');
    if (type === 'Table Booking') return filteredOrders.filter(order => order.orderType === 'Table Booking');
    if (type === 'Home Delivery') return filteredOrders.filter(order => order.orderType === 'Home Delivery');
    return filteredOrders; // If no filter is applied
  };

  const handleFilterClick = (type) => {
    setFilterType(type);
  };

  const displayedOrders = filterOrders(filterType);

  return (
    <div className='abg'>
      <div className='order-management-container'>
        <div className='place'>
          <img src={rooster} width={100} height={100} alt='Rooster Logo' />
          <h2 className='hea'>Completed Orders</h2>
        </div>
        <hr /><br />

        {/* Display counts */}
        <div className='counts'>
          <p>Total Completed Orders: {completedOrders.length}</p>
          <p>Takeaway Orders: {filterOrders('Takeaway').length}</p>
          <p>Table Booking Orders: {filterOrders('Table Booking').length}</p>
          <p>Home Delivery Orders: {filterOrders('Home Delivery').length}</p>
        </div>

        {/* Search functionality */}
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
        

        {/* Filter buttons */}
        <div className="shortitems">
        <button onClick={handleSearch} className='btns'>Search</button>
          <button onClick={() => handleFilterClick('')} className="btns">All Orders</button>
          <button onClick={() => handleFilterClick('Takeaway')} className="btns">Takeaway Orders</button>
          <button onClick={() => handleFilterClick('Table Booking')} className="btns">Table Booking Orders</button>
          <button onClick={() => handleFilterClick('Home Delivery')} className="btns">Home Delivery Orders</button>
        </div></div>

        {/* Display the appropriate orders table based on the filter type */}
        {filterType === '' || filterType === 'Takeaway' ? (
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
                </tr>
              </thead>
              <tbody>
                {filterOrders('Takeaway').map((order) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {filterType === '' || filterType === 'Table Booking' ? (
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
                </tr>
              </thead>
              <tbody>
                {filterOrders('Table Booking').map((order) => (
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
                    <td>{new Date(order.selectedDate).toLocaleDateString()}</td>
                    <td>{order.phone}</td>
                    <td>{order.selectedTimes}</td>
                    <td>{order.paymentStatus}</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {filterType === '' || filterType === 'Home Delivery' ? (
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
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Payment</th>
                  <th>Order Date</th>
                </tr>
              </thead>
              <tbody>
                {filterOrders('Home Delivery').map((order) => (
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
                    <td>{order.address}</td>
                    <td>{order.phone}</td>
                    <td>{order.paymentStatus}</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {/* If no orders */}
        {displayedOrders.length === 0 && <p>No orders found.</p>}
      </div>
    </div>
  );
}

export default CompletedOrders;
