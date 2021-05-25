//conexion socket del cliente

$(function () {
    const socket = io();

    // obteniendo los elementos del DOM
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    // obtenemos los elementos del login
    const $loginForm = $('#loginForm');
    const $userError = $('#userError');
    const $username = $('#username');
    const $userActual = $('#userActual');
    const $enviarmd = $('#enviarmd')

    const $users = $('#users');

    $loginForm.submit(e => {
        e.preventDefault();
        socket.emit('new user', $username.val(), data => {
            if (data) {
                $('#login').hide();
                $('#contentWrap').show();
                $('#chatmd').hide();
                $userActual.html($username.val())
            } else {
                $userError.html(`
                <div class="alert alert-danger">
                    that user already exist.
                </div>
                `).show();
            }
            // $username.val('');
        });
    });

    $loginForm.change(e => {
        $userError.hide();
    })

    // enviamos el mensaje al servidor
    $messageForm.submit(e => {
        e.preventDefault();
        socket.emit('send message', $messageBox.val(), data => {
            $chat.append(`<p class="Error">${data}</p>`)
        });
        $messageBox.val('');
    });

    // escuchamos los eventos que vienen del servidor
    socket.on('new message', data => {
        if (data.nick == $username.val()) {
            $chat.append('<p style="float:right;"><b >' + data.nick + ':</b> '+ data.msg + '</p><br/>');
        }
        else{
            $chat.append('<p><b>' + data.nick + ':</b> '+ data.msg + '</p><br/>');
        }
    });

    // listamos los usuarios conectados
    socket.on('usernames', (data) => {
        let html = ``;
        var nombres = Object.keys(data);

        nombres.forEach(d => {

            if(data[d]){
                html +=
                `
                <form id="enviarmd" class="input-group-append">
                <p><i class="fas fa-user"></i> ${d}</p>
                <button type="button" class="btn-info" id="md">MD</button>
                </form>
                `
            }
            else {
                html +=
                `<form id="enviarmd" class="input-group-append">
                <p><i class="far fa-user"></i> ${d}</p>
                <button type="bu" class="btn-info" id="md">MD</button>
                </form>
                `
            }
        });

        $users.html(html);
    })

    socket.on('whisper', data => {
        $chat.append(`<p class="whisper"><b>${data.nick}:</b> ${data.msg}</p>`)
    });

    socket.on('whisperself', data => {
        $chat.append(`<p class="whisperself"><b>${data.nick}:</b> ${data.msg}</p>`)
    });

    socket.on('load old msgs', data => {
        data.forEach(da => {
            displaymsgs(da);
        })
    })

    function displaymsgs(data){
        if($username.val() == data.nick)
        {
            $chat.append('<b >' + data.nick + ':</b> '+ data.msg + '<br/>');
        }
        else{
            $chat.append('<b>' + data.nick + ':</b> '+ data.msg + '<br/>');
        }
    }
});

