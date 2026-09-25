import { useState } from "react"
import ListaProductos from "./components/ListaProductos"
import Carrito from "./components/Carrito"
import productos from "./data/productos"
import "./App.css"

function App() {
  // Estado que almacena los productos agregados al carrito.
  const [carrito, setCarrito] = useState([])

  // Estado que almacena el texto escrito en el buscador.
  const [busqueda, setBusqueda] = useState("")

  // Agrega un producto al carrito.
  const agregarAlCarrito = (producto) => {
    const productoExistente = carrito.find(
      (item) => item.id === producto.id
    )

    if (productoExistente) {
      setCarrito(
        carrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      )
    } else {
      setCarrito([
        ...carrito,
        { ...producto, cantidad: 1 }
      ])
    }
  }

  // Elimina un producto específico del carrito.
  const eliminarDelCarrito = (id) => {
    setCarrito(
      carrito.filter((producto) => producto.id !== id)
    )
  }

  // Filtra los productos según el texto ingresado.
  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  const cantidadTotal = carrito.reduce(
    (total, producto) => total + producto.cantidad,
    0
  )

  return (
    <>
      <header className="header">
        <div className="header-contenido">
          <h1>Portal Gamer</h1>
          <p>Tu tienda de videojuegos</p>

          <div className="contador-carrito">
            Carrito: {cantidadTotal} producto(s)
          </div>
        </div>
      </header>

      <main className="contenedor">
        <section className="buscador">
          <label htmlFor="buscarProducto">
            Buscar videojuego
          </label>

          <input
            id="buscarProducto"
            type="text"
            placeholder="Ejemplo: Minecraft"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
          />
        </section>

        {productosFiltrados.length > 0 ? (
          <ListaProductos
            productos={productosFiltrados}
            agregarAlCarrito={agregarAlCarrito}
          />
        ) : (
          <p className="sin-resultados">
            No se encontraron videojuegos.
          </p>
        )}

        <Carrito
          carrito={carrito}
          eliminarDelCarrito={eliminarDelCarrito}
        />
      </main>

      <footer className="footer">
        <p>Portal Gamer - Desarrollo Frontend I</p>
      </footer>
    </>
  )
}

export default App