import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyPosts, deletePost } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchMyPosts = async () => {
    try {
      const res = await getMyPosts();
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await deletePost(id);
      fetchMyPosts();
    } catch (err) {
      alert('Error deleting post');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <Link to="/create-post" className="btn-primary">+ New Post</Link>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{posts.length}</h3>
          <p>Total Posts</p>
        </div>
        <div className="stat-card">
          <h3>{posts.filter(p => p.isPublished).length}</h3>
          <p>Published</p>
        </div>
        <div className="stat-card">
          <h3>{posts.filter(p => !p.isPublished).length}</h3>
          <p>Drafts</p>
        </div>
      </div>

      <h2>My Posts</h2>
      {posts.length === 0 ? (
        <p className="no-data">You haven't created any posts yet.</p>
      ) : (
        <div className="dashboard-posts">
          {posts.map(post => (
            <div key={post._id} className="dashboard-post-item">
              <div className="dashboard-post-info">
                <h4>{post.title}</h4>
                <span className={`badge ${post.isPublished ? 'published' : 'draft'}`}>
                  {post.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="dashboard-post-actions">
                <Link to={`/posts/${post._id}`} className="btn-view">View</Link>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="btn-delete">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;