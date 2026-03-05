import React from 'react'
import { useState } from 'react';
import { createUser } from '../services/api';

const UserForm = ({onUserAdded}) => {
    const [formData, setFormData] = useState({name: '', email: '', age: ''});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) =>{
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try{
            await createUser(formData);
            setFormData({ name: '', email: '', age: ''});
            onUserAdded();
        }catch(err){
            setError('Error adding user. Email may already exist.');
        }finally{
            setLoading(false);
        }
    };
  return (
    <div clasName="form-container">
      <h2>Add New USer</h2>
      {error && <p className='error'>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
        type='text'
        name='name'
        placeholder='Full Name'
        value={formData.name}
        onChange={handleChange}
        required
        />
         <input
        type='email'
        name='email'
        placeholder='Email Address'
        value={formData.email}
        onChange={handleChange}
        required
        />
         <input
        type='number'
        name='age'
        placeholder='Age'
        value={formData.age}
        onChange={handleChange}
        required
        />
        <button type='submit' disabled={loading}>
        {loading ? 'Adding...' : 'Add User'}</button>
      </form>
    </div>
  )
}

export default UserForm;
