import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';
import socketController from './controllers/socketController.js';
import webRouter from './routers/webRouter.js';
import apiRouter from './routers/apiRouter.js';

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true}
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://klein994:Kl3in171@cluster0.pg7zl.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: advancedOptions
    }),
    secret: 'shhhhhhhhhhhhhhhhhhhh',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    }
}))
app.use(express.static('./public'))
app.use('/', webRouter)
app.use('/api', apiRouter)

io.on('connection', socket => socketController(socket, io))

const server = httpServer.listen(8080, () => {
    console.log(`Escuchando en el puerto ${server.address().port}`)
})