const express = require('express');
const router = express.Router();
const productoInsumoController = require('../controllers/productoInsumoController');
const productosController = require('../controllers/productosController');
const insumosController = require('../controllers/insumosController');
const { verifyToken, isAdmin, isPanadero } = require('../middleware/auth');

router.get('/', verifyToken, isPanadero, isAdmin, productoInsumoController.getProductoInsumos);
router.get('/:id_producto', verifyToken, isAdmin, productoInsumoController.getProductoInsumosByProductoId);
router.post('/', verifyToken, isAdmin, (req, res) => {
    productoInsumoController.createProductoInsumo(req, res, productosController.productos, insumosController.insumos);
});
router.delete('/:idProducto/:idInsumo', verifyToken, isAdmin, productoInsumoController.eliminarProductoInsumo);
router.delete('/:idProducto', verifyToken, isAdmin, productoInsumoController.eliminarProductoInsumosPorProductoId);

module.exports = router;