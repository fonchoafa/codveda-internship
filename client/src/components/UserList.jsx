import React from 'react'
import { useState } from 'react'
import { getUsers } from '../services/api';
import { useEffect } from 'react';
import UserCard from './UserCard';

const UserList = ({refresh}) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try{
        const res = await getUsers();
        setUsers(res.data);

        }catch(err){
            setError('Error fetching users. Is your backend running? ');
        }finally{
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchUsers();
    }, [refresh]);

    if (loading) return <p className='loading'>Loading users...</p>;
    if (error) return <p className='error'>{error}</p>;
  return (
    <div className='list-container'>
        <h2>All Users ({users.length})</h2>
        {users.length === 0 ? (
            <p>No user found. Add one above!</p>
        ) : (
            users.map(user => (
                <UserCard 
                key={user._id}
                user={user}
                onDeleted={fetchUsers}
                />
            ))
        )}
      
    </div>
  )
}

export default UserList;
