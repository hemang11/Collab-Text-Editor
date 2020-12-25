// As Import Statements do not work in frontEnd so we have to use Webpack
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { QuillBinding } from 'y-quill';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
Quill.register('modules/cursors', QuillCursors);

window.addEventListener('load', async () => {
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
  const socket = io.connect('https://tranquil-hollows-09110.herokuapp.com/');  // Connecting to the server

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

  const quillEdtior = document.getElementById('editor')
  const saveAS = document.getElementById('saveAS');

  // SaveAS pdfcode
  saveAS.addEventListener('click',generatePDF);

  function generatePDF(e){
    const htmlContent = editor.root.innerHTML;
    
    //const canvas = html2pdf().from(print).save();
     const doc = new jsPDF();
     const text = editor.getText();
    // //doc.setFontSize(14)
     doc.text(text, 10, 10);
     doc.save('Untitled.pdf');
    // //console.log(quillEdtior.innerHTML)
    // doc.fromHTML(quillEdtior.innerHTML,15,15,{
    //   "width":170,
    //   "elementHandlers":specialElementHandlers
    // });
    // const delt = editor.getContents()
    // console.log(delt)
    // doc.save("Untitled.pdf");

    // var width = pdf.internal.pageSize.width;    
    // var height = pdf.internal.pageSize.height;
    // pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
    // pdf.save("download.pdf");
  }

  // const editorContainer = document.createElement('div')
  // editorContainer.setAttribute('id', 'editor')
  // document.body.insertBefore(editorContainer, null)

  var toolbarOptions = [
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme

    ['blockquote', 'link','image','video','code-block'],
    ['formula'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'direction': 'rtl' }],                         // text direction
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'align': [] }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    ['clean']  
  ];

  var editor = new Quill('#editor', {
    theme: 'snow',
    modules: {
      cursors : true,
      toolbar:toolbarOptions,
      // imageDrop:true,
      // imageResize:{
      //   displaySize:true
      // },
      // readOnly:true,
      history: {
        userOnly: true
      },
      //scrollingContainer:false
    },
    placeholder: 'Start collaborating...'
  })   

  // Changing the Permissions ReadOnly<->WriteOnly
  const sel = document.getElementById('permission');
  sel.addEventListener('click',()=>{
    if(sel.className==="far fa-eye")
    {
      sel.className="fas fa-edit";
      sel.setAttribute("title","Editing Mode")
      editor.enable(true);
    }
    else if(sel.className==="fas fa-edit"){
      sel.className="far fa-eye";
      sel.setAttribute('title','View Only');
      editor.enable(false);
    }
  })    

  const binding = new QuillBinding(type, editor, provider.awareness)

  //Random color generator for usernames
  const colors = ['blue','red','pink','#00A3BD','#F4B400','#7449BF'];
  const index = Math.floor(Math.random() * 6); // Chooses from index of 0-5 
  if(!username)username='Anonymous';
  provider.awareness.setLocalStateField('user', {
    name: `${username}`,
    color: colors[index]
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
