const express= require('express');
const cors= require('cors');
const mongoose=require('mongoose');
const userRoutes=require('./routes/userRoutes');
const messageRoute=require('./routes/messagesRoutes');
const socket = require('socket.io');



const app = express();
require('dotenv').config();

//New updates to chat-app
const http = require('http').Server(app);

app.use(cors({
  origin: ["http://localhost:3000","https://mern-chat-application-socket.onrender.com"]
}));
app.use(express.json());



app.use('/api/auth', userRoutes)
app.use('/api/messages', messageRoute)

const server= http.listen(process.env.PORT,()=>{
  console.log(`Server is connected...${process.env.PORT}`)
})

mongoose.connect(process.env.MONGO_URL)
  .then(()=>{
    console.log('Connection with server is successful');
    server
  })
  .catch((err)=>{console.log(err)})



const io = socket(server,{
  cors:{
    origin:['http://localhost:3000','https://mern-chat-application-socket.onrender.com'],
    credential: true,
  }
})

global.onlineUsers = new Map();

io.on('connection',async(socket)=>{
  console.log(socket.id)
  global.chatSocket = await socket;
  socket.on("add-user",(userId)=>{
    onlineUsers.set(userId,socket.id);
  });

  socket.on("send-msg", (data)=>{
    console.log(data)
    const sendUserSocket = onlineUsers.get(data.to);
    if(sendUserSocket){
      socket.to(sendUserSocket).emit("msg-recieve",data.msg);
    }
  })
})