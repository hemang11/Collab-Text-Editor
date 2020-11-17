// As Import Statements do not work in frontEnd so we have to use Webpack
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { QuillBinding } from 'y-quill'
import Quill from 'quill'
import QuillCursors from 'quill-cursors'

Quill.register('modules/cursors', QuillCursors)

window.addEventListener('load', () => {
  const ydoc = new Y.Doc()

  // const ws = new WebSocket('ws://localhost:8080'); // The url is the url at which server is connected
  // ws.addEventListener('open',()=>{  // opening for connection
  //     console.log('We are Connected');
  //     // ws.send('Client is happy to be connected');
  // });

  // Socket
  let new_room;
  let username;
  let title;
  let total_rooms=[];
  const socket = io.connect('https://morning-bayou-80072.herokuapp.com/');

  // room title
  const Title = document.getElementById('title');
  Title.oninput = () => {
    console.log(Title.value);
    socket.emit('title',Title.value);
  }
  
  socket.on('room',data=>{
    title = data.title;
    Title.value = title;
    username = data.username;
    new_room = data.roomID;
    total_rooms.push(data.roomID);
    console.log(total_rooms);
    console.log(`New Room from client :${new_room}`);
  const provider = new WebsocketProvider('wss://shielded-sierra-61478.herokuapp.com',`${new_room}`, ydoc)
  const type = ydoc.getText(`${new_room}`);
  // To delete text --> ydoc.destroy
  // Unique client Id --> ydoc.clientID
  // console.log(ydoc);
  const editorContainer = document.createElement('div')
  editorContainer.setAttribute('id', 'editor')
  document.body.insertBefore(editorContainer, null)

  var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'image','code-block'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean']  
  ];
  var editor = new Quill(editorContainer, {
    modules: {
      cursors : true,
      toolbar:toolbarOptions,
      // readOnly:true,
      history: {
        userOnly: true
      }
      //scrollingContainer:false
    },
    placeholder: 'Start collaborating...',
    theme: 'snow' // or 'bubble'
  })   

  const binding = new QuillBinding(type, editor, provider.awareness)

  if(!username)username='Anonymous';
  provider.awareness.setLocalStateField('user', {
    name: `${username}`,
    color: 'blue'
  });

  const connectBtn = document.getElementById('y-connect-btn')
  connectBtn.addEventListener('click', () => {
    if (provider.shouldConnect) {
      provider.disconnect()
      connectBtn.textContent = 'Connect'
    } else {
      provider.connect()
      connectBtn.textContent = 'Disconnect'
    }
  })
  // @ts-ignore
  window.example = { provider, ydoc, type, binding, Y }
})
// Socket connectione ends here
});
