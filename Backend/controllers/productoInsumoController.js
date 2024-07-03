const { productos } = require('./productosController');
const { insumos } = require('./insumosController');

let productoInsumos = [
    { idProducto: 1, idInsumo: 1, cantidad: 100 },
    { idProducto: 1, idInsumo: 5, cantidad: 1000 },
    { idProducto: 2, idInsumo: 1, cantidad: 100 },
    { idProducto: 2, idInsumo: 3, cantidad: 3 },
    { idProducto: 2, idInsumo: 4, cantidad: 50 },
    { idProducto: 3, idInsumo: 1, cantidad: 100 },
    { idProducto: 3, idInsumo: 8, cantidad: 100 },
    { idProducto: 3, idInsumo: 9, cantidad: 100 },
    { idProducto: 3, idInsumo: 2, cantidad: 100 },
    { idProducto: 4, idInsumo: 1, cantidad: 100 },
    { idProducto: 4, idInsumo: 4, cantidad: 50 },
    { idProducto: 4, idInsumo: 7, cantidad: 100 },
    { idProducto: 4, idInsumo: 2, cantidad: 100 },
    { idProducto: 5, idInsumo: 10, cantidad: 100 },
    { idProducto: 5, idInsumo: 4, cantidad: 100 },
    { idProducto: 5, idInsumo: 7, cantidad: 100 },
    { idProducto: 5, idInsumo: 2, cantidad: 100 },
];

exports.productoInsumos = productoInsumos;

exports.eliminarProductoInsumoPorProductoId = (idProducto) => {
    productoInsumos = productoInsumos.filter(pi => pi.idProducto == idProducto);
};

exports.getProductoInsumos = (req, res) => {
    res.json(productoInsumos);
};

exports.getProductoInsumosByProductoId = (req, res) => {
    const { id_producto } = req.params;
    const productoInsumosFiltered = productoInsumos
        .filter(pi => pi.idProducto == id_producto)
        .map(pi => ({
            idProducto: pi.idProducto,
            nombre: insumos.find(i => i.id === pi.idInsumo)?.nombre,
            cantidad: pi.cantidad
        }));
    res.json(productoInsumosFiltered);
};

exports.createProductoInsumo = (req, res, productos, insumos) => {
    const { idProducto, idInsumo, cantidad } = req.body;
    const producto = productos.find(p => p.id == idProducto);
    const insumo = insumos.find(i => i.id == idInsumo);

    if (!producto || !insumo) {
        return res.status(400).json({ message: 'Producto o Insumo no existe' });
    }

    const newProductoInsumo = {
        idProducto,
        idInsumo,
        cantidad
    };

    productoInsumos.push(newProductoInsumo);
    res.status(201).json(newProductoInsumo);
};

exports.ObtenerProductoInsumosByProductoId = (id) => {
    return new Promise((resolve, reject) => {
        const prdouctoInsumo = productoInsumos.filter(pi => pi.idProducto == id);
        if (prdouctoInsumo) {
            resolve(prdouctoInsumo);
        } else {
            reject(new Error('Insumos para producto no encontrado'));
        }
    });
};

exports.createProductoInsumo = (req, res) => {
    const newProductoInsumo = req.body;

    const producto = productos.find(p => p.id == newProductoInsumo.idProducto);
    const insumo = insumos.find(i => i.id == newProductoInsumo.idInsumo);

    if (!producto || !insumo) {
        return res.status(400).json({ message: 'Producto o Insumo no existe' });
    }

    productoInsumos.push(newProductoInsumo);
    res.status(201).json(newProductoInsumo);
};
exports.eliminarProductoInsumoPorProductoId = (idProducto) => {
    const productoId = parseInt(idProducto);
      const   productoInsumos = productoInsumos.findIndex(pi => pi.idProducto === productoId);
      if (index !== -1) {
        const deletedProductoInsumo = productoInsumos.splice(index, 1)[0];
        res.status(200).json({ 
           
        });
  };
}

exports.eliminarProductoInsumo = (req, res) => {
    const { idProducto, idInsumo } = req.params;
    const productoId = parseInt(idProducto);
    const insumoId = parseInt(idInsumo);
    const index = productoInsumos.findIndex(pi => pi.idProducto === productoId && pi.idInsumo === insumoId);

    if (index !== -1) {
        const deletedProductoInsumo = productoInsumos.splice(index, 1)[0];
        res.status(200).json({ 
            message: 'Relación Producto-Insumo eliminada correctamente',
            deletedProductoInsumo
        });
    } else {
        res.status(404).json({ message: 'Relación Producto-Insumo no encontrada' });
    }
};

exports.eliminarProductoInsumosPorProductoId = (idProducto) => {
    const originalLength = productoInsumos.length;
    productoInsumos = productoInsumos.filter(pi => pi.idProducto !== idProducto);
    const newLength = productoInsumos.length;

    if (originalLength === newLength) {
        return { success: false, message: 'No se encontraron insumos para el producto especificado' };
    } else {
        return { success: true, message: 'Insumos asociados al producto eliminados correctamente' };
    }
};
