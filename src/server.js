const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Simulación de una lista de productos
const products = ['Producto 1', 'Producto 2', 'Producto 3'];

// Configurar Handlebars como motor de plantillas
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));

app.set('view engine', 'handlebars');


// Directorio de vistas
app.set('views', __dirname + '/views');

// Rutas
app.get('/', (req, res) => {
  // Renderizar la vista home.handlebars
  res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
  // Renderizar la vista realTimeProducts.handlebars
  res.render('realTimeProducts', { products });
});

// Inicializar el WebSocket
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // Emitir la lista de productos a través del WebSocket
  socket.emit('updateProducts', products);

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Iniciar el servidor
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
