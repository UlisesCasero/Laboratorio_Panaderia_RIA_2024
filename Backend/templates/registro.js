'use strict';

const nodemailer = require('nodemailer');
require('dotenv').config();

const enviar_mail = (email) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });

    let mail_option = {
        from: 'Panaderia',
        to: email,
        subject: 'Registro a PanaderiaRIA!',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenida a PanaderiaRIA</title>
    <style>
        .card {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 20px;
            margin: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            background-color: #001f3f; /* Azul marino */
            color: #fff; /* Letras en blanco */
        }

        .card p {
            margin-bottom: 10px;
        }

        .card a {
            color: #007bff;
            text-decoration: none;
        }

        .card a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="card">
        <p>Hola!,</p>
        <p>¡Gracias por registrarte en PanaderiaRIA! Estamos encantados de tenerte como parte de nuestra comunidad.</p>
        <p>Ahora podrás disfrutar de todos nuestros productos frescos y deliciosos.</p>
        <p>Para comenzar a explorar, visita nuestro sitio web <a href="http://localhost:4200/login">PanaderiaRIA</a>.</p>
        <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
        <p>¡Que tengas un gran día!</p>
        <p>Atentamente,</p>
        <p>El equipo de PanaderiaRIA</p>
    </div>
</body>
</html>
`
    };
    transporter.sendMail(mail_option, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email enviado: ' + info.response);
        }
    });
};

const enviar_mail_cambio_constrasenia = (email) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });

    let mail_option = {
        from: 'Panaderia',
        to: email,
        subject: 'Cambio de Contraseña en PanaderiaRIA',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cambio de Contraseña</title>
</head>
<body>
    <p>Hola!,</p>
    <p>Tu contraseña ha sido cambiada exitosamente en PanaderiaRIA.</p>
    <p>Atentamente,</p>
    <p>El equipo de PanaderiaRIA</p>
</body>
</html>
`
    };

    transporter.sendMail(mail_option, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email enviado: ' + info.response);
        }
    });
};

const enviar_reset_constrasenia = (email, resetLink) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });

    let mail_option = {
        from: 'Panaderia',
        to: email,
        subject: 'Restablecimiento de Contraseña en PanaderiaRIA',
        html: `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecimiento de Contraseña</title>
  </head>
  <body>
    <p>Hola!,</p>
    <p>Has solicitado restablecer tu contraseña en PanaderiaRIA.</p>
    <p>Para continuar con el proceso, haz clic en el siguiente enlace:</p>
    <p><a href="${resetLink}">Restablecer Contraseña</a></p>
    <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
    <p>Atentamente,</p>
    <p>El equipo de PanaderiaRIA</p>
  </body>
  </html>
  `
    };

    transporter.sendMail(mail_option, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email enviado: ' + info.response);
        }
    });
};

const enviar_mail_pedido = (email, pedidoDetalles) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });
    const mail_option = {
        from: 'Panaderia',
        to: email,
        subject: 'Confirmación de Pedido en PanaderiaRIA',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Pedido</title>
</head>
<body>
    <p>Hola!,</p>
    <p>Gracias por tu pedido en PanaderiaRIA. Aquí están los detalles de tu pedido:</p>
    <p>${pedidoDetalles}</p>
    <p>Atentamente,</p>
    <p>El equipo de PanaderiaRIA</p>
</body>
</html>
`
    };

    transporter.sendMail(mail_option, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email enviado: ' + info.response);
        }
    });
};


module.exports = { enviar_mail_pedido, enviar_mail, enviar_mail_cambio_constrasenia, enviar_reset_constrasenia }; // Exporta enviar_mail como una propiedad de un objeto
