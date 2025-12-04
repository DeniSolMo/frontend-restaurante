import React, { useEffect, useState } from 'react';
import { listarTodosLosProductos, updateProducto } from '../services/ProductoService'; 
import { FaEdit, FaBan, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const ListProductoComponent = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");               // 🔍 filtro por nombre
  const [tipoFiltro, setTipoFiltro] = useState("");           // 🎯 filtro por tipo
  const [precioMin, setPrecioMin] = useState("");             // 💰 precio mínimo
  const [precioMax, setPrecioMax] = useState("");             // 💰 precio máximo

  const navegar = useNavigate();

  function getAllProductos() {
    listarTodosLosProductos()
      .then(response => setProductos(response.data))
      .catch(error => console.error(error));
  }

  useEffect(() => {
    getAllProductos();
  }, []);

  function handleEdit(id_producto) {
    navegar(`/editar-producto/${id_producto}`);
  }

  function handleToggleEstado(productoAActualizar) {
    const productoActualizado = {
      ...productoAActualizar,
      estado: !productoAActualizar.estado
    };

    updateProducto(productoAActualizar.id_producto, productoActualizado)
      .then(() => {
        console.log(`Estado del producto ID ${productoAActualizar.id_producto} cambiado.`);
        setProductos(productos.map(p => 
          p.id_producto === productoAActualizar.id_producto ? productoActualizado : p
        ));
      })
      .catch(error => console.error(error));
  }

  // 🟦 OBTENER lista de tipos automáticamente
  const tipos = [...new Set(productos.map(p => p.tipo?.tipo))];

  // 🟩 FILTRAR PRODUCTOS
  const productosFiltrados = productos.filter(p => {
    const nombreCoincide =
      p.nombreProducto.toLowerCase().includes(busqueda.toLowerCase());

    const tipoCoincide =
      tipoFiltro === "" || p.tipo?.tipo === tipoFiltro;

    const precio = parseFloat(p.precioProducto);

    const precioMinOK = precioMin === "" || precio >= parseFloat(precioMin);
    const precioMaxOK = precioMax === "" || precio <= parseFloat(precioMax);

    return nombreCoincide && tipoCoincide && precioMinOK && precioMaxOK;
  });

  return (
    <div className="container">
      <h2 className="title">Gestión de Productos</h2>

      {/* 🔍 BUSCAR POR NOMBRE */}
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          fontSize: "16px"
        }}
      />

      {/* 🎯 FILTRO POR TIPO */}
      <select
        value={tipoFiltro}
        onChange={(e) => setTipoFiltro(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          fontSize: "16px"
        }}
      >
        <option value="">Todos los tipos</option>
        {tipos.map((t, i) => (
          <option key={i} value={t}>{t}</option>
        ))}
      </select>

      {/* 💰 FILTROS POR PRECIO */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <input
          type="number"
          placeholder="Precio mínimo"
          value={precioMin}
          onChange={(e) => setPrecioMin(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            fontSize: "16px"
          }}
        />
        <input
          type="number"
          placeholder="Precio máximo"
          value={precioMax}
          onChange={(e) => setPrecioMax(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            fontSize: "16px"
          }}
        />
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Tipo</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map(producto => (
            <tr key={producto.id_producto} className={producto.estado ? '' : 'product-suspended'}>
              <td>{producto.id_producto}</td>
              <td>{producto.nombreProducto}</td>
              <td>{producto.descripcionProducto}</td>
              <td>${parseFloat(producto.precioProducto).toFixed(2)}</td>
              <td>{producto.tipo?.tipo}</td>

              <td>
                {producto.imagen_ruta ? (
                  <img
                    //src={`http://localhost:7073/api/files/${producto.imagen_ruta}`}
                    src={`https://fonda-productos-production.up.railway.app/api/files/${producto.imagen_ruta}`}
                    alt={producto.nombreProducto}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }}
                  />
                ) : (
                  <span>Sin imagen</span>
                )}
              </td>

              <td>
                <div className="actions">
                  <button className="btn btn-edit" onClick={() => handleEdit(producto.id_producto)}>
                    <FaEdit /> Editar
                  </button>

                  <button
                    className={`btn ${producto.estado ? 'btn-delete' : 'btn-activate'}`}
                    onClick={() => handleToggleEstado(producto)}
                  >
                    {producto.estado
                      ? <><FaBan /> Suspender</>
                      : <><FaCheckCircle /> Activar</>
                    }
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
