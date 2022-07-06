const socket = io();
const { denormalize, schema } = normalizr;

const schemaAuthor = new schema.Entity('author', {}, { idAttribute: 'email' });
const schemaMessages = new schema.Entity('messages', {
    author: schemaAuthor
}, { idAttribute: '_id' });

const denormalizeMessages = (messages) => {
    const messagesDenormalized = denormalize(messages.result, [schemaMessages], messages.entities);
    return messagesDenormalized;
}

socket.on('connectionToServer', async ({ array_productos, array_mensajes }) => {
    await mostrar('formProducts', 'templates/form.handlebars', {});
    await actualizarProductos(array_productos);
    await mostrar('mensajes', 'templates/messages.handlebars', {});
    await actualizarMensajes(array_mensajes);
    agregarFuncionABotones();
    cartelBienvenido();
});

socket.on('actualizarTabla', ({ array_productos }) => {
    actualizarProductos(array_productos);
});

socket.on('actualizarMensajes', ({ array_mensajes }) => {
    actualizarMensajes(array_mensajes);
})

const actualizarProductos = async (array_productos) => {
    array_productos = array_productos.map( item => {
        const id = item._id;
        delete item._id;
        return { ...item, id: id, }; 
    });
    let context = { titulo:"Productos", array_productos, hayProductos: array_productos.length > 0, total: array_productos.length };
    mostrar('tableProducts', 'templates/table.handlebars', context);
}

const actualizarMensajes = async (array_mensajes) => {
    const mensajesDenormalized = denormalizeMessages(array_mensajes);
    const compresion = (JSON.stringify(array_mensajes).length) * 100 /JSON.stringify(mensajesDenormalized).length;
    let context = { array_mensajes: mensajesDenormalized, hayMensajes: mensajesDenormalized.length > 0 }
    await mostrar('tableMensajes', 'templates/tableMessages.handlebars', context);
}

function agregarFuncionABotones() {
    const btn = document.getElementById('botonEnviar')
    btn.addEventListener('click', event => {
        const title = document.getElementById('title').value
        const price = document.getElementById('price').value
        const thumbnail = document.getElementById('thumbnail').value
        if(title.length>0 && price.length>0 && thumbnail.length>0){
            socket.emit('agregarProducto', { title, price, thumbnail })
        } else {
            alert('Todos los campos son obligatorios')
        }
    })
    const btn2 = document.getElementById("botonEnviarMensaje")
    btn2.addEventListener('click', event => {
        const email = document.getElementById('email').value;
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const edad = document.getElementById('edad').value;
        const alias = document.getElementById('alias').value;
        const avatar = document.getElementById('avatar').value;
        const mensaje = document.getElementById('mensaje').value;
        const fecha = new Date();
        const fechaString = `${fecha.getFullYear()}/${fecha.getMonth() + 1}/${fecha.getDate()} ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;
        if(email.length>0 && nombre.length>0 && apellido.length>0 && edad.length>0 && alias.length>0 && avatar.length>0 && mensaje.length>0){
            const data = {
                author: {
                    email: email, 
                    nombre: nombre, 
                    apellido: apellido, 
                    edad: edad, 
                    alias: alias,
                    avatar: avatar
                },
                text: mensaje,
                dateString: fechaString
            }
            socket.emit('enviarMensaje', data)
        }
        else{
            alert('Todos los campos son obligatorios')
        }
    })
    const btn3 = document.getElementById("botonEliminarProductos")
    btn3.addEventListener('click', event => {
        socket.emit("eliminarProductos")
    })
    const btn4 = document.getElementById("botonEliminarMensajes")
    btn4.addEventListener('click', event => {
        socket.emit("eliminarMensajes")
    })
}

async function mostrar(id, template, context) {
    const divProductos = document.getElementById(id);
    divProductos.innerHTML = await armarHtmlRemoto(template, context);
}

function armarHtmlRemoto(url, contexto) {
    return buscarPlantilla(url).then(plantilla => {
        const generarHtml = Handlebars.compile(plantilla);
        return generarHtml(contexto)
    })
}

function buscarPlantilla(url) {
    return fetch(url).then(res => res.text())
}

function eliminarProducto(id) {
    console.log(id)
    socket.emit('eliminarProducto', id);
}

function editarProducto(id) {
    const title = document.getElementById('title').value
    const price = document.getElementById('price').value
    const thumbnail = document.getElementById('thumbnail').value
    if(title.length>0 && price.length>0 && thumbnail.length>0){
        socket.emit('editarProducto', id, { title, price, thumbnail });
    } else {
        alert('Todos los campos son obligatorios')
    }
}

const cartelBienvenido = () => {
    const cartel = document.getElementById('titleWelcome');
    let nombre;
    const options = {
        method: 'GET',
    };
    fetch('/api/login', options)
    .then(res => res.json())
    .then(data => {
        nombre = data.name;
        cartel.innerHTML = `Bienvenido ${nombre}`;
    })
    .catch(err => { console.log(err); })

    const boton = document.getElementById("buttonLogout")
    boton.addEventListener('click', event => {
        window.location.href = '/logout';
    })
}