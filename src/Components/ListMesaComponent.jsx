import React, { useEffect, useState } from 'react';
import { listarMesas, toggleEstadoMesa, deleteMesa } from '../services/MesaService'; 
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const ListMesaComponent = () => {
    const [mesas, setMesas] = useState([]);
    const navegar = useNavigate();

    // ... getAllMesas() y handleEdit() se quedan igual ...
    function getAllMesas() {
        listarMesas().then(response => setMesas(response.data))
                     .catch(error => console.error(error));
    }
    useEffect(() => { getAllMesas(); }, []);
    function handleEdit(idMesa) { navegar(`/editar-mesa/${idMesa}`); }

    function handleToggleEstado(mesaAActualizar) {
        toggleEstadoMesa(mesaAActualizar.idMesa).then((response) => {
            const mesaActualizada = response.data;
            // --- 👇 LÓGICA DEL MENSAJE INVERTIDA 👇 ---
            console.log(`Estado de la mesa ID ${mesaAActualizar.idMesa} cambiado a: ${mesaActualizada.estado ? 'Desocupada' : 'Ocupada'}`);
            setMesas(mesas.map(m => m.idMesa === mesaAActualizar.idMesa ? mesaActualizada : m));
        }).catch(error => console.error(error));
    }

    return (
        <div className="container">
            <h2 className="title">Gestión de Mesas</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th><th>Número</th><th>Capacidad</th><th>Ubicación</th><th>Estado</th><th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {mesas.map(mesa => (
                        // --- 👇 LÓGICA DE CLASE INVERTIDA 👇 ---
                        // La clase se aplica cuando la mesa NO está activa (estado = false)
                        <tr key={mesa.idMesa} className={!mesa.estado ? 'mesa-ocupada' : ''}>
                            <td>{mesa.idMesa}</td>
                            <td>Mesa #{mesa.numero}</td>
                            <td>{mesa.capacidad} personas</td>
                            <td>{mesa.ubicacion}</td>
                            { }
                            <td>{mesa.estado ? 'Desocupada' : 'Ocupada'}</td>
                            <td>
                                <div className="actions">
                                    <button className="btn btn-edit" onClick={() => handleEdit(mesa.idMesa)}>
                                        <FaEdit /> Editar
                                    </button>
                                    
                                    { }
                                    { }
                                    { }
                                    <button 
                                        className={`btn ${mesa.estado ? 'btn-occupy' : 'btn-vacate'}`}
                                        onClick={() => handleToggleEstado(mesa)}
                                    >
                                        {mesa.estado ? 
                                            <><FaCheck /> Ocupar</> : 
                                            <><FaTimes /> Desocupar</>
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