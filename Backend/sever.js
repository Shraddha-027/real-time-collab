const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('../routes/auth'); //Location
const documentRoutes = require('../routes/document'); //Location
const connectDB = require('./config/database');

dotenv.config();
connectDB();


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/collab-doc', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinDocument', (documentId) => {
        socket.join(documentId);
        console.log(`User joined document: ${documentId}`);
    });

    socket.on('documentChange', (data) => {
        socket.to(data.documentId).emit('documentUpdate', data.content);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));