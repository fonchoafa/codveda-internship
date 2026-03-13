const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
const jwt = require('jsonwebtoken');
const socketHandler = require('./socket/socketHandler');
const { typeDefs, resolvers } = require('./graphql/index');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket Setup
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://codveda-backend-ddvm.onrender.com' ] ,
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// REST Routes
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Socket Handler
socketHandler(io);

// Start Apollo + Express
const startServer = async () => {

  // Create Apollo Server
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => {
      return {
        message: error.message,
        code: error.extensions?.code
      };
    }
  });

  // Start Apollo
  await apolloServer.start();

  // GraphQL endpoint with auth context
  app.use('/graphql', expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      const token = req.headers.authorization?.split(' ')[1];
      if(token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          return { user: decoded };
        } catch(err) {
          return { user: null };
        }
      }
      return { user: null };
    }
  }));

  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected Successfully!');

  server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
    console.log(`GraphQL: http://localhost:${process.env.PORT}/graphql`);
    console.log(`REST API: http://localhost:${process.env.PORT}/api`);
  });

}; 

startServer().catch(err => console.log('Server Error:', err));