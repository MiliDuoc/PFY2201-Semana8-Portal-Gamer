import { useEffect, useState } from "react"
import ListaProductos from "./components/ListaProductos"
import Carrito from "./components/Carrito"
import "./App.css"

// Obtiene y valida los productos desde el archivo JSON.
const obtenerProductos = async () => {
  const respuesta = await fetch(
    `${import.meta.env.BASE_URL}productos.json`
  )

  if (!respuesta.ok) {
    throw new Error("Error al cargar los productos")
  }

  const datos = await respuesta.json()

  if (!Array.isArray(datos)) {
    throw new Error("Formato de productos no válido")
  }

  return datos
}

function App() {
  // Estado que almacena los productos cargados desde el archivo JSON.
  const [productos, setProductos] = useState([])

  // Estado para mostrar un mensaje mientras se cargan los productos.
  const [cargando, setCargando] = useState(true)

  // Estado para controlar posibles errores durante la carga.
  const [error, setError] = useState("")

  // Estado para mostrar mensajes después de las acciones del usuario.
  const [mensaje, setMensaje] = useState("")

  // Recupera el carrito guardado en localStorage al iniciar la aplicación.
  const [carrito, setCarrito] = useState(() => {
    try {
      const carritoGuardado = localStorage.getItem("carrito")

      return carritoGuardado
        ? JSON.parse(carritoGuardado)
        : []
    } catch {
      return []
    }
  })

  // Estado que almacena el texto escrito en el buscador.
  const [busqueda, setBusqueda] = useState("")

  // Carga los productos automáticamente al iniciar la aplicación.
  useEffect(() => {
    let componenteActivo = true

    const cargarProductosIniciales = async () => {
      try {
        const datos = await obtenerProductos()

        if (componenteActivo) {
          setProductos(datos)
        }
      } catch {
        if (componenteActivo) {
          setError(
            "No fue posible cargar los videojuegos. Intenta nuevamente."
          )
        }
      } finally {
        if (componenteActivo) {
          setCargando(false)
        }
      }
    }

    cargarProductosIniciales()

    return () => {
      componenteActivo = false
    }
  }, [])

  // Guarda automáticamente el carrito cada vez que cambia.
  useEffect(() => {
    localStorage.setItem(
      "carrito",
      JSON.stringify(carrito)
    )
  }, [carrito])

  // Oculta automáticamente las notificaciones después de unos segundos.
  useEffect(() => {
    if (!mensaje) return

    const temporizador = setTimeout(() => {
      setMensaje("")
    }, 2500)

    return () => clearTimeout(temporizador)
  }, [mensaje])

  // Permite volver a intentar la carga después de un error.
  const reintentarCarga = async () => {
    try {
      setCargando(true)
      setError("")

      const datos = await obtenerProductos()

      setProductos(datos)
    } catch {
      setError(
        "No fue posible cargar los videojuegos. Intenta nuevamente."
      )
    } finally {
      setCargando(false)
    }
  }

  // Agrega un producto al carrito y muestra una confirmación visual.
  const agregarAlCarrito = (producto) => {
    setCarrito((carritoActual) => {
      const productoExistente = carritoActual.find(
        (item) => item.id === producto.id
      )

      if (productoExistente) {
        return carritoActual.map((item) =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + 1,
              }
            : item
        )
      }

      return [
        ...carritoActual,
        {
          ...producto,
          cantidad: 1,
        },
      ]
    })

    setMensaje(
      `${producto.nombre} fue agregado al carrito.`
    )
  }

  // Solicita confirmación antes de eliminar un producto.
  const eliminarDelCarrito = (id) => {
    const productoAEliminar = carrito.find(
      (producto) => producto.id === id
    )

    if (!productoAEliminar) return

    const confirmarEliminacion = window.confirm(
      `¿Deseas eliminar ${productoAEliminar.nombre} del carrito?`
    )

    if (!confirmarEliminacion) return

    setCarrito(
      carrito.filter(
        (producto) => producto.id !== id
      )
    )

    setMensaje(
      `${productoAEliminar.nombre} fue eliminado del carrito.`
    )
  }

  // Filtra los productos según el texto ingresado.
  const productosFiltrados = productos.filter(
    (producto) =>
      producto.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase())
  )

  // Calcula la cantidad total de productos del carrito.
  const cantidadTotal = carrito.reduce(
    (total, producto) =>
      total + producto.cantidad,
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
        {mensaje && (
          <div
            className="notificacion"
            role="status"
          >
            {mensaje}
          </div>
        )}

        <section className="buscador">
          <label htmlFor="buscarProducto">
            Buscar videojuego
          </label>

          <input
            id="buscarProducto"
            type="text"
            placeholder="Ejemplo: Minecraft"
            value={busqueda}
            onChange={(evento) =>
              setBusqueda(evento.target.value)
            }
          />
        </section>

        {cargando ? (
          <p className="estado-carga">
            Cargando videojuegos...
          </p>
        ) : error ? (
          <div className="estado-error">
            <p>{error}</p>

            <button
              className="btn-reintentar"
              onClick={reintentarCarga}
            >
              Reintentar
            </button>
          </div>
        ) : productosFiltrados.length > 0 ? (
          <ListaProductos
            productos={productosFiltrados}
            agregarAlCarrito={
              agregarAlCarrito
            }
            carrito={carrito}
          />
        ) : (
          <p className="sin-resultados">
            No se encontraron videojuegos.
          </p>
        )}

        <Carrito
          carrito={carrito}
          eliminarDelCarrito={
            eliminarDelCarrito
          }
        />
      </main>

      <footer className="footer">
        <p>
          Portal Gamer - Desarrollo Frontend I
        </p>
      </footer>
    </>
  )
}

export default App