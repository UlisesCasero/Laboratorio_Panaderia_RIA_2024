const { obtenerProductoById } = require('./productosController');
const { obtenerUserById } = require('./usuariosController');
const { getInsumosPedido } = require('./pedidosController');
const { usuarios } = require('./usuariosController');
const { pedidos, getPedidosByOrdenId2 } = require('./pedidosController');
const estadoOrden = require('../enums/estadoOrden');
const estadoPedido = require('../enums/estadoPedido');
const { insumos } = require('./insumosController');
const { enviar_mail_pedido } = require('../templates/registro');
const Mail = require('nodemailer/lib/mailer');

const nodemailer = require('nodemailer');
require('dotenv').config();
const ordenes = [
    { id: 1, idCliente: 5, total: 30, fecha_entrega: '2024-05-22', idPanadero: 3, estado: estadoOrden.PENDIENTE, asignada: true, entregada: false },
    { id: 2, idCliente: 5, total: 100, fecha_entrega: '2024-06-02', idPanadero: 3, estado: estadoOrden.PENDIENTE, asignada: true, entregada: false },
    { id: 3, idCliente: 5, total: 30, fecha_entrega: '2024-05-22', idPanadero: null, estado: estadoOrden.PENDIENTE, asignada: false, entregada: false },
    { id: 4, idCliente: 5, total: 30, fecha_entrega: '2024-05-22', idPanadero: null, estado: estadoOrden.PENDIENTE, asignada: false, entregada: false },
    { id: 5, idCliente: 5, total: 30, fecha_entrega: '2024-05-22', idPanadero: 3, estado: estadoOrden.PENDIENTE, asignada: true, entregada: false },
    { id: 6, idCliente: 5, total: 30, fecha_entrega: '2024-07-05', idPanadero: 3, estado: estadoOrden.PENDIENTE, asignada: true, entregada: false },
    { id: 7, idCliente: 5, total: 30, fecha_entrega: '2024-08-03', idPanadero: 3, estado: estadoOrden.PENDIENTE, asignada: true, entregada: false },
    { id: 8, idCliente: 5, total: 30, fecha_entrega: '2024-07-01', idPanadero: 3, estado: estadoOrden.PENDIENTE, asignada: true, entregada: false }
];

exports.ordenes = ordenes;

exports.getOrdenesCompra = (req, res) => {
    res.json(ordenes);
};

exports.getOrdenCompraById = (req, res) => {
    const { id } = req.params;
    const orden = ordenes.find(p => p.id == id);
    if (orden) {
        res.json(orden);
    } else {
        res.status(404).json({ message: 'Orden de compra no encontrada' });
    }
};

exports.getOrdenesCompraSinAsignar = (req, res) => {
    if (ordenes.length > 0) {
        const sinAsignar = ordenes.find(p => p.asignada == false);
        if (sinAsignar.length > 0) {
            res.json(sinAsignar);
        } else {
            res.status(404).json({ message: 'Todas las ordenes han sido asignadas' });
        }
    } else {
        res.status(404).json({ message: 'No existen ordenes' });
    }
};

// Obtiene las oredenes para un cliente especifico
exports.getOrdenCompraParaCliente = (req, res) => {
    const { id } = req.params;
    const ordenesDelUsuario = ordenes.filter(o => o.idCliente == id && !o.entregada);
    if (ordenesDelUsuario.length > 0) {
        res.json(ordenesDelUsuario);
    } else {
        res.status(404).json({ message: 'Ordenes de compras para idCliente no encontradas' });
    }
};

