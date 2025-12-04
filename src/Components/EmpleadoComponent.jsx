import React, { useState, useEffect } from 'react';
import { crearEmpleado, getEmpleadoById, updateEmpleado } from '../services/EmpleadoService'; 
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSave, FaTimes } from 'react-icons/fa';

export const EmpleadoComponent = () => {
    const [nombre, setNombre] = useState('');
    const [puesto, setPuesto] = useState(''); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('EMPLEADO');
    const [activo, setActivo] = useState(true);
    const [errors, setErrors] = useState({});
    
    const navegar = useNavigate();
    const { idEmpleado } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        if (idEmpleado) {
            getEmpleadoById(idEmpleado).then((response) => {
                const empleado = response.data;
                setNombre(empleado.nombre);
                setPuesto(empleado.puesto);
                setEmail(empleado.email);
                setRole(empleado.role);
                setActivo(empleado.activo);
                // No cargamos la contraseña por seguridad
            }).catch(error => console.error(error));
        }
    }, [idEmpleado]);

    function validarFormulario() {
        const newErrors = {};

        if (!nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
        }

        if (!puesto) {
            newErrors.puesto = 'Debe seleccionar un puesto';
        }

        if (!email.trim()) {
            newErrors.email = 'El email es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Email no válido';
        }

        // Solo validar contraseña si es un nuevo empleado o si se está cambiando
        if (!idEmpleado) {
            if (!password) {
                newErrors.password = 'La contraseña es obligatoria';
            } else if (password.length < 6) {
                newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            }

            if (password !== confirmPassword) {
                newErrors.confirmPassword = 'Las contraseñas no coinciden';
            }
        } else if (password) {
            // Si está editando y proporciona una nueva contraseña
            if (password.length < 6) {
                newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            }
            if (password !== confirmPassword) {
                newErrors.confirmPassword = 'Las contraseñas no coinciden';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function saveOrUpdateEmpleado(e) {
        e.preventDefault();
        
        if (!validarFormulario()) {
            return;
        }

        const empleado = { 
            nombre, 
            puesto, 
            email,
            role,
            activo
        };

        // Solo incluir password si se proporcionó
        if (password) {
            empleado.password = password;
        }
        
        if (idEmpleado) {
            updateEmpleado(idEmpleado, empleado).then(() => {
                alert("Empleado actualizado con éxito ✅");
                navegar('/empleados');
            }).catch(error => {
                alert("Error al actualizar empleado: " + (error.response?.data || error.message));
                console.error(error);
            });
        } else {
            crearEmpleado(empleado).then(() => {
                alert("Empleado guardado con éxito ✅");
                navegar('/empleados');
            }).catch(error => {
                alert("Error al crear empleado: " + (error.response?.data || error.message));
                console.error(error);
            });
        }
    }

    return (
        <div className="container">
            <h2 className="title">
                {idEmpleado ? 'Editar Empleado' : 'Registro de Nuevo Empleado'}
            </h2>
            
            <form onSubmit={saveOrUpdateEmpleado}>
                <div className="form-grid">
                    {/* Nombre */}
                    <div className="form-group">
                        <label>Nombre del Empleado</label>
                        <input 
                            type="text" 
                            value={nombre} 
                            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                            onChange={(e) => setNombre(e.target.value)} 
                            placeholder="Juan Pérez"
                        />
                        {errors.nombre && <div className='invalid-feedback'>{errors.nombre}</div>}
                    </div>

                    {/* Puesto */}
                    <div className="form-group">
                        <label>Puesto</label>
                        <select 
                            value={puesto} 
                            className={`form-control ${errors.puesto ? 'is-invalid' : ''}`}
                            onChange={(e) => setPuesto(e.target.value)}
                        >
                            <option value="">-- Selecciona un puesto --</option>
                            <option value="cajero">Cajero</option>
                            <option value="cocinero">Cocinero</option>
                            <option value="mesero">Mesero</option>
                        </select>
                        {errors.puesto && <div className='invalid-feedback'>{errors.puesto}</div>}
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label>Correo Electrónico</label>
                        <input 
                            type="email" 
                            value={email} 
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="correo@ejemplo.com"
                        />
                        {errors.email && <div className='invalid-feedback'>{errors.email}</div>}
                    </div>

                    {/* Rol - Solo visible para ADMIN */}
                    {user?.role === 'ADMIN' && (
                        <div className="form-group">
                            <label>Rol del Sistema</label>
                            <select 
                                value={role} 
                                className="form-control"
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="EMPLEADO">Empleado</option>
                                <option value="SUPERVISOR">Supervisor</option>
                                <option value="ADMIN">Administrador</option>
                            </select>
                        </div>
                    )}

                    {/* Contraseña */}
                    <div className="form-group">
                        <label>
                            Contraseña {idEmpleado && '(Dejar en blanco para no cambiar)'}
                        </label>
                        <input 
                            type="password" 
                            value={password} 
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Mínimo 6 caracteres"
                            minLength="6"
                        />
                        {errors.password && <div className='invalid-feedback'>{errors.password}</div>}
                    </div>

                    {/* Confirmar Contraseña */}
                    <div className="form-group">
                        <label>Confirmar Contraseña</label>
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            placeholder="Repite la contraseña"
                        />
                        {errors.confirmPassword && <div className='invalid-feedback'>{errors.confirmPassword}</div>}
                    </div>

                    {/* Estado Activo - Solo visible al editar */}
                    {idEmpleado && (
                        <div className="form-group full-width">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input 
                                    type="checkbox" 
                                    checked={activo}
                                    onChange={(e) => setActivo(e.target.checked)}
                                    style={{ width: 'auto', cursor: 'pointer' }}
                                />
                                <span>Empleado activo</span>
                            </label>
                            <small style={{ color: 'rgba(224, 224, 224, 0.7)', marginTop: '0.25rem' }}>
                                Los empleados inactivos no podrán iniciar sesión
                            </small>
                        </div>
                    )}
                </div>

                <div className="actions">
                    <button type="submit" className="btn btn-save">
                        <FaSave /> Guardar Empleado
                    </button>
                    <button type="button" className="btn btn-cancel text-2xl font-bold text-white" onClick={() => navegar('/empleados')}>
                        <FaTimes /> Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};