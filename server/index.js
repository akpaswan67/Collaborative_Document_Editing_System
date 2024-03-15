import {Server} from 'socket.io';
import Connection from './database/db.js';
import { getDocument, updateDocument  } from './controllers/document-controller.js';
require("dotenv").config();
const PORT= process.env.PORT||9000;
Connection();
const io = new Server(PORT,{
	cors: {
		origin: ['http://localhost:3000', 'https://zingy-lollipop-550839.netlify.app/docs/632a724d-b17d-460a-b5fd-82a67f056f54'],
		methods: ['GET', 'POST']
	}
});

io.on('connection',socket=>{
	socket.on('get-document', async documentId => {
		// const data = "" ;
		const document = await getDocument(documentId);

		socket.join(documentId);
		socket.emit('load-document',document.data);

		socket.on('send-changes',delta =>{
			// console.log(delta);

			////messages are broadcast at all documents
			// socket.broadcast.emit('recieve-changes',delta);


			//messages are broadcast at perticular id
			socket.broadcast.to(documentId).emit('recieve-changes',delta);
		})
		socket.on('save-document',async data =>{
			await updateDocument(documentId, data);
		})
	})
});




