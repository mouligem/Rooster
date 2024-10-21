import React, { useState, useEffect } from 'react';
import './Users.css'; // Adjust the path if necessary
import rooster from '../assets/rooster.png'; // Adjust the path if necessary

function Users() {
  const [users, setUsers] = useState([]);
  const [searchTermEmail, setSearchTermEmail] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [filter, setFilter] = useState('all'); // New state for filtering

  useEffect(() => {
    // Fetch user data when the component mounts
    fetch('http://localhost:3001/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  // Handle search input change
  const handleEmailSearchChange = (e) => {
    setSearchTermEmail(e.target.value);
  };

  // Filter users based on the email search term and selected role
  const filteredUsers = users.filter(user => {
    const matchesEmail = user.email.toLowerCase().includes(searchTermEmail.toLowerCase());
    const matchesRole = filter === 'all' || user.role === filter;
    return matchesEmail && matchesRole;
  });

  // Handle role change input
  const handleRoleChange = (e) => {
    setNewRole(e.target.value);
  };

  // Start editing a user
  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setNewRole(user.role); // Pre-fill the input with the current role
  };

  // Save updated role
  const handleUpdateRole = (userId) => {
    fetch(`http://localhost:3001/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: newRole }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Failed to update role');
      })
      .then(updatedUser => {
        setUsers(users.map(user => user._id === userId ? updatedUser : user));
        setEditingUserId(null);
        setNewRole('');
      })
      .catch(error => console.error('Error updating role:', error));
  };

  // Count users by role
  const userCount = users.filter(user => user.role === 'user').length;
  const adminCount = users.filter(user => user.role === 'admin').length;

  return (
    <div className="users-container abg">
      <div className="users-header-container">
        <img src={rooster} width={100} height={100} alt='Rooster Logo' />
        <h2>User Management</h2>
      </div>
      <hr />
      <div className="users-summary">
        <p>Total Users: {users.length}</p>
        <p>Users: {userCount}, Admins: {adminCount}</p>
      </div>
      <div className="searchbar">
        <input
          type="text"
          placeholder="Search by email"
          className="ip"
          value={searchTermEmail}
          onChange={handleEmailSearchChange}
        />
      
      <div className="filter-buttons">
        <button onClick={() => setFilter('all')}>Show All</button>
        <button onClick={() => setFilter('user')}>Show Users</button>
        <button onClick={() => setFilter('admin')}>Show Admins</button>
      </div></div>
      <div className="users-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    {editingUserId === user._id ? (
                      <select value={newRole} onChange={handleRoleChange}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td>
                    {editingUserId === user._id ? (
                      <button onClick={() => handleUpdateRole(user._id)} className='btns'>Save</button>
                    ) : (
                      <button onClick={() => handleEditClick(user)} className='btns'>Edit</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
