import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSave, FaTimes } from 'react-icons/fa';
import './Login.css';

export default function RegisterEmpleado() {
  const [formData, setFormData] = useState({
    nombre: '',
    puesto: 'mesero',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'EMPLEADO' // Por defecto empleado
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const { user } = useAuth(); // Para saber quién está registrando

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    const result = await register(
      formData.nombre,
      formData.puesto,
      formData.email,
      formData.password,
      formData.role // Ahora incluye el rol
    );

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/empleados'), 2000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="main-content">
      <div className="container register-container">
        <h2 className="title">Registrar Nuevo Empleado</h2>
        <p className="subtitle">Complete los datos del nuevo empleado</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">¡Empleado registrado exitosamente!</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre Completo</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="form-control"
                placeholder="Juan Pérez"
              />
            </div>

            <div className="form-group">
              <label>Puesto</label>
              <select
                name="puesto"
                value={formData.puesto}
                onChange={handleChange}
                required
                className="form-control"
              >
                <option value="mesero">Mesero</option>
                <option value="cocinero">Cocinero</option>
                <option value="cajero">Cajero</option>
              </select>
            </div>

            <div className="form-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-control"
                placeholder="correo@ejemplo.com"
              />
            </div>

            {/* Solo ADMIN puede asignar roles */}
            {user?.role === 'ADMIN' && (
              <div className="form-group">
                <label>Rol del Sistema</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="form-control"
                >
                  <option value="EMPLEADO">Empleado</option>
                  <option value="SUPERVISOR">Supervisor</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                className="form-control"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className="form-group">
              <label>Confirmar Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="form-control"
                placeholder="Repite la contraseña"
              />
            </div>
          </div>

          <div className="actions">
            <button type="submit" disabled={loading} className="btn btn-save">
              <FaSave /> {loading ? 'Registrando...' : 'Registrar Empleado'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/empleados')} 
              className="btn btn-cancel text-2xl font-bold text-white"
            >
              <FaTimes /> Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}