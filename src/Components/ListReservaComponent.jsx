import React, { useState, useEffect } from 'react';
import { listarReservas, updateReserva, deleteReserva } from '../services/ReservaService';
import { listClientes } from '../services/ClienteService';
import { useNavigate } from 'react-router-dom';
import { FaCashRegister, FaEdit } from 'react-icons/fa';

// Badge de colores según estado
const StatusBadge = ({ estado }) => {
    const styles = {
        PENDIENTE: { backgroundColor: '#ffc107', color: '#000' },
        CONFIRMADO: { backgroundColor: '#17a2b8', color: '#fff' },
        COMPLETADA: { backgroundColor: '#28a745', color: '#fff' },
        CANCELADA: { backgroundColor: '#dc3545', color: '#fff' }
    };
    const style = {
        padding: '0.25rem 0.6rem',
        borderRadius: '12px',
        fontWeight: 'bold',
        fontSize: '0.8rem',
        textTransform: 'uppercase',
        ...styles[estado]
    };
    return <span style={style}>{estado}</span>;
};

export const ListReservaComponent = () => {

    const [reservasEnriquecidas, setReservasEnriquecidas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [loading, setLoading] = useState(true);
    const navegar = useNavigate();

    // Cargar reservas + clientes
    const cargarDatos = () => {
        setLoading(true);
        Promise.all([
            listarReservas(),
            listClientes()
        ]).then(([reservasResponse, clientesResponse]) => {

            const reservas = reservasResponse.data;
            const clientes = clientesResponse.data;

            const clienteMap = new Map(clientes.map(c => [c.id_cliente, c.nombreCliente]));

            const enriquecidas = reservas.map(reserva => ({
                ...reserva,
                nombreCliente: clienteMap.get(reserva.idCliente) || 'Cliente no encontrado'
            }));

            setReservasEnriquecidas(enriquecidas);

        }).catch(error => {
            console.error("Error al cargar datos:", error);
        }).finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    // Navegar a venta
    const handleGoToVenta = (reserva) => {
        navegar('/registrar-venta', {
            state: {
                idCliente: reserva.idCliente,
                idReserva: reserva.idReserva
            }
        });
    };

    // Editar
    const handleEdit = (idReserva) => {
        navegar(`/editar-reserva/${idReserva}`);
    };

    // Eliminar definitivamente
    const handleDelete = (idReserva) => {
        if (window.confirm("¿Estás seguro de que deseas ELIMINAR PERMANENTEMENTE esta reserva?")) {
            deleteReserva(idReserva).then(() => {
                setReservasEnriquecidas(reservasEnriquecidas.filter(r => r.idReserva !== idReserva));
                console.log(`Reserva con ID ${idReserva} eliminada.`);
            }).catch(error => console.error("Error al eliminar la reserva:", error));
        }
    };

    // Cambiar estado
    const handleStatusChange = (reserva, nuevoEstado) => {
        if (nuevoEstado === 'CANCELADA') {
            handleDelete(reserva.idReserva);
            return;
        }

        const reservaDtoToSend = {
            fecha: reserva.fecha,
            hora: reserva.hora,
            idMesa: reserva.idMesa,
            idCliente: reserva.idCliente,
            estado: nuevoEstado
        };

        updateReserva(reserva.idReserva, reservaDtoToSend)
            .then((response) => {
                const reservaActualizadaBackend = response.data;

                setReservasEnriquecidas(reservasEnriquecidas.map(r =>
                    r.idReserva === reservaActualizadaBackend.idReserva
                        ? { ...r, estado: reservaActualizadaBackend.estado }
                        : r
                ));
            })
            .catch(error => console.error("Error al actualizar estado:", error));
    };

    // === FILTROS ===
    const filteredReservas = reservasEnriquecidas.filter(reserva => {

        const coincideNombre = reserva.nombreCliente
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const coincideFecha = filterDate === '' || reserva.fecha === filterDate;

        return coincideNombre && coincideFecha;
    });

    const hoy = new Date().toISOString().split('T')[0];

    if (loading) {
        return <div className="container"><h2 className="title">Cargando reservas...</h2></div>;
    }

    return (
        <div className="container">
            <h2 className="title">Historial de Reservas</h2>

            {/* Filtro por nombre */}
            <div className="form-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por nombre de cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Filtro por fecha */}
            <div className="form-group">
                <input
                    type="date"
                    className="form-control"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                />
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Fecha y Hora</th>
                        <th>Mesa ID</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredReservas.length === 0 ? (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>
                                No se encontraron reservas.
                            </td>
                        </tr>
                    ) : (
                        filteredReservas.map(reserva => {

                            const esHoy = reserva.fecha === hoy;

                            return (
                                <tr key={reserva.idReserva}>
                                    <td>{reserva.idReserva}</td>
                                    <td>{reserva.nombreCliente}</td>
                                    <td>{new Date(`${reserva.fecha}T${reserva.hora}`).toLocaleString()}</td>
                                    <td>#{reserva.idMesa}</td>
                                    <td><StatusBadge estado={reserva.estado} /></td>

                                    <td>
                                        <div className="actions" style={{ justifyContent: 'flex-start', gap: '0.5rem' }}>

                                            {/* Botón de venta solo si la reserva es HOY */}
                                            {reserva.estado === 'CONFIRMADO' && esHoy && (
                                                <button
                                                    className="btn btn-save"
                                                    onClick={() => handleGoToVenta(reserva)}
                                                >
                                                    <FaCashRegister /> Iniciar Venta
                                                </button>
                                            )}

                                            {reserva.estado === 'CONFIRMADO' && !esHoy && (
                                                <button
                                                    className="btn btn-save"
                                                    disabled
                                                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                                                >
                                                    <FaCashRegister /> Iniciar Venta
                                                </button>
                                            )}

                                            {/* Editar */}
                                            <button className="btn btn-edit" onClick={() => handleEdit(reserva.idReserva)}>
                                                <FaEdit /> Editar
                                            </button>

                                            {/* Cambiar estado */}
                                            <select
                                                value={reserva.estado}
                                                onChange={(e) => handleStatusChange(reserva, e.target.value)}
                                                className="form-control"
                                                style={{ width: 'auto' }}
                                            >
                                                <option value="PENDIENTE">Pendiente</option>
                                                <option value="CONFIRMADO">Confirmado</option>
                                                <option value="COMPLETADA">Completada</option>
                                                <option value="CANCELADA">Cancelar y Eliminar</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};
