import React, { useEffect, useState } from 'react';
import { listarVentas, deleteVenta } from '../services/VentaService'; 
import { listClientes } from '../services/ClienteService';
import { listarEmpleados } from '../services/EmpleadoService';
import { listarAtenciones } from '../services/AtenderService';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const ListVentaComponent = () => {
    const [ventasEnriquecidas, setVentasEnriquecidas] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔍 Filtro por fecha
    const [fechaFiltro, setFechaFiltro] = useState("");

    const navegar = useNavigate();

    const cargarDatos = () => {
        setLoading(true);

        Promise.all([
            listarVentas(),
            listClientes(),
            listarEmpleados(),
            listarAtenciones()
        ]).then(([ventasRes, clientesRes, empleadosRes, atencionesRes]) => {
            const ventas = ventasRes.data;
            const clientes = clientesRes.data;
            const empleados = empleadosRes.data;
            const atenciones = atencionesRes.data;

            const clienteMap = new Map(clientes.map(c => [c.id_cliente, c.nombreCliente]));
            const empleadoMap = new Map(empleados.map(e => [e.idEmpleado, e.nombre]));
            const atencionMap = new Map(atenciones.map(a => [a.idVenta, a.idEmpleado]));

            const enriquecidas = ventas.map(venta => {
                const idEmpleado = atencionMap.get(venta.idVenta);
                return {
                    ...venta,
                    nombreCliente: clienteMap.get(venta.idCliente) || 'N/A',
                    nombreEmpleado: empleadoMap.get(idEmpleado) || 'N/A'
                };
            });

            setVentasEnriquecidas(enriquecidas);
        }).catch(error => console.error("Error al cargar datos enriquecidos:", error))
          .finally(() => setLoading(false));
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleEdit = (idVenta) => {
        navegar(`/editar-venta/${idVenta}`);
    };

    const handleDelete = (idVenta) => {
        if (window.confirm("¿Estás seguro de eliminar esta venta? Esta acción es permanente.")) {
            deleteVenta(idVenta)
                .then(() => {
                    alert("Venta eliminada con éxito.");
                    cargarDatos();
                })
                .catch(error => console.error("Error al eliminar la venta:", error));
        }
    };

    const verDetalles = (idVenta) => navegar(`/venta-detalles/${idVenta}`);

    if (loading) { 
        return <div className="container"><h2 className="title">Cargando historial...</h2></div>;
    }

    // 🟦 FILTRAR POR FECHA EXACTA
    const ventasFiltradas = ventasEnriquecidas.filter(v => {
        if (!fechaFiltro) return true; // si no hay filtro, mostrar todo
        
        const fechaVenta = new Date(v.fechaVenta).toISOString().slice(0, 10); // yyyy-MM-dd
        return fechaVenta === fechaFiltro;
    });

    return (
        <div className="container">
            <h2 className="title">Historial de Ventas</h2>

            {/* 🔍 CAMPO DE FILTRO POR FECHA */}
            <input
                type="date"
                value={fechaFiltro}
                onChange={(e) => setFechaFiltro(e.target.value)}
                style={{
                    padding: "10px",
                    marginBottom: "15px",
                    width: "100%",
                    fontSize: "16px"
                }}
            />

            <table className="table">
                <thead>
                    <tr>
                        <th>ID Venta</th>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Atendido por</th>
                        <th>Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ventasFiltradas.map(venta => (
                        <tr key={venta.idVenta}>
                            <td>{venta.idVenta}</td>
                            <td>{new Date(venta.fechaVenta).toLocaleString()}</td>
                            <td>{venta.nombreCliente}</td>
                            <td>{venta.nombreEmpleado}</td>
                            <td>${parseFloat(venta.total).toFixed(2)}</td>
                            <td>
                                <div className="actions" style={{ justifyContent: 'flex-start', gap: '0.5rem' }}>
                                    <button title="Ver Detalles" className="btn btn-edit" onClick={() => verDetalles(venta.idVenta)}>
                                        <FaEye />
                                    </button>
                                    <button title="Editar Venta" className="btn btn-edit" onClick={() => handleEdit(venta.idVenta)}>
                                        <FaEdit />
                                    </button>
                                    <button title="Eliminar Venta" className="btn btn-delete" onClick={() => handleDelete(venta.idVenta)}>
                                        <FaTrash />
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
