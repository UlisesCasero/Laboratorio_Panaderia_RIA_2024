const express = require('express');
const router = express.Router();
const ordenCompraController = require('../controllers/ordenCompraController');
const { verifyToken, isPanadero, isUser, isAdmin } = require('../middleware/auth');

router.get('/ordenes-admin', verifyToken, isAdmin, ordenCompraController.getOrdenesCompraAdmin);
router.get('/', verifyToken, isUser, isPanadero, ordenCompraController.getOrdenesCompra);
router.get('/ordenes-sin-asignacion', verifyToken, isPanadero, ordenCompraController.getOrdenesCompraNoAsignadas);
router.get('/user/:id', verifyToken, isUser, ordenCompraController.getOrdenCompraParaCliente);
router.get('/panadero/:id', verifyToken, isPanadero, ordenCompraController.getOrdenesCompraPanadero);
router.get('/filtro-insumos-panadero/:id', verifyToken, isPanadero, ordenCompraController.InfoFiltroInsumosPanadero);
router.get('/filtro-insumos-admin', verifyToken, isAdmin, ordenCompraController.InfoFiltroInsumosAdmin);
router.put('/asignar-panadero/:idPanadero/:idOrden', verifyToken, isPanadero, ordenCompraController.asignarOrdenPanadero);
router.put('/actualizar-estado/:id', verifyToken, isPanadero, ordenCompraController.actualizarEstadoOrdenCompra);
router.get('/:id', verifyToken, isUser, isPanadero, ordenCompraController.getOrdenCompraById);
router.post('/', verifyToken, isUser, ordenCompraController.createOrdenCompra);
router.put('/ordenEntregada/:id', verifyToken, isUser, ordenCompraController.cambioEstadoEntregada);
router.put('/:id', verifyToken, isUser, isPanadero, ordenCompraController.updateOrdenCompra);
router.delete('/:id', verifyToken, isUser, ordenCompraController.deleteOrdenCompra);
router.get('/enviar-correo-estado/:id/:email', verifyToken, isUser, ordenCompraController.getOrdenCompraParaCliente2);

module.exports = router;
