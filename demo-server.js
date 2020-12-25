const WebSocket = require('ws')
const http = require('http')
const StaticServer = require('node-static').Server
const setupWSConnection = require('y-websocket/bin/utils.js').setupWSConnection
const express =require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const { v4: uuidV4 } = require('uuid')
const socket = require('socket.io');
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
const path = require('path');
app.use(express.static(path.join(__dirname,'quill')));


const production = process.env.PRODUCTION != null
const PORT = process.env.PORT || 8080

const server = http.createServer(app)
const io = socket(server);
let roomID,username;

app.get('/',(req,res)=>{
  res.render('index')
  //res.sendFile(path.join(__dirname, 'quill', 'quill.html'));
})

app.get('/room/:id',(req,res)=>{
  roomID = req.params.id;
  res.sendFile(path.join(__dirname, 'quill', 'quill.html'));
  //res.render('quill');
})

app.get('/room',(req,res)=>{
  username = req.query.username
  if(!username)username='Anonymous';
  console.log('Username=',username)
  res.redirect(`/room/${uuidV4()}`)
})

app.get('/join',(req,res)=>{
  username = req.query.username
  url = req.query.url;
  const roomID = url.split('/')[4];
  console.log(roomID);
  // console.log(username,url);
  res.redirect(`${url}`);
})

// Socket
io.on('connection',socket =>{
  console.log('made socket connection');
  // handle diff rooms
  console.log('RoomID=',roomID);
  socket.join(roomID); // Joining room with name roomID
  socket.on('title',(title)=>{
    let obj = {roomID,username,title}
    console.log('Title = ',title);
    socket.broadcast.to(roomID).emit('room',obj) // Broadcasting the title to specific room
  });
  socket.emit('room',{roomID,username,title:'Untitled document'});
});

server.listen(PORT,()=>{
  console.log(`Listening to http://localhost:${PORT} ${production ? '(production)' : ''}`)
})

// Redundant code and Explanation
// Creation of Static Server in websockets
// const staticServer = new StaticServer('.', { cache: production ? 3600 : false, gzip: production })

// const server = http.createServer((request, response) => {
//   request.addListener('end', () => {
//     staticServer.serve(request, response)
//   }).resume()
// })

// WEbsockets initialisaton
// const wss = new WebSocket.Server({ server })

// // Websocket code for connection with the client side
// wss.on('connection', (conn, req) => {
//   console.log('Connected')
//   setupWSConnection(conn, req, { gc: req.url.slice(1) !== 'prosemirror-versions' })
//   console.log(`New Client Connected:${conn}`)
//   conn.on('close',()=>{
//     console.log('Client Disconnected');
//   })
// })


