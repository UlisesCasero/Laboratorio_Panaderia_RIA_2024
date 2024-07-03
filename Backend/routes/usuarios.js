'use strict';
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { verifyToken, isAdmin, isPanadero, isAdminOrUser } = require('../middleware/auth');
const mailer = require('../templates/registro');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

router.post('/register', (req, res) => {
  /* #swagger.summary = 'Registra un nuevo usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['body'] = {
          in: 'body',
          description: 'Registro de nuevo usuario.',
          schema: { $ref: '#/definitions/RegisterUser' }
      } */
  const email = req.body.email;
  mailer.enviar_mail(email);
  usuariosController.register(req, res, (err, usuario) => {
    if (err) {
      return res.status(500).json({ error: 'Error al registrar usuario' });
    }

    return res.status(201).json(usuario);
  });
});

router.post('/login', (req, res) => {
  /* #swagger.summary = 'Inicia sesión' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Credenciales de usuario.',
        schema: { $ref: '#/definitions/Login' }
    } */
  usuariosController.login(req, res);
});

router.post('/change-password', async (req, res) => {
  /* #swagger.summary = 'Cambia la contraseña del usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Cambio de contraseña de usuario.',
        schema: { $ref: '#/definitions/ChangePassword' }
    } */
  usuariosController.changePassword(req, res);
  mailer.enviar_mail_cambio_constrasenia();
});

router.post('/forgot-password', (req, res) => {
  /* #swagger.summary = 'Recupera la contraseña olvidada' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Recuperación de contraseña de usuario.',
        schema: { $ref: '#/definitions/ForgotPassword' }
    } */
  usuariosController.forgotPassword(req, res);
});

router.post('/enable-user', (req, res) => {
  /* #swagger.summary = 'Habilita un usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Habilitación de usuario.',
        schema: { $ref: '#/definitions/EnableDisableUser' }
    } */
  usuariosController.enableUser(req, res);
});

router.post('/disable-user', (req, res) => {
  /* #swagger.summary = 'Deshabilita un usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Deshabilitación de usuario.',
        schema: { $ref: '#/definitions/EnableDisableUser' }
    } */
  usuariosController.disableUser(req, res);
});

router.get('/users', verifyToken, isAdmin, (req, res) => {
  /* #swagger.summary = 'Obtiene todos los usuarios' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  usuariosController.getAllUsers(req, res);
});

router.get('/:id', verifyToken, isAdminOrUser, (req, res) => {
  /* #swagger.summary = 'Obtiene un insumo por ID' */
  /* #swagger.tags = ['Insumos'] */
  /* #swagger.parameters['id'] = { description: 'ID del insumo', type: 'integer', required: true } */
  usuariosController.getUserById(req, res);
});


router.put('/change-password', verifyToken, async (req, res) => {
  /* #swagger.summary = 'Cambia la contraseña del usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Cambio de contraseña de usuario.',
        schema: { $ref: '#/definitions/ChangePassword' }
    } */
  usuariosController.changePassword(req, res);
});

router.get('/email/:email', usuariosController.getUserByEmail);
router.put('/actualizar/:id', verifyToken, isAdminOrUser, async (req, res) => {
  /* #swagger.summary = 'Cambia la contraseña del usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Cambio de contraseña de usuario.',
        schema: { $ref: '#/definitions/ChangePassword' }
    } */
  usuariosController.updateUsuario(req, res);
});
module.exports = router;
