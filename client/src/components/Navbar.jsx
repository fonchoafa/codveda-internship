import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate(('/login'));
    };
  return (
    <nav className='navbar'>
        <div className='nav-brand'>
            <Link to= "/">Codveda Blog</Link>
        </div>
        <div className='nav-links'>
            <Link to="/">Home</Link>
            {user ? (
                <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/create-post">New Post</Link>
                <span className='nav-user'>Hello, {user.name}</span>
                {user.role ==='admin' && (
                    <span className='admin-badge'>Admin</span>
                )}
                <button onClick={handleLogout} className='logout-btn'>Logout</button>
                </>
            ) : (
                <>
                <Link to="/login">Login</Link>
                <Link to= "/signup">Signup</Link>
                </>
            )}
        </div>
    </nav>
  );
};
export default Navbar;
