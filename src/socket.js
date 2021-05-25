// const Chat = require('./models/Chat');


// conexion socket del servidor
module.exports = (io) => {
    // simulamos datos de una db con una lista
    
    let usuarios = {};

    
    
    // io tiene todos los sockets conectados (todos los clientes)    
    io.on('connection', async socket => {
        console.log('new user connected');
        
        // let messages = await Chat.find({}).limit(10);
        // socket.emit('load old msgs', messages);

        socket.on('new user', (data, cb) => {
            
            if (data in usuarios) {
                cb(false);
            }
            else {
                cb(true);
                socket.nickname = data;
                socket.conectado = true;
                usuarios[socket.nickname] = socket;
                updateNicknames();
            }
        });

        // socket tiene la conexion del servidor con un solo cliente
        socket.on('send message', async (data, cb) => {

            var msg = data.trim();

            if(msg.substr(0,3) === '/w '){
                msg = msg.substr(3);
                const index = msg.indexOf(' ');
                if (index != -1) {
                    var name = msg.substr(0, index);
                    msg = msg.substr(index + 1);
                    if (name in usuarios){
                        usuarios[name].emit('whisper', {
                            msg,
                            nick: socket.nickname
                        });
                        usuarios[socket.nickname].emit('whisperself', {
                            msg,
                            nick: socket.nickname
                        });
                    } else {
                        cb('Error! Pleace enter a valid user');
                    }
                }else {
                    cb('Error, pleace enter your message');
                }
            }else {
                // var newmsg = new Chat({
                //     msg,
                //     nick: socket.nickname 
                // });
                // await newmsg.save();

                // esto los retransmite a todos 
                io.sockets.emit('new message', {
                    msg: data,
                    nick: socket.nickname
                })
            }
        });

        socket.on('disconnect', data => {
            if(!socket.nickname) return;
            usuarios[socket.nickname].conectado = false;
            
            updateNicknames();
            setTimeout(() => {
                delete usuarios[socket.nickname];
                updateNicknames();
            }, 3000);
        })

        socket.emit('get user', socket.nickname)

        function updateNicknames(){
            var users = {}
            Object.keys(usuarios).forEach(name => {
                users[name] = usuarios[name].conectado;
            });
            io.sockets.emit('usernames', users);
        }
    });
}