// Obtiene las oredenes y sus pedidos para un panadero especifico
exports.getOrdenesCompraAdmin = async (req, res) => {
    if (ordenes.length > 0) {
        try {
            const pedidosConDetalles = await Promise.all(ordenes.map(async (orden) => {
                const cliente = await obtenerUserById(orden.idCliente);

                if (!cliente) {
                    throw new Error(`Cliente con ID ${orden.idCliente} no encontrado`);
                }
                const pedidosOrden = pedidos.filter(p => p.idOrden == orden.id);
                if (pedidosOrden.length === 0) {
                    throw new Error(`Pedidos para la orden con ID ${orden.id} no encontrados`);
                }
                const cantPedidos = pedidosOrden.length;

                const pedidosDetalles = await Promise.all(pedidosOrden.map(async (pedido) => {
                    const producto = await obtenerProductoById(pedido.idProducto);
                    if (!producto) {
                        throw new Error(`Producto con ID ${pedido.idProducto} no encontrado`);
                    }
                    return {
                        idPedido: pedido.id,
                        idProducto: pedido.idProducto,
                    };
                }));
                return {
                    idOrden: orden.id,
                    idCliente: cliente.id,
                    clienteNombre: cliente.nombre,
                    fecha_entrega: orden.fecha_entrega,
                    cantPedidos: cantPedidos,
                    estadoOrden: orden.estado,
                    //entregada: orden.entregada,
                    pedidos: pedidosDetalles
                };
            }));

            res.json(pedidosConDetalles);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(404).json({ message: 'Ordenes de compras asignadas a idPanadero no encontradas' });
    }
};

// Obtiene las oredenes y sus pedidos para un panadero especifico
exports.getOrdenesCompraPanadero = async (req, res) => {
    const { id } = req.params;
    const ordenesDePanadero = ordenes.filter(o => o.idPanadero == id );

    if (ordenesDePanadero.length > 0) {
        try {
            const pedidosConDetalles = await Promise.all(ordenesDePanadero.map(async (orden) => {
                const cliente = await obtenerUserById(orden.idCliente);

                if (!cliente) {
                    throw new Error(`Cliente con ID ${orden.idCliente} no encontrado`);
                }

                const pedidosOrden = pedidos.filter(p => p.idOrden == orden.id);
                if (pedidosOrden.length === 0) {
                    throw new Error(`Pedidos para la orden con ID ${orden.id} no encontrados`);
                }

                const cantPedidos = pedidosOrden.length;

                const pedidosDetalles = await Promise.all(pedidosOrden.map(async (pedido) => {
                    const producto = await obtenerProductoById(pedido.idProducto);
                    if (!producto) {
                        throw new Error(`Producto con ID ${pedido.idProducto} no encontrado`);
                    }
                    return {
                        idPedido: pedido.id,
                        idProducto: pedido.idProducto,
                        productoNombre: producto.nombre,
                        cantidad: pedido.cantidad,
                        estado: pedido.estado
                    };
                }));

                return {
                    idOrden: orden.id,
                    idCliente: cliente.id,
                    clienteNombre: cliente.nombre,
                    fecha_entrega: orden.fecha_entrega,
                    cantPedidos: cantPedidos,
                    estadoOrden: orden.estado,
                    //esntregada: orden.entregada
                    pedidos: pedidosDetalles
                };
            }));

            res.json(pedidosConDetalles);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(404).json({ message: 'Ordenes de compras asignadas a idPanadero no encontradas' });
    }
};

exports.getOrdenesCompraNoAsignadas = async (req, res) => {
    const ordenesDePanadero = ordenes.filter(o => !o.asignada);
    if (ordenesDePanadero.length > 0) {
        try {
            const pedidosConDetalles = await Promise.all(ordenesDePanadero.map(async (orden) => {
                const cliente = await obtenerUserById(orden.idCliente);
                if (!cliente) {
                    throw new Error(`Cliente con ID ${orden.idCliente} no encontrado`);
                }
                const pedidosOrden = pedidos.filter(p => p.idOrden == orden.id);
                if (pedidosOrden.length === 0) {
                    throw new Error(`Pedidos para la orden con ID ${orden.id} no encontrados`);
                }

                const cantPedidos = pedidosOrden.length;

                const pedidosDetalles = await Promise.all(pedidosOrden.map(async (pedido) => {
                    const producto = await obtenerProductoById(pedido.idProducto);
                    if (!producto) {
                        throw new Error(`Producto con ID ${pedido.idProducto} no encontrado`);
                    }
                    return {
                        idPedido: pedido.id,
                        idProducto: pedido.idProducto,
                    };
                }));

                return {
                    idOrden: orden.id,
                    idCliente: cliente.id,
                    clienteNombre: cliente.nombre,
                    fecha_entrega: orden.fecha_entrega,
                    cantPedidos: cantPedidos,
                    estadoOrden: orden.estado,
                    //esntregada: orden.entregada
                    pedidos: pedidosDetalles
                };
            }));

            res.json(pedidosConDetalles);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(404).json({ message: 'Ordenes de compras asignadas a idPanadero no encontradas' });
    }
};

exports.createOrdenCompra = async (req, res) => {
    const newOrden = req.body;
    const Cliente = usuarios.find(u => u.id == newOrden.idCliente);

    if (!Cliente) {
        return res.status(400).json({ message: 'Cliente no existe' });
    }

    newOrden.id = ordenes.length ? ordenes[ordenes.length - 1].id + 1 : 1;
    console.log('NUEVA ORDEN 2: ', newOrden);
    ordenes.push(newOrden);

    res.status(201).json(newOrden);

};

exports.updateOrdenCompra = (req, res) => {
    const { id } = req.params;
    const updatedOrden = req.body;

    const ordenIndex = ordenes.findIndex(o => o.id == id);
    if (ordenIndex !== -1) {
        ordenes[ordenIndex] = { ...ordenes[ordenIndex], ...updatedOrden };
        res.json(ordenes[ordenIndex]);
    } else {
        res.status(404).json({ message: 'Orden de compra no encontrada' });
    }
};

exports.actualizarEstadoOrdenCompra = (req, res) => {
    const { id } = req.params;
    //console.log('Id llego a funcion actualizar orden', id);
    const orden = ordenes.find(o => o.id == id);

    //console.log('Encontro orden', orden);

    if (orden) {
        try {
            const pedidosOrden = pedidos.filter(p => p.idOrden == orden.id);
            if (pedidosOrden.length === 0) {
                throw new Error(`Pedidos para la orden con ID ${orden.id} no encontrados`);
            } else {
                let pedidosEstado = pedidosOrden.filter(p => p.estado == estadoPedido.LISTO);
                //console.log('Pedidos estado 1: ', pedidosEstado);
                if (pedidosEstado.length == pedidosOrden.length) {
                    orden.estado = estadoOrden.LISTO_PARA_RECOGER;
                } else {
                    pedidosEstado = pedidosOrden.filter(p => p.estado == estadoPedido.EN_PREPARACION);
                    //console.log('Pedidos estado 2: ', pedidosEstado);
                    if (pedidosEstado.length == pedidosOrden.length) {
                        if (orden.estado == estadoOrden.PENDIENTE) {
                            orden.estado = estadoOrden.EN_PREPARACION;
                        }
                    } else {
                        pedidosEstado = pedidosOrden.filter(p => p.estado == estadoPedido.LISTO || p.estado == estadoPedido.EN_PREPARACION);
                        //console.log('Pedidos estado 3: ', pedidosEstado);
                        if (pedidosEstado.length > 0 && pedidosEstado.length < pedidosOrden.length) {
                            if (orden.estado == estadoOrden.PENDIENTE) {
                                orden.estado = estadoOrden.EN_PREPARACION;
                            }
                        }
                    }
                }
            }
            res.json(orden);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(404).json({ message: 'Orden de compra no encontrada' });
    }
};

exports.InfoFiltroInsumosPanadero = async (req, res) => {
    const { id } = req.params;
    //console.log('ID PANADERO: ',id);
    const ordenesRestantes = ordenes.filter(o => o.estado != estadoOrden.LISTO_PARA_RECOGER && o.idPanadero === parseInt(id));
    //console.log('ORDENES RESTANTES',ordenesRestantes);
    if (ordenesRestantes.length > 0) {
        try {
            console.log('ENTRA TRY');
            const pedidosInfo = await Promise.all(ordenesRestantes.map(async (orden) => {
                //console.log('ENTRA PROMISE 1');
                let insumosTotales = [];
                const insumosObtenidos = await getInsumosPedido(orden.id);
                //console.log('INSUMOS:', insumosObtenidos);

                for (const insumo of insumosObtenidos) {
                    const existeInsumo = insumosTotales.find(i => i.insumoNombre === insumo.insumoNombre);
                    if (existeInsumo) {
                        existeInsumo.totalInsumo += insumo.totalInsumo;
                    } else {
                        insumosTotales.push({
                            insumoNombre: insumo.insumoNombre,
                            totalInsumo: insumo.totalInsumo,
                        });
                    }
                }

                //console.log('insumosTotales: ',insumosTotales);

                return {
                    fecha_entrega: orden.fecha_entrega,
                    estadoOrden: orden.estado,
                    insumos: insumosTotales
                };
            }));

            res.json(pedidosInfo);
        } catch (error) {
            res.status(500).json({ message: `Error al procesar las órdenes: ${error.message}` });
        }
    } else {
        res.status(404).json({ message: 'Ordenes de compras asignadas a idPanadero no encontradas' });
    }
};

exports.InfoFiltroInsumosAdmin = async (req, res) => {
    //console.log('ID PANADERO: ',id);
    const ordenesRestantes = ordenes.filter(o => o.estado != estadoOrden.LISTO_PARA_RECOGER);
    //console.log('ORDENES RESTANTES',ordenesRestantes);
    if (ordenesRestantes.length > 0) {
        try {
            console.log('ENTRA TRY');
            const pedidosInfo = await Promise.all(ordenesRestantes.map(async (orden) => {
                //console.log('ENTRA PROMISE 1');
                let insumosTotales = [];
                const insumosObtenidos = await getInsumosPedido(orden.id);
                //console.log('INSUMOS:', insumosObtenidos);

                for (const insumo of insumosObtenidos) {
                    const existeInsumo = insumosTotales.find(i => i.insumoNombre === insumo.insumoNombre);
                    if (existeInsumo) {
                        existeInsumo.totalInsumo += insumo.totalInsumo;
                    } else {
                        insumosTotales.push({
                            insumoNombre: insumo.insumoNombre,
                            totalInsumo: insumo.totalInsumo,
                        });
                    }
                }

                //console.log('insumosTotales: ',insumosTotales);

                return {
                    fecha_entrega: orden.fecha_entrega,
                    estadoOrden: orden.estado,
                    insumos: insumosTotales
                };
            }));

            res.json(pedidosInfo);
        } catch (error) {
            res.status(500).json({ message: `Error al procesar las órdenes: ${error.message}` });
        }
    } else {
        res.status(404).json({ message: 'Ordenes de compras asignadas a idPanadero no encontradas' });
    }
};

exports.asignarOrdenPanadero = (req, res) => {
    const { idPanadero, idOrden } = req.params;

    const orden = ordenes.find(o => o.id == parseInt(idOrden));
    if (orden) {
        orden.idPanadero = parseInt(idPanadero);
        orden.asignada = true;
        res.json(orden);
    } else {
        res.status(404).json({ message: 'Orden de compra no encontrada' });
    }
};

exports.cambioEstadoEntregada = (req, res) => {
    const { id } = req.params;

    const orden = ordenes.find(o => o.id == id);
    if (orden) {
        orden.entregada = true;
        res.json({
            message: 'Estado de entrega actualizado correctamente',
        });
    } else {
        res.status(404).json({ message: 'Orden de compra no encontrada' });
    }
};

exports.deleteOrdenCompra = (req, res) => {
    const { id } = req.params;
    const ordenIndex = ordenes.findIndex(o => o.id == id);
    if (ordenIndex !== -1) {
        const deletedOrden = ordenes.splice(ordenIndex, 1);
        res.json(deletedOrden);
    } else {
        res.status(404).json({ message: 'Orden de compra no encontrada' });
    }
};

exports.getOrdenCompraParaCliente2 = async (req, res) => {
    try {
        const { id, email } = req.params; 
        const ordenesDelUsuario = ordenes.filter(o => o.id == id );

        if (ordenesDelUsuario.length === 0) {
            return res.status(404).json({ message: 'No se encontraron órdenes para el cliente con estado LISTO PARA RECOGER' });
        }

        const pedidosConDetalles = await Promise.all(ordenesDelUsuario.map(async (orden) => {
            const cliente = await obtenerUserById(orden.idCliente);
            if (!cliente) {
                throw new Error(`Cliente con ID ${orden.idCliente} no encontrado`);
            }

            const pedidosOrden = pedidos.filter(p => p.idOrden == orden.id);
            if (pedidosOrden.length === 0) {
                throw new Error(`Pedidos para la orden con ID ${orden.id} no encontrados`);
            }

            const cantPedidos = pedidosOrden.length;

            const pedidosDetalles = await Promise.all(pedidosOrden.map(async (pedido) => {
                const producto = await obtenerProductoById(pedido.idProducto);
                if (!producto) {
                    throw new Error(`Producto con ID ${pedido.idProducto} no encontrado`);
                }
                return {
                    idPedido: pedido.id,
                    idProducto: pedido.idProducto,
                    nombre: producto.nombre,
                    cantidad: pedido.cantidad,
                    precioUnitario: producto.precio,
                    subtotal: pedido.cantidad * producto.precio
                };
            }));

            // Construir contenido del correo electrónico
            const emailContent = `
                <div class="card">
                    <h1>Detalles de la Orden</h1>
                    <p>Orden ID: ${orden.id}</p>
                    <p>Fecha de Entrega: ${orden.fecha_entrega}</p> <!-- Asegúrate de tener la fecha de entrega -->
                    <p>Productos:</p>
                    <ul>
                        ${pedidosDetalles.map(p => `
                            <li>
                                <div class="producto-detalle">
                                    <span class="nombre-producto">${p.nombre}</span>
                                    <span class="cantidad-producto">Cantidad: ${p.cantidad}</span>
                                    <span class="total-producto">Total: $${p.subtotal.toFixed(2)}</span>
                                </div>
                            </li>`).join('')}
                    </ul>
                    <p class="total-final">Total: $${pedidosDetalles.reduce((acc, p) => acc + p.subtotal, 0).toFixed(2)}</p>
                  <p class="total-final">ESTADO:  ${orden.estado}</p>
                    </div>
            `;

            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASSWORD
                }
            });

            const mailOptions = {
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
                        <p>Hola!</p>
                        <p>Gracias por tu pedido en PanaderiaRIA. Aquí están los detalles de tu pedido:</p>
                        ${emailContent}
                        <p>Atentamente,</p>
                        <p>El equipo de PanaderiaRIA</p>
                    </body>
                    </html>`
            };

            // Enviar correo electrónico
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Error al enviar el correo electrónico', error: error.message });
                } else {
                    console.log('Email enviado: ' + info.response);
                    res.status(200).json({ message: 'Correo enviado exitosamente', pedidos: pedidosDetalles });
                }
            });

            // Retornar detalles de la orden para incluir en la respuesta JSON
            return {
                idOrden: orden.id,
                idCliente: cliente.id,
                clienteNombre: cliente.nombre,
                fecha_entrega: orden.fecha_entrega,
                cantPedidos: cantPedidos,
                estadoOrden: orden.estado,
                pedidos: pedidosDetalles
            };
        }));

        res.status(200).json(pedidosConDetalles); // Devolver detalles de las órdenes al finalizar
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ message: 'Error al obtener órdenes para el cliente', error: error.message });
    }
};
