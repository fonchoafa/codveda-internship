import React from 'react'
import { deleteUser } from '../services/api';

const UserCard = ({ user, onDeleted}) => {
    const handleDelete = async () => {
        if(!window.confirm('Delete this user?')) return;
        try {
            await deleteUser(user._id);
            onDeleted();
        }catch(err){
            alert('Error deleting user.');
        }
    };
  return (
    <div className='user-card'>
     <div className='user-info'>
        <p><strong>Name:</strong>{user.name}</p>
        <p><strong>Email:</strong>{user.email}</p>
        <p><strong>Age:</strong>{user.age}</p>
    </div>
    <button className='delete-btn' onClick={handleDelete}>Delete</button>
  </div>
  );
}

export default UserCard;
