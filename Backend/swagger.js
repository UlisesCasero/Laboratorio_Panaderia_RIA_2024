const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API Documentación',
    description: 'Documentación de la API generada automáticamente',
  },
  host: 'localhost:3000',
  schemes: ['http'],
  securityDefinitions: {
    BearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Ingrese su token en el formato: Bearer <token>'
    }
  },
  definitions: {
    Usuario: {
      id: 1,
      email: "user@example.com",
      password: "password123",
      role: "USER",
      telefono: "123456789",
      enabled: true
    },
    RegisterUser: {
      email: "user@example.com",
      password: "password123",
      role: "USER",
      telefono: "123456789",
    },
    Login: {
      email: "user@example.com",
      password: "password123",
    },
    ChangePassword: {
      id: 1,
      oldPassword: "password123",
      newPassword: "newpassword123",
    },
    ForgotPassword: {
      email: "user@example.com",
    },
    EnableDisableUser: {
      id: 1,
    },
    Producto: {
      id: 1,
      nombre: "Producto Ejemplo",
      descripcion: "Descripción del producto",
      imagen: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      precio: 9.99,
      insumos: [
        {
          id: 1,
          cantidad: 100
        }
      ]
    },
    Insumo: {
      id: 1,
      nombre: "Insumo Ejemplo"
    },
    ProductoInsumo: {
      id_producto: 1,
      id_insumo: 1,
      cantidad: 100
    },
    InsumoCantidad: {
      id: 1,
      cantidad: 100
    },
    Pedido: {
      id: 1,
      idProducto: 1,
      idOrden: 1,
      cantidad: 2,
      estado: "PENDIENTE"
    },
    OrdenCompra: {
      id: 1,
      idCliente: 1,
      total: 2,
      fecha_entrega: "2024-05-22",
      idPanadero: 2,
      estado: "PENDIENTE"
    }
  }
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./app'); // Tu archivo principal de la aplicación
});
