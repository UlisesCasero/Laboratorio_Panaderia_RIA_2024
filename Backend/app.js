const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const usuariosRoutes = require('./routes/usuarios');
const productosRoutes = require('./routes/productos');
const insumosRoutes = require('./routes/insumos');
const productoInsumoRoutes = require('./routes/productoInsumo');
const pedidosRoutes = require('./routes/pedidos');
const ordenesCompraRoutes = require('./routes/ordenCompra');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
const mailer = require('./templates/registro');
const { createDefaultUsers } = require('./controllers/usuariosController');

const app = express();
const port = 3000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/usuarios', usuariosRoutes);
app.use('/productos', productosRoutes);
app.use('/insumos', insumosRoutes);
app.use('/productoInsumo', productoInsumoRoutes);
app.use('/pedidos', pedidosRoutes);
app.use('/ordenesCompra', ordenesCompraRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

const corsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

createDefaultUsers().then(() => {
  app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Error al crear usuarios por defecto:', err);
});
