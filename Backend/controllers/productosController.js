const fs = require('fs');
const path = require('path');
const estadoPedido = require('../enums/estadoPedido');
const { deleteProducto, init } = require('./shared');

let productoInsumosss = [
  { idProducto: 1, idInsumo: 1, cantidad: 100 },
  { idProducto: 1, idInsumo: 5, cantidad: 1000 },
  { idProducto: 5, idInsumo: 10, cantidad: 100 },
  { idProducto: 5, idInsumo: 4, cantidad: 100 },
  { idProducto: 5, idInsumo: 7, cantidad: 100 },
  { idProducto: 5, idInsumo: 2, cantidad: 100 }
];
let productos = [
  { id: 1, nombre: 'Pan', descripcion: 'Descripción 1', imagen: 'Pan.jpg', precio: 10.0 },
  { id: 2, nombre: 'Sandwich de miga', descripcion: 'Descripción 2', imagen: 'Sandwich.jpg', precio: 20.0 },
  { id: 3, nombre: 'Scones', descripcion: 'Descripción 3', imagen: 'Scones.jpg', precio: 20.0 },
  { id: 4, nombre: 'Pan catalan', descripcion: 'Descripción 4', imagen: 'Catalan.jpg', precio: 20.0 },
  { id: 5, nombre: 'Pan integral', descripcion: 'Descripción 5', imagen: 'Integral.jpg', precio: 20.0 }
];

exports.productos = productos;
exports.productoInsumos = productoInsumosss;

exports.getProductos = (req, res) => {
  res.json(productos);
};

exports.getProductoById = (req, res) => {
  const { id } = req.params;
  const producto = productos.find(p => p.id == id);
  if (producto) {
    res.json(producto);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
};

exports.obtenerProductoById = (id) => {
  return new Promise((resolve, reject) => {
    const producto = productos.find(p => p.id == id);
    if (producto) {
      resolve(producto);
    } else {
      reject(new Error('Producto no encontrado'));
    }
  });
};

exports.createProducto = (req, res) => {
  const newProducto = req.body;
  newProducto.id = productos.length ? productos[productos.length - 1].id + 1 : 1;
  if (req.body.imagen) {
    const base64Image = req.body.imagen.split(';base64,').pop();
    const imageName = `producto-${newProducto.id}-${Date.now()}.jpg`;
    const imagePath = path.join(__dirname, '../uploads', imageName);

    fs.writeFile(imagePath, base64Image, { encoding: 'base64' }, (err) => {
      if (err) {
        console.error('Error al guardar la imagen:', err);
        return res.status(500).json({ message: 'Error interno al guardar la imagen' });
      } else {
        console.log('Imagen guardada correctamente:', imageName);
        newProducto.imagen = imageName;
        productos.push(newProducto);
        res.status(201).json(newProducto);
      }
    });
  } else {
    productos.push(newProducto);
    res.status(201).json(newProducto);
  }
};

exports.updateProducto = (req, res) => {
  const { id } = req.params;
  const updatedProducto = req.body;

  const productoIndex = productos.findIndex(p => p.id == id);
  if (productoIndex !== -1) {
    if (req.body.imagen && req.body.imagen.trim() !== '') {
      const base64Image = req.body.imagen.split(';base64,').pop();
      const imageName = `producto-${id}.jpg`;
      const imagePath = path.join(__dirname, '../uploads', imageName);

      // Sobrescribir la imagen existente
      fs.writeFile(imagePath, base64Image, { encoding: 'base64' }, (err) => {
        if (err) {
          console.error('Error al sobrescribir la imagen:', err);
          return res.status(500).json({ message: 'Error interno al sobrescribir la imagen' });
        } else {
          console.log('Imagen sobrescrita correctamente:', imageName);
          productos[productoIndex] = { ...productos[productoIndex], ...updatedProducto, imagen: imageName };
          res.json(productos[productoIndex]);
        }
      });
    } else {
      productos[productoIndex] = { ...productos[productoIndex], ...updatedProducto, imagen: productos[productoIndex].imagen };
      res.json(productos[productoIndex]);
    }
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
};

exports.deleteProducto = (req, res) => {
  const { id } = req.params;

  deleteProducto(id, productos, productoInsumosss)
    .then(response => res.json(response))
    .catch(error => res.status(400).json({ message: error.message }));
};

// Inicializar módulos dependientes
const pedidosController = require('./pedidosController');
const productoInsumoController = require('./productoInsumoController');
init(pedidosController.pedidos, productoInsumoController.eliminarProductoInsumosPorProductoId, estadoPedido);
