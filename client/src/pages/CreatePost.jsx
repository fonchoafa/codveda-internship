import React, { use } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/api';

const CreatePost = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
        isPublished: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
            setLoading(true);
            setError('');
        try{
            const postData = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
                
            };
            await createPost(postData);
            navigate('/dashboard');
        }catch(err){
            setError(err.response?.data?.message || 'Error creating post');
        } finally{
            setLoading(false);
        }
    };
  return (
    <div className='page'>
        <div className='form-container'>
            <h2>Create New Post</h2>
            {error && <p className='error'>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input 
                type='text'
                name='title'
                placeholder='Post Title'
                value={formData.title}
                onChange={handleChange}
                required
                />
                <textarea 
                name='content'
                placeholder='Write your post content here...'
                value={formData.content}
                onChange={handleChange}
                rows='8'
                required
                />
                <input 
                type='text'
                name='tags'
                placeholder='Tags (comma separated: mern, nodejs, react)'
                value={formData.tags}
                onChange={handleChange}
                />
                <label>
                <input 
                type='checkbox'
                name='isPublished'
                placeholder={formData.isPublished}
                onChange={handleChange}
                required
                />
                Publish immediately
                </label>
                <button type='submit' disabled={loading}>
                    {loading ? 'Creating...' : 'Create Post'}
                </button>
            </form>
        </div>
      
    </div>
  )
}

export default CreatePost;
