const { obtenerProductoById } = require('./productosController');
const { ObtenerProductoInsumosByProductoId } = require('./productoInsumoController');
const { obtenerinsumoById } = require('./insumosController')
const { productos } = require('./productosController');
const { insumos } = require('./insumosController')
const { productoInsumos } = require('./productoInsumoController')
const estadoPedido = require('../enums/estadoPedido')

let pedidos = [
    { id: 1, idProducto: 1, idOrden: 1, cantidad: 2, estado: estadoPedido.PENDIENTE },
    { id: 2, idProducto: 2, idOrden: 1, cantidad: 1, estado: estadoPedido.PENDIENTE },
    { id: 3, idProducto: 2, idOrden: 2, cantidad: 1, estado: estadoPedido.PENDIENTE },
    { id: 4, idProducto: 4, idOrden: 2, cantidad: 4, estado: estadoPedido.PENDIENTE },
    { id: 5, idProducto: 1, idOrden: 3, cantidad: 2, estado: estadoPedido.PENDIENTE },
    { id: 6, idProducto: 2, idOrden: 3, cantidad: 1, estado: estadoPedido.PENDIENTE },
    { id: 7, idProducto: 2, idOrden: 4, cantidad: 1, estado: estadoPedido.PENDIENTE },
    { id: 8, idProducto: 4, idOrden: 4, cantidad: 4, estado: estadoPedido.PENDIENTE },
    { id: 9, idProducto: 1, idOrden: 5, cantidad: 2, estado: estadoPedido.PENDIENTE },
    { id: 10, idProducto: 2, idOrden: 5, cantidad: 1, estado: estadoPedido.PENDIENTE },
    { id: 11, idProducto: 2, idOrden: 5, cantidad: 1, estado: estadoPedido.PENDIENTE },
    { id: 12, idProducto: 4, idOrden: 5, cantidad: 4, estado: estadoPedido.PENDIENTE },
    { id: 13, idProducto: 4, idOrden: 6, cantidad: 4, estado: estadoPedido.PENDIENTE },
    { id: 14, idProducto: 1, idOrden: 7, cantidad: 2, estado: estadoPedido.PENDIENTE },
    { id: 15, idProducto: 2, idOrden: 7, cantidad: 1, estado: estadoPedido.PENDIENTE },
    { id: 16, idProducto: 2, idOrden: 8, cantidad: 1, estado: estadoPedido.PENDIENTE },
    { id: 17, idProducto: 4, idOrden: 8, cantidad: 4, estado: estadoPedido.PENDIENTE }
];

exports.pedidos = pedidos;

exports.getPedidos = (req, res) => {
    res.json(pedidos);
};

exports.getPedidoById = (req, res) => {
    const { id } = req.params;
    const pedido = pedidos.find(p => p.id == id);
    if (pedido) {
        res.json(pedido);
    } else {
        res.status(404).json({ message: 'Pedido no encontrado' });
    }
};

