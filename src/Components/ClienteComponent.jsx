import React, { useState, useEffect } from 'react';
import { crearCliente, getCliente, updateCliente } from '../services/ClienteService'; 
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';
import './Forms.css';

export const ClienteComponent = () => {

    const [nombreCliente, setNombreCliente] = useState('');
    const [telefonoCliente, setTelefonoCliente] = useState('');
    const [correoCliente, setCorreoCliente] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errors, setErrors] = useState({
        nombreCliente: '',
        telefonoCliente: '',
        correoCliente: '',
        password: '',
        confirmPassword: ''
    });

    const navegar = useNavigate();
    const { id_cliente } = useParams();

    // ============================
    // Cargar datos si es edición
    // ============================
    useEffect(() => {
        if (id_cliente) {
            getCliente(id_cliente).then((response) => {
                setNombreCliente(response.data.nombreCliente);
                setTelefonoCliente(response.data.telefonoCliente);
                setCorreoCliente(response.data.correoCliente);
            }).catch(error => console.error(error));
        }
    }, [id_cliente]);

    // ============================
    // Validaciones
    // ============================
    function validaForm() {
        let valida = true;
        const e = { ...errors };

        if (!nombreCliente.trim()) { 
            e.nombreCliente = 'El nombre es requerido'; 
            valida = false; 
        } else e.nombreCliente = '';

        if (!telefonoCliente.trim()) {
            e.telefonoCliente = 'El teléfono es requerido';
            valida = false;
        } else if (!/^\d{10}$/.test(telefonoCliente)) {
            e.telefonoCliente = 'El teléfono debe tener 10 dígitos';
            valida = false;
        } else e.telefonoCliente = '';

        if (!correoCliente.trim()) {
            e.correoCliente = 'El correo es requerido';
            valida = false;
        } else if (!/\S+@\S+\.\S+/.test(correoCliente)) {
            e.correoCliente = 'Formato de correo inválido';
            valida = false;
        } else e.correoCliente = '';

        // Solo validar password en registro
        if (!id_cliente) {
            if (!password.trim()) {
                e.password = 'La contraseña es requerida';
                valida = false;
            } else if (password.length < 6) {
                e.password = 'Debe tener mínimo 6 caracteres';
                valida = false;
            } else e.password = '';

            if (password !== confirmPassword) {
                e.confirmPassword = 'Las contraseñas no coinciden';
                valida = false;
            } else e.confirmPassword = '';
        }

        setErrors(e);
        return valida;
    }

    // ============================
    // Guardar o actualizar
    // ============================
    function saveOrUpdateCliente(e) {
        e.preventDefault();

        if (!validaForm()) return;

        // Datos para enviar al back
        const cliente = { 
            nombreCliente, 
            telefonoCliente, 
            correoCliente,
            ...(id_cliente ? {} : { password }) // password solo en registro
        };
        
        if (id_cliente) {
            updateCliente(id_cliente, cliente).then(() => {
                alert("Cliente actualizado con éxito ✅");
                navegar('/clientes');
            }).catch(error => console.error(error));
        } else {
            crearCliente(cliente).then(() => {
                alert("Cliente guardado con éxito ✅");
                navegar('/clientes');
            }).catch(error => console.error(error));
        }
    }

    return (
        <div className="container">
            <h2 className="title">
                {id_cliente ? 'Editar Cliente' : 'Registro de Nuevo Cliente'}
            </h2>

            <form onSubmit={saveOrUpdateCliente}>

                <div className="form-group">
                    <label>Nombre del Cliente</label>
                    <input 
                        type="text"
                        value={nombreCliente}
                        className={`form-control ${errors.nombreCliente ? 'is-invalid' : ''}`}
                        onChange={(e) => setNombreCliente(e.target.value)}
                    />
                    {errors.nombreCliente && <div className='invalid-feedback'>{errors.nombreCliente}</div>}
                </div>

                <div className="form-group">
                    <label>Teléfono</label>
                    <input 
                        type="tel"
                        value={telefonoCliente}
                        className={`form-control ${errors.telefonoCliente ? 'is-invalid' : ''}`}
                        onChange={(e) => setTelefonoCliente(e.target.value)}
                    />
                    {errors.telefonoCliente && <div className='invalid-feedback'>{errors.telefonoCliente}</div>}
                </div>

                <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input
                        type="email"
                        value={correoCliente}
                        className={`form-control ${errors.correoCliente ? 'is-invalid' : ''}`}
                        onChange={(e) => setCorreoCliente(e.target.value)}
                    />
                    {errors.correoCliente && <div className='invalid-feedback'>{errors.correoCliente}</div>}
                </div>

                {/* ====================
                    CAMPOS DE PASSWORD
                    Solo en registro
                ===================== */}
                {!id_cliente && (
                    <>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                        />
                        {errors.password && <div className='invalid-feedback'>{errors.password}</div>}
                    </div>

                    <div className="form-group">
                        <label>Confirmar Contraseña</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repite tu contraseña"
                        />
                        {errors.confirmPassword && <div className='invalid-feedback'>{errors.confirmPassword}</div>}
                    </div>
                    </>
                )}

                <div className="actions">
                    <button type="submit" className="btn btn-save">
                        <FaSave /> Guardar Cliente
                    </button>
                    <button type="button" onClick={() => navegar('/clientes')} className="btn btn-cancel">
                        <FaTimes /> Cancelar
                    </button>
                </div>

            </form>
        </div>
    );
};
