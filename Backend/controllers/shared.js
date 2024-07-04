let pedidosModule;
let eliminarProductoInsumoFunction;
let estadoPedidoModule;

function init(pedidos, eliminarProductoInsumo, estadoPedido) {
  pedidosModule = pedidos;
  eliminarProductoInsumoFunction = eliminarProductoInsumo;
  estadoPedidoModule = estadoPedido;
}

function deleteProducto(id, productos, productoInsumosss) {
  return new Promise((resolve, reject) => {
    const pedidosProducto = pedidosModule.filter(pedido => pedido.idProducto == id);

    const idProductosPedidos = pedidosProducto.map(pedido => pedido.idProducto);

    if (pedidosProducto.length > 0) {
      const puedeEliminar = pedidosProducto.every(pedido => pedido.estado === estadoPedidoModule.LISTO);
      if (!puedeEliminar) {
        return reject(new Error('No se puede eliminar el producto porque hay pedidos pendientes.'));
      }
    }

    const productoIndex = productos.findIndex(p => p.id == id);

    if (productoIndex !== -1) {
      const deletedProducto = productos[productoIndex];
      const productoInsumoIndexs = productoInsumosss.filter(p => p.idProducto == id);

      productoInsumoIndexs.forEach(pi => eliminarProductoInsumoFunction(pi.idProducto));

      productos.splice(productoIndex, 1);
      resolve({ message: 'Producto y sus insumos asociados eliminados!' });
    } else {
      reject(new Error('Producto no encontrado'));
    }
  });
}

module.exports = {
  deleteProducto,
  init
};
