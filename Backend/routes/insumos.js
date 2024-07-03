const express = require('express');
const router = express.Router();
const insumosController = require('../controllers/insumosController');
const { verifyToken, isAdmin, isPanadero, isAdminOrPanadero } = require('../middleware/auth');

router.get('/', verifyToken, isAdminOrPanadero, (req, res) => {
  /* #swagger.summary = 'Obtiene la lista de insumos' */
  /* #swagger.tags = ['Insumos'] */
  insumosController.getInsumos(req, res);
});

router.get('/:id', verifyToken, isAdminOrPanadero, (req, res) => {
  /* #swagger.summary = 'Obtiene un insumo por ID' */
  /* #swagger.tags = ['Insumos'] */
  /* #swagger.parameters['id'] = { description: 'ID del insumo', type: 'integer', required: true } */
  insumosController.getInsumoById(req, res);
});

router.post('/', verifyToken, isAdmin, (req, res) => {
  /* #swagger.summary = 'Agrega un nuevo insumo' */
  /* #swagger.tags = ['Insumos'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Agregar nuevo insumo.',
        schema: { $ref: '#/definitions/Insumo' }
    } */
  insumosController.createInsumo(req, res);
});

router.put('/:id', verifyToken, isAdmin, (req, res) => {
  /* #swagger.summary = 'Actualiza un insumo existente' */
  /* #swagger.tags = ['Insumos'] */
  /* #swagger.parameters['id'] = { description: 'ID del insumo', type: 'integer', required: true } */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Actualizar insumo existente.',
        schema: { $ref: '#/definitions/Insumo' }
    } */
  insumosController.updateInsumo(req, res);
});

router.delete('/:id', verifyToken, isAdmin, (req, res) => {
  /* #swagger.summary = 'Elimina un insumo' */
  /* #swagger.tags = ['Insumos'] */
  /* #swagger.parameters['id'] = { description: 'ID del insumo', type: 'integer', required: true } */
  insumosController.deleteInsumo(req, res);
});

module.exports = router;
