const http = require('http');
const path = require('path');
// const express = require('express');
const express = require('express');
const socketio = require('socket.io');

const mongoose = require('mongoose');

const app = express();

// llamamos nuestro archivo socket.js y le pasamos la conx io

// creamos la conexion con el servidor
const server =  http.createServer(app);

// escuchas el servidor creado en tiempo real y devuelve
// la conexion de websocket
const io = socketio.listen(server);

// conexion con db
mongoose.connect('mongodb://localhost/chat-database')
    .then(db => console.log('db is connected'))
    .catch(err => console.log(err));

// settings 
// le decimos que utilice el puerto del sistema operativo
// en caso que no devuelva nada, usamos el 3000
app.set('port', process.env.PORT || 3000)

require('./socket')(io);


app.use(express.static(path.join(__dirname, 'public')));

server.listen(app.get('port'), () => {
    console.log('Server on port ', app.get('port'));
});

// instalo nodemon con -D, esto hace que se instale 
// como herramienta de desarrollo y no se usara para  
// funcionamiento de la app