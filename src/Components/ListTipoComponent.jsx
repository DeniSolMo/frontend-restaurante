import React, { useEffect, useState } from 'react';
import { listarTipos } from '../services/TipoService'; 
import { FaEdit, FaTrash } from 'react-icons/fa';

export const ListTipoComponent = () => {
    const [tipos, setTipos] = useState([]);

    useEffect(() => {
        listarTipos().then(response => setTipos(response.data))
                     .catch(error => console.error(error));
    }, []);

    return (
        <div className="container">
            <h2 className="title">Tipos de Categorias</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tipo</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {tipos.map(tipo => (
                        <tr key={tipo.id_tipo}>
                            <td>{tipo.id_tipo}</td>
                            <td>{tipo.tipo}</td>
                            <td>{tipo.descripcion}</td>
                            <td>
                                <div className="actions">
                                    <button className="btn btn-edit"><FaEdit /> Editar</button>
                                    <button className="btn btn-delete"><FaTrash /> Eliminar</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};