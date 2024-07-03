const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');
const { verifyToken, isUser, isPanadero, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, isUser, isPanadero, pedidosController.getPedidos);
router.get('/:id', verifyToken, isUser, isPanadero, pedidosController.getPedidoById);
router.get('/orden/:id', verifyToken, isUser, pedidosController.getPedidosByOrdenId);
router.get('/pedidos-panadero-orden/:id', verifyToken, isPanadero, pedidosController.getPedidosPanaderoByOrdenId);
router.get('/insumos-pedido/:id', verifyToken, isUser, pedidosController.getInsumosTotales);

router.post('/', verifyToken, isUser, pedidosController.postPedido);

router.put('/:id', verifyToken, isUser, isPanadero, pedidosController.updatePedido);
router.put('/actualizar-estado/:id', verifyToken, isPanadero, pedidosController.updatePedidoEstado);

router.delete('/:id', verifyToken, isAdmin, pedidosController.deletePedido);

module.exports = router;