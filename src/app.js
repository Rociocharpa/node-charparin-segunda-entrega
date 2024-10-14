const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const exphbs = require('express-handlebars');

const app = express();
const server = http.createServer(app); 
const io = new Server(server);

const PORT = 3000;

// Handlebars
app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', './src/views');

// Archivos estáticos
app.use(express.static('src/public'));
app.use(express.json()); // Permitir recibir JSON en las peticiones

// Lista de productos 
let productos = [];

// Rutas
app.get('/', (req, res) => {
    res.render('home', { productos });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { productos });
});

// Endpoint para añadir productos (simulación de POST + WebSocket emit)
app.post('/productos', (req, res) => {
    const { nombre } = req.body;
    productos.push({ nombre });

    io.emit('nuevoProducto', { nombre });
    res.status(201).json({ message: 'Producto agregado' });
});

// WebSocket 
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});