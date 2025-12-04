import React, { useState } from 'react';
import { crearTipo } from '../services/TipoService'; 
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';

export const TipoComponent = () => {
    const [tipo, setTipo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const navegar = useNavigate();

    function saveTipo(e) {
        e.preventDefault();
        const tipoObjeto = { tipo, descripcion };

        crearTipo(tipoObjeto).then(() => {
            alert("Tipo guardado con éxito ✅");
            navegar('/tipos');
        }).catch(error => console.error(error));
    }

    return (
        <div className="container">
            <h2 className="title">Registro de Nuevo Tipo</h2>
            <form onSubmit={saveTipo}>
                <div className="form-group">
                    <label>Nombre del Tipo</label>
                    <input type="text" value={tipo} onChange={(e) => setTipo(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Descripción</label>
                    <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
                </div>
                <div className="actions">
                    <button type="submit" className="btn btn-save"><FaSave /> Guardar Tipo</button>
                    <button type="button" className="btn btn-cancel text-2xl font-bold text-white" onClick={() => navegar('/tipos')}><FaTimes /> Cancelar</button>
                </div>
            </form>
        </div>
    );
};