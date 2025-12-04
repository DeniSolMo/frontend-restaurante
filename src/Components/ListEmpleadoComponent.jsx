import React, { useEffect, useState } from 'react';
import { listarEmpleados, deleteEmpleado } from '../services/EmpleadoService'; 
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const ListEmpleadoComponent = () => {
    const [empleados, setEmpleados] = useState([]);
    const [busqueda, setBusqueda] = useState("");       // 🔍 filtro por nombre
    const [puestoFiltro, setPuestoFiltro] = useState(""); // 🎯 filtro por puesto
    const navegar = useNavigate();

    function getAllEmpleados() {
        listarEmpleados().then(response => {
            setEmpleados(response.data);
        }).catch(error => console.error(error));
    }

    useEffect(() => {
        getAllEmpleados();
    }, []);

    function handleEdit(idEmpleado) {
        navegar(`/editar-empleado/${idEmpleado}`);
    }

    function handleDelete(idEmpleado) {
        if (window.confirm("¿Estás seguro de eliminar a este empleado?")) {
            deleteEmpleado(idEmpleado).then(() => {
                console.log(`Empleado con ID ${idEmpleado} eliminado.`);
                getAllEmpleados();
            }).catch(error => console.error(error));
        }
    }

    // 🟦 FILTRAR POR NOMBRE Y PUESTO
    const empleadosFiltrados = empleados.filter(e =>
        e.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
        (puestoFiltro === "" || e.puesto === puestoFiltro)
    );

    // 🟧 OBTENER LISTA DE PUESTOS DINÁMICAMENTE DESDE LA BD
    const puestos = [...new Set(empleados.map(e => e.puesto))];

    return (
        <div className="container">
            <h2 className="title">Lista de Empleados</h2>

            {/* 🔍 FILTRO POR NOMBRE */}
            <input
                type="text"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{
                    padding: "10px",
                    marginBottom: "15px",
                    width: "100%",
                    fontSize: "16px"
                }}
            />

            {/* 🎯 FILTRO POR PUESTO */}
            <select
                value={puestoFiltro}
                onChange={(e) => setPuestoFiltro(e.target.value)}
                style={{
                    padding: "10px",
                    marginBottom: "15px",
                    width: "100%",
                    fontSize: "16px"
                }}
            >
                <option value="">Todos los puestos</option>
                {puestos.map((p, index) => (
                    <option key={index} value={p}>{p}</option>
                ))}
            </select>

            <table className="table">
                <thead>
                    <tr>
                        <th>ID Empleado</th>
                        <th>Nombre</th>
                        <th>Puesto</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {empleadosFiltrados.map(empleado => (
                        <tr key={empleado.idEmpleado}>
                            <td>{empleado.idEmpleado}</td>
                            <td>{empleado.nombre}</td>
                            <td>{empleado.puesto}</td>
                            <td>
                                <div className="actions">
                                    <button className="btn btn-edit" onClick={() => handleEdit(empleado.idEmpleado)}>
                                        <FaEdit /> Editar
                                    </button>
                                    <button className="btn btn-delete" onClick={() => handleDelete(empleado.idEmpleado)}>
                                        <FaTrash /> Eliminar
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
