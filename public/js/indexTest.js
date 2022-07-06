const socket = io();

socket.emit('connectionToTest');

socket.on('sendTest', async ({ productsTest }) => {
    await mostrar('tableProducts', './../templates/tableTest.handlebars', { productsTest });
});

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