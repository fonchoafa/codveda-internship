import React from 'react'
import { Link } from 'react-router-dom';

const PostCard = ({post}) => {
  return (
    <div className='post-card'>
        <div className='post-card-header'>
        <h3>{post.title}</h3>
        <span className={`badge ${post.isPublished} ? 'published' : 'draft'`}>
            {post.isPublished ? 'Published' : 'Draft'}
        </span>
        </div>
        <p className='post-content-preview'>{post.content.substring(0, 120)}...</p>
      
      <div className='post-card-footer'>
        <span className='post-author'>
            By {post.author?.name || 'Unknown'}
        </span>
        <span className='post-date'>
        {new Date(post.createdAt).toLocaleDateString()}
        </span>
        <Link to={`/posts/${post._id}`} className='read-more'>
        Read More →</Link>
      </div>
      {post.tags?.length > 0 && (
        <div className='post-tags'>
            {post.tags.map((tag, i) =>(
                <span key={i}>#{tag}</span>
            ))}
        </div>
      )}
    </div>
  )
};

export default PostCard;
