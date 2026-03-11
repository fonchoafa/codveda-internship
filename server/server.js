const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const {Server} = require('socket.io');
const socketHandler = require('./socket/socketHandler');
const http = require('http');


dotenv.config();

const app = express();
const server = http.createServer(app);

//Socket Setup
const io = new Server(server, {
  cors:{
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});


const cors = require('cors');
app.use(cors());
app.use(express.json());

// Import Routes
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

//Socket Handler
socketHandler(io);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully!');
    server.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log('Connection Error:', err));