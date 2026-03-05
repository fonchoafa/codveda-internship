import { useState } from 'react'
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostDetail from './pages/PostDetail';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import CreatePost from './pages/CreatePost';

function App() {

 return (
  <AuthProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/posts/:id' element={<PostDetail />} />
        <Route path='/dashboard' element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path='/create-post' element={
          <PrivateRoute><CreatePost /></PrivateRoute>
        } />
      </Routes>
    </Router>
  </AuthProvider>
 )
};

export default App;
