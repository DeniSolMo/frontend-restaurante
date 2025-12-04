import './Clientes.css';

import React, { useEffect, useState } from 'react';
import { listClientes, deleteCliente } from '../services/ClienteService'; 
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const ListClienteComponent = () => {
    const [clientes, setClientes] = useState([]);
    const [busqueda, setBusqueda] = useState("");  // 🔍 estado del filtro
    const navegar = useNavigate();

    function getAllClientes(){
        listClientes().then(response => {
            setClientes(response.data);
        }).catch(error => {
            console.error(error);
        });
    }

    useEffect(() => {
        getAllClientes();
    }, []);

    function handleEdit(id_cliente) {
        navegar(`/editar-cliente/${id_cliente}`);
    }

    function handleDelete(id_cliente) {
        if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
            deleteCliente(id_cliente).then(() => {
                console.log(`Cliente con ID: ${id_cliente} ha sido eliminado exitosamente.`);
                getAllClientes(); 
            }).catch(error => {
                console.error("Error al eliminar el cliente:", error);
            });
        }
    }

    // 🔍 Filtrar clientes por nombre
    const clientesFiltrados = clientes.filter(c =>
        c.nombreCliente.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="container">
            <h2 className="title">Nuestros clientes</h2>

            {/* 🔍 INPUT DE BÚSQUEDA */}
            <input
                type="text"
                className="search-input"
                placeholder="Buscar cliente por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
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
                        <th>Id Cliente</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>

                    {/* 🔍 USAMOS LA LISTA FILTRADA */}
                    {clientesFiltrados.map(cliente => (
                        <tr key={cliente.id_cliente}>
                            <td>{cliente.id_cliente}</td>
                            <td>{cliente.nombreCliente}</td>
                            <td>{cliente.correoCliente}</td>
                            <td>{cliente.telefonoCliente}</td>
                            <td>
                                <div className="actions">
                                    <button className="btn btn-edit" onClick={() => handleEdit(cliente.id_cliente)}>
                                        <FaEdit /> Editar
                                    </button>
                                    <button className="btn btn-delete" onClick={() => handleDelete(cliente.id_cliente)}>
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
