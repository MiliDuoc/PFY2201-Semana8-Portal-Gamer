function ProductoCard({ producto, agregarAlCarrito }) {
  return (
    <div className="producto-card">
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="producto-imagen"
      />

      <div className="producto-contenido">
        <h3>{producto.nombre}</h3>

        <p className="producto-descripcion">
          {producto.descripcion}
        </p>

        <p className="precio-normal">
          Precio normal: ${producto.precioNormal.toLocaleString("es-CL")}
        </p>

        <p className="precio-oferta">
          Oferta: ${producto.precioOferta.toLocaleString("es-CL")}
        </p>

        <button
          className="btn-agregar"
          onClick={() => agregarAlCarrito(producto)}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  )
}

export default ProductoCard