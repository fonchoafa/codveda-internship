import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { useAuth} from '../context/AuthContext';
import {deletePost, getPost} from '../services/api';

const PostDetail = () => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() =>{
        const fetchPost = async () => {
            try {
                const res = await getPost(id);
                setPost(res.data);
            }catch(err){
                console.error(err);
            }finally{
            setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        if(!window.confirm('Delete this post')) return;
        try{
            await deletePost(id);
            navigate('/dashboard');

        }catch(err){
            alert('Error deleting psot');
        }
    };
    if(loading) return <div className='loading'>Loading Post</div>;
    if(!post) return <div className='error'>Post not found</div>;
  
    const isAuthor = user?.id === post.author?._id;
    const isAdmin = user?.role === 'admin';
    return (
    <div className='page'>
        <div className='post-detail'>
            <h1>{post.title}</h1>
            <div className='post-meta'>
                <span>By {post.author?.name}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span className={`babge ${post.isPublished ? 'published' : 'draft'}`}>
                    {post.isPublished ? 'Published' : 'Draft'}
                </span>
            </div>
            {post.tags?.length > 0 && (
                <div className='post-tags'>
                    {post.tags.map((tag, i) => (
                        <span key={i} className='tag'>#{tag}</span>
                    ))}
                </div>
            )}
            <div className='post-body'>
                <p>{post.content}</p>
            </div>
            {(isAuthor || isAdmin) && (
                <div className='post-actions'>
                  <button onClick={handleDelete} className='btn-delete'>
                  Delete Post  
                  </button>  
                </div>
            )}
        </div>
    </div>
  );
};

export default PostDetail;
