import ProductoCard from "./ProductoCard"

function ListaProductos({ productos, agregarAlCarrito }) {
  return (
    <section className="productos">
      <h2>Nuestros videojuegos</h2>

      <div className="productos-grid">
        {productos.map((producto) => (
          <ProductoCard
            key={producto.id}
            producto={producto}
            agregarAlCarrito={agregarAlCarrito}
          />
        ))}
      </div>
    </section>
  )
}

export default ListaProductos