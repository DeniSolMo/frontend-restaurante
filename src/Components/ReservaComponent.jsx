import React, { useState, useEffect } from 'react';
import { crearReserva, getReservaById, updateReserva } from '../services/ReservaService';
import { listClientes } from '../services/ClienteService';
import { listarMesasDisponibles } from '../services/MesaService';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';


export const ReservaComponent = () => {
    // Estados para los campos del formulario
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [idCliente, setIdCliente] = useState('');
    const [idMesa, setIdMesa] = useState('');
    const [estado, setEstado] = useState('PENDIENTE'); // Estado por defecto para nuevas reservas

    // Estados para poblar los dropdowns
    const [clientes, setClientes] = useState([]);
    const [mesasDisponibles, setMesasDisponibles] = useState([]);
    
    const navegar = useNavigate();
    const { idReserva } = useParams(); // Obtiene el ID de la URL si estamos editando

    useEffect(() => {
        // Carga los datos para los dropdowns
        listClientes().then(res => setClientes(res.data)).catch(err => console.error("Error al cargar clientes:", err));
        listarMesasDisponibles().then(res => setMesasDisponibles(res.data)).catch(err => console.error("Error al cargar mesas:", err));

        // Si hay un ID en la URL, estamos en modo "editar"
        if (idReserva) {
            getReservaById(idReserva).then(res => {
                const reserva = res.data;
                // Rellena el formulario con los datos existentes
                setFecha(reserva.fecha);
                setHora(reserva.hora);
                setIdCliente(reserva.idCliente);
                setIdMesa(reserva.idMesa);
                setEstado(reserva.estado);
            }).catch(err => console.error("Error al cargar la reserva:", err));
        }
    }, [idReserva]); // El efecto se vuelve a ejecutar si el ID cambia

    function saveOrUpdateReserva(e) {
        e.preventDefault();
        const reserva = { fecha, hora, idCliente, idMesa, estado };
        
        if (idReserva) {
            updateReserva(idReserva, reserva).then(() => {
                alert("Reserva actualizada con éxito ✅");
                navegar('/reservas');
            }).catch(err => console.error(err));
        } else {
            // Al crear, el backend debería asignar 'PENDIENTE' por defecto, pero lo enviamos por si acaso
            crearReserva({ ...reserva, estado: 'PENDIENTE' }).then(() => {
                alert("Reserva creada con éxito ✅");
                navegar('/reservas');
            }).catch(err => console.error(err));
        }
    }

    return (
        <div className="container">
            <h2 className="title">{idReserva ? 'Editar Reserva' : 'Crear Nueva Reserva'}</h2>
            <form onSubmit={saveOrUpdateReserva}>
                <div className="form-group">
                    <label>Cliente</label>
                    <select className="form-control" value={idCliente} onChange={(e) => setIdCliente(e.target.value)} required>
                        <option value="">-- Selecciona un cliente --</option>
                        {clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombreCliente}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label>Mesa Disponible</label>
                    <select className="form-control" value={idMesa} onChange={(e) => setIdMesa(e.target.value)} required>
                        <option value="">-- Selecciona una mesa --</option>
                        {mesasDisponibles.map(m => <option key={m.idMesa} value={m.idMesa}>Mesa #{m.numero} ({m.capacidad}p) - {m.ubicacion}</option>)}
                    </select>
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label>Fecha</label>
                        <input type="date" className="form-control" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Hora</label>
                        <input type="time" className="form-control" value={hora} onChange={(e) => setHora(e.target.value)} required />
                    </div>
                </div>

                { }
                {idReserva && (
                    <div className="form-group">
                        <label>Estado de la Reserva</label>
                        <select className="form-control" value={estado} onChange={(e) => setEstado(e.target.value)}>
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="COMPLETADA">Completada</option>
                            <option value="CANCELADA">Cancelada</option>
                        </select>
                    </div>
                )}

                <div className="actions">
                    <button type="submit" className="btn btn-save"><FaSave /> Guardar Cambios</button>
                    <button type="button" className="btn btn-cancel text-2xl font-bold text-white" onClick={() => navegar('/reservas')}><FaTimes /> Cancelar</button>
                </div>
            </form>
        </div>
    );
};