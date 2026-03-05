import React, { useEffect, useState } from 'react'
import { getPosts } from '../services/api';
import PostCard from '../components/PostCard';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await getPosts();
                setPosts(res.data);
            }catch(err){
                setError('Failed to load post');
            }finally{
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <div className='loading'>Loading posts...</div>;
    if (error) return <div className='error'>{error}</div>;
  return (
    <div className='page'>
        <h1>Latest Posts</h1>
        {posts.length === 0 ? (
            <p className='no-data'>No post yet. Be the first to create one</p>
        ) : (
            <div className='post-grid'> 
                {posts.map(post => (
                    <PostCard key={post._id} post = {post} />
                ))}
            </div>
        )}
      
    </div>
  );
};

export default Home;
