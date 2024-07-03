const { obtenerProductoById } = require('./productosController');
const { obtenerUserById } = require('./usuariosController');
const { getInsumosPedido } = require('./pedidosController');
const { usuarios } = require('./usuariosController');
const { pedidos } = require('./pedidosController');
const estadoOrden = require('../enums/estadoOrden');
const estadoPedido = require('../enums/estadoPedido');
const { insumos } = require('./insumosController');

const ordenes = [
    { id: 1, idCliente: 5, total: 30, fecha_entrega: '2024-05-22', idPanadero: 3, estado: estadoOrden.PENDIENTE, asignada: true },
    { id: 2, idCliente: 5, total: 100, fecha_entrega: '2024-06-02', idPanadero: 3, estado: estadoOrden.PENDIENTE, asignada: true },
    { id: 3, idCliente: 5, total: 30, fecha_entrega: '2024-05-22', idPanadero: null, estado: estadoOrden.PENDIENTE, asignada: false },
    { id: 4, idCliente: 5, total: 30, fecha_entrega: '2024-05-22', idPanadero: null, estado: estadoOrden.PENDIENTE, asignada: false },
    { id: 5, idCliente: 5, total: 30, fecha_entrega: '2024-05-22', idPanadero: 3, estado: estadoOrden.PENDIENTE, asignada: true },
    { id: 6, idCliente: 5, total: 30, fecha_entrega: '2024-07-05', idPanadero: 3, estado: estadoOrden.PENDIENTE, asignada: true },
    { id: 7, idCliente: 5, total: 30, fecha_entrega: '2024-08-03', idPanadero: 3, estado: estadoOrden.PENDIENTE, asignada: true },
    { id: 8, idCliente: 5, total: 30, fecha_entrega: '2024-07-01', idPanadero: 3, estado: estadoOrden.PENDIENTE, asignada: true }
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
    const ordenesDelUsuario = ordenes.filter(o => o.idCliente == id);
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
    const ordenesDePanadero = ordenes.filter(o => o.idPanadero == id && o.estado != estadoOrden.LISTO_PARA_RECOGER);

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

// Falta ruta, Funcion que obtiene ordenes asignadas a un panadero para un cliente especifico
exports.getOrdenesCompraPanaderoCliente = async (req, res) => {
    const { idPan, idCli } = req.params;
    const ordenesPanadero = ordenes.filter(o => o.idPanadero === parseInt(idPan));
    const ordenesPanaderoCliente = ordenesPanadero.filter(op => op.idCliente === parseInt(idCli));

    if (ordenesPanadero.length > 0) {
        if (ordenesPanaderoCliente.length > 0) {
            try {
                const pedidosConDetalles = await Promise.all(ordenesPanaderoCliente.map(async (orden) => {
                    const cliente = await obtenerUserById(orden.idCliente);
                    if (!cliente) {
                        throw new Error(`Cliente con ID ${orden.idCliente} no encontrado`);
                    }

                    const pedidosOrden = pedidos.filter(p => p.idOrden == orden.id);
                    if (pedidosOrden.length === 0) {
                        throw new Error(`Pedidos para la orden con ID ${orden.id} no encontrados`);
                    }

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
                        estadoOrden: orden.estado,
                        pedidos: pedidosDetalles
                    };
                }));

                res.json(pedidosConDetalles);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        } else {
            res.status(404).json({ message: 'Ordenes de compras asignadas a cliente para este panadero no encontradas' });
        }
    } else {
        res.status(404).json({ message: 'Ordenes de compras asignadas a este panadero no encontradas' });
    }
};

exports.getOrdenesCompraNoAsignadas = async (req, res) => {
    const ordenesDePanadero = ordenes.filter(o => !o.asignada);
    console.log('ordenesssss',ordenesDePanadero) ;
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

exports.createOrdenCompra = (req, res) => {
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


// Funcion para filtro de insumos para pedidos de ordenes
exports.InfoFiltroInsumos = async (req, res) => {
    const ordenesRestantes = ordenes.filter(o => o.estado != estadoOrden.LISTO_PARA_RECOGER);
    //console.log('ORDENES RESTANTES',ordenesRestantes);
    if (ordenesRestantes.length > 0) {
        try {
            //console.log('ENTRA TRY');
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
