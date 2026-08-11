import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import authRouter from './Routes/auth.routes.js';
import userRouter from './Routes/user.routes.js';
import inquiryRouter from './Routes/inquiry.routes.js';
import propertyRouter from './Routes/property.routes.js';
import wishlistRouter from './Routes/wishlist.routes.js';
import chatRouter from './Routes/chat.routes.js';
import contactRouter from './Routes/contact.routes.js';
import adminRouter from './Routes/admin.routes.js';



const app = express();
const PORT = process.env.PORT || 5001;

// DB
connectDB();

// middleware
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
].filter(Boolean);
app.use(cors(
  {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  }
));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/property', propertyRouter);

app.use('/api/inquiry', inquiryRouter);

app.use('/api/wishlist', wishlistRouter);

app.use('/api/contact', contactRouter);

app.use('/api/admin', adminRouter);
app.use('/api/chat', chatRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});




const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  }
});

io.on('connection', (socket) => {
  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
  });

  socket.on("sendMessage", (data) => {
    io.to(data.chatId).emit("receiveMessage", data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});