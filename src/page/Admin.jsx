import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/get-users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  useEffect(() => {

    fetchUsers();
  }, [users]);

  const deleteUser = async (userId) => {
    try {
     const response = await axios.delete(`/api/delete-user/${userId}`);

     if (response.status === 200) {
      // setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      alert(response.data.message);
     }
     fetchUsers()

    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user.');
    }
  };

  return (
    <div>
      <h2>Admin Page</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Username</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Email</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{user._id}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{user.username}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{user.email}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                <button onClick={() => deleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