exports.getPedidosByOrdenId = async (req, res) => {
    const { id } = req.params;
    const pedidosOrden = pedidos.filter(p => p.idOrden == id);

    if (pedidosOrden.length > 0) {
        try {
            const pedidosConDetalles = await Promise.all(pedidosOrden.map(async (pedido) => {
                const producto = await obtenerProductoById(pedido.idProducto);
                if (!producto) {
                    throw new Error(`Producto con ID ${pedido.idProducto} no encontrado`);
                }
                const total = producto.precio * pedido.cantidad;
                return {
                    nombre: producto.nombre,
                    cantidad: pedido.cantidad,
                    total: total,
                    estado: pedido.estado
                };
            }));

            res.json(pedidosConDetalles);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(404).json({ message: 'Pedidos para ese idOrden no encontrados' });
    }
};

exports.getPedidosPanaderoByOrdenId = async (req, res) => {
    const { id } = req.params;
    const pedidosOrden = pedidos.filter(p => p.idOrden == id);

    if (pedidosOrden.length > 0) {
        try {
            const pedidosConDetalles = await Promise.all(pedidosOrden.map(async (pedido) => {
                const producto = await obtenerProductoById(pedido.idProducto);
                if (!producto) {
                    throw new Error(`Producto con ID ${pedido.idProducto} no encontrado`);
                }
                return {
                    idOrden: pedido.idOrden,
                    idPedido: pedido.id,
                    idProducto: producto.id,
                    productoNombre: producto.nombre,
                    cantidad: pedido.cantidad,
                    estado: pedido.estado
                };
            }));

            res.json(pedidosConDetalles);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(404).json({ message: 'Pedidos para ese idOrden no encontrados' });
    }
};


//funciones para filtro
// Obtiene los insumos y cantidades para un pedido especifico
exports.getInsumosPedido = async (id) => {
    const pedidosOrden = pedidos.filter(p => p.idOrden == id);

    if (pedidosOrden.length > 0) {
        try {
            const totalInsumos = [];

            const insumosProd = await Promise.all(pedidosOrden.map(async (pedidoOrden) => {
                const insumos = await ObtenerProductoInsumosByProductoId(pedidoOrden.idProducto);
                if (!insumos) {
                    throw new Error(`Insumos con ID ${pedidoOrden.idProducto} no encontrados`);
                }

                return Promise.all(insumos.map(async (insumo) => {
                    const ins = await obtenerinsumoById(insumo.idInsumo);
                    const totalInsumo = insumo.cantidad * pedidoOrden.cantidad;
                    return {
                        insumoNombre: ins.nombre,
                        totalInsumo: totalInsumo,
                    };
                }));
            }));

            for (const listaInsumos of insumosProd) {
                for (const insumo of listaInsumos) {
                    const existeInsumo = totalInsumos.find(i => i.insumoNombre === insumo.insumoNombre);
                    if (existeInsumo) {
                        existeInsumo.totalInsumo += insumo.totalInsumo;
                    } else {
                        totalInsumos.push({
                            insumoNombre: insumo.insumoNombre,
                            totalInsumo: insumo.totalInsumo,
                        });
                    }
                }
            }
            console.log('Finalmente se obtuvo: ', totalInsumos);
            return totalInsumos;
        } catch (error) {
            throw new Error(error.message);
        }
    } else {
        throw new Error('No se encontraron pedidos para la Orden');
    }
};



//GetInsumosTotal para pedidos
exports.getInsumosTotales = async (req, res) => {
    const { id } = req.params;
    const pedido = pedidos.find(p => p.id == id)

    if (!pedido) {
        return res.status(404).json({ message: 'No se encontro el pedido' });
    }

    try {
        const insumosProd = await ObtenerProductoInsumosByProductoId(pedido.idProducto);
        if (insumosProd) {
            //console.log('Insumos', insumosProd)
            const insumosDetalle = await Promise.all(insumosProd.map(async (insumoProd) => {
                const insumo = await obtenerinsumoById(insumoProd.idInsumo);
                //console.log('INSUMO: ', insumo);
                if (!insumo) {
                    throw new Error(`Insumo con ID ${insumoProd.idInsumo} no encontrado`);
                }
                //console.log('CANT INSUMO: ', insumoProd.cantidad);
                //console.log('CANT PEDIDO: ', pedido.cantidad)
                const cantTotal = (insumoProd.cantidad * pedido.cantidad);
                return {
                    idInsumo: insumoProd.idInsumo,
                    idPedido: pedido.id,
                    idProducto: pedido.idProducto,
                    insumoNombre: insumo.nombre,
                    cantidadIndividual: insumoProd.cantidad,
                    cantidadTotal: cantTotal,
                };
            }));
            res.json(insumosDetalle);
        } else {
            res.status(404).json({ message: 'Insumos de producto no encontrados' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.postPedido = (req, res) => {
    const newPedido = req.body;

    const producto = productos.find(p => p.id == newPedido.idProducto);
    //const orden = ordenes.find(o => o.id == newPedido.idOrden);

    if (!producto) {
        return res.status(400).json({ message: 'Producto o Orden no existe' });
    }

    newPedido.id = pedidos.length ? pedidos[pedidos.length - 1].id + 1 : 1;
    pedidos.push(newPedido);
    res.status(201).json(newPedido);
};

exports.updatePedido = (req, res) => {
    const { id } = req.params;
    const updatedPedido = req.body;

    const pedidoIndex = pedidos.findIndex(p => p.id == id);
    if (pedidoIndex !== -1) {
        pedidos[pedidoIndex] = { ...pedidos[pedidoIndex], ...updatedPedido };
        res.json(pedidos[pedidoIndex]);
    } else {
        res.status(404).json({ message: 'Pedido no encontrado' });
    }
};

exports.updatePedidoEstado = async (req, res) => {
    const { id } = req.params;
    const pedidoIndex = pedidos.findIndex(p => p.id == id);
    if (pedidoIndex !== -1) {
        if (pedidos[pedidoIndex].estado === estadoPedido.PENDIENTE) {
            pedidos[pedidoIndex].estado = estadoPedido.EN_PREPARACION;
        } else if (pedidos[pedidoIndex].estado === estadoPedido.EN_PREPARACION) {
            pedidos[pedidoIndex].estado = estadoPedido.LISTO;
        }
        try {
            res.json(pedidos[pedidoIndex]);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(404).json({ message: 'Pedido no encontrado' });
    }
};


exports.deletePedido = (req, res) => {
    const { id } = req.params;
    const pedidoIndex = pedidos.findIndex(p => p.id == id);
    if (pedidoIndex !== -1) {
        const deletedPedido = pedidos.splice(pedidoIndex, 1);
        res.json(deletedPedido);
    } else {
        res.status(404).json({ message: 'Pedido no encontrado' });
    }
};
