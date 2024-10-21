
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminEvent.css'; // Ensure you add styles in this CSS file
import rooster from '../assets/rooster.png';

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [searchCode, setSearchCode] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showInputFor, setShowInputFor] = useState(''); // Booking reference for which input box is shown
  const [inputValue, setInputValue] = useState('');
  const [report, setReport] = useState({
    total: 0,
    completed: 0,
    notCompleted: 0
  });
  const [eventTypeReport, setEventTypeReport] = useState({}); // New state for event type specific report
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/events');
        if (Array.isArray(response.data)) {
          setEvents(response.data);
          setFilteredEvents(response.data);
          updateReport(response.data); // Update report details for all events
        } else {
          console.error('Unexpected response data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const updateReport = (events) => {
    const total = events.length;
    const completed = events.filter(event => event.status === 'Completed').length;
    const notCompleted = total - completed;

    setReport({
      total,
      completed,
      notCompleted
    });

    // Generate report for each event type
    const typeReport = events.reduce((acc, event) => {
      const type = event.eventType;
      if (!acc[type]) {
        acc[type] = { total: 0, completed: 0, notCompleted: 0 };
      }
      acc[type].total += 1;
      if (event.status === 'Completed') {
        acc[type].completed += 1;
      } else {
        acc[type].notCompleted += 1;
      }
      return acc;
    }, {});

    setEventTypeReport(typeReport);
  };

  const handleSearch = () => {
    const filtered = events.filter((event) =>
      event.bookingReference.includes(searchCode)
    );
    setFilteredEvents(filtered);
    updateReport(filtered); // Update report details for filtered events
  };

  const handleMarkAsCompleted = (bookingReference) => {
    setShowInputFor(bookingReference);
  };

  const handleSubmit = async () => {
    if (inputValue === showInputFor) {
      try {
        await axios.post('http://localhost:3001/api/mark-completed', { bookingReference: showInputFor });
        // Fetch updated events after marking as completed
        const response = await axios.get('http://localhost:3001/api/events');
        setEvents(response.data);
        setFilteredEvents(response.data);
        updateReport(response.data); // Update report details for all events
        setShowInputFor('');
        setInputValue('');
      } catch (error) {
        console.error('Error marking event as completed:', error);
      }
    } else {
      alert('Booking reference does not match.');
    }
  };

  const handleCancel = () => {
    setShowInputFor('');
    setInputValue('');
  };

  return (
    <div className='admin-events-container'>
      <div className='headers'>
        <img src={rooster} width={100} height={100} alt='Rooster Logo' />
        <h2>Admin Event Management</h2>
      </div>
      <hr />
      <div className='actions'>
        <button onClick={() => setShowReport(!showReport)}>
          {showReport ? 'Hide Report' : 'Show Report'}
        </button>
      </div>

      {/* Separate Report Container */}
      {showReport && (
        <div className='report-container'>
          <div className='report'>
            <p>Total Events: {report.total}</p>
            <p>Completed Orders: {report.completed}</p>
            <p>Not Completed Orders: {report.notCompleted}</p>

            <h3>Event Type Report</h3>
            {/* Flex container for event type reports */}
            <div className='event-type-report-container'>
              {Object.keys(eventTypeReport).map(type => (
                <div key={type} className='event-type-report'>
                  <h4>{type}</h4>
                  <p>Total Events: {eventTypeReport[type].total}</p>
                  <p>Completed Orders: {eventTypeReport[type].completed}</p>
                  <p>Not Completed Orders: {eventTypeReport[type].notCompleted}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className='searchbar'>
        <input
          type='text'
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          placeholder='Search by booking reference'
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {filteredEvents.length > 0 && (
        <div>
          <table className='events-table'>
            <thead>
              <tr>
                <th>Event Type</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Price</th>
                <th>Guest Count</th>
                <th>Event Date</th>
                <th>Payment Status</th>
                <th>Booking Reference</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event._id}>
                  <td>{event.eventType}</td>
                  <td>{event.name}</td>
                  <td>{event.email}</td>
                  <td>{event.phone}</td>
                  <td>₹{event.price}</td>
                  <td>{event.guestCount}</td>
                  <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                  <td>{event.paymentStatus}</td>
                  <td>{event.bookingReference}</td>
                  <td>{event.status === 'Completed' ? 'Completed' : 'Not Completed'}</td>
                  <td>
                    {event.status === 'Completed' ? (
                      <span>No Actions Needed</span>
                    ) : (
                      event.bookingReference === showInputFor ? (
                        <div className='input-container'>
                          <input
                            type='text'
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder='Confirm booking reference'
                          /><br />
                          <button onClick={handleSubmit}>Submit</button>
                          <button onClick={handleCancel}>Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => handleMarkAsCompleted(event.bookingReference)}>
                          Mark as Completed
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredEvents.length === 0 && <p>No events found</p>}
    </div>
  );
}

export default AdminEvents;
