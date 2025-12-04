// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaSave, FaTimes } from 'react-icons/fa';
// import { crearCliente } from '../services/ClienteService'; 
// import './Login.css';

// export default function RegisterCliente() {
//   const [formData, setFormData] = useState({
//     nombreCliente: '',
//     telefonoCliente: '',
//     correoCliente: ''
//   });

//   const [errors, setErrors] = useState({
//     nombreCliente: '',
//     telefonoCliente: '',
//     correoCliente: ''
//   });

//   const [errorGeneral, setErrorGeneral] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // -------------------------
//   // VALIDACIÓN (tomada del ClienteComponent)
//   // -------------------------
//   const validarFormulario = () => {
//     let valido = true;
//     const newErrors = { ...errors };

//     if (!formData.nombreCliente.trim()) {
//       newErrors.nombreCliente = 'El nombre es requerido';
//       valido = false;
//     } else {
//       newErrors.nombreCliente = '';
//     }

//     if (!formData.telefonoCliente.trim()) {
//       newErrors.telefonoCliente = 'El teléfono es requerido';
//       valido = false;
//     } else if (!/^\d{10}$/.test(formData.telefonoCliente)) {
//       newErrors.telefonoCliente = 'El teléfono debe tener 10 dígitos';
//       valido = false;
//     } else {
//       newErrors.telefonoCliente = '';
//     }

//     if (!formData.correoCliente.trim()) {
//       newErrors.correoCliente = 'El correo es requerido';
//       valido = false;
//     } else if (!/\S+@\S+\.\S+/.test(formData.correoCliente)) {
//       newErrors.correoCliente = 'Formato de correo inválido';
//       valido = false;
//     } else {
//       newErrors.correoCliente = '';
//     }

//     setErrors(newErrors);
//     return valido;
//   };

//   // -------------------------
//   // HANDLE SUBMIT (solo creación)
//   // -------------------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorGeneral('');
//     setLoading(true);

//     if (!validarFormulario()) {
//       setLoading(false);
//       return;
//     }

//     try {
//       await crearCliente({
//         nombreCliente: formData.nombreCliente,
//         telefonoCliente: formData.telefonoCliente,
//         correoCliente: formData.correoCliente
//       });

//       setSuccess(true);

//       setTimeout(() => navigate('/login'), 2500);

//     } catch (err) {
//       setErrorGeneral('Error al registrar cliente');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -------------------------
//   // CAMBIO DE INPUTS
//   // -------------------------
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   return (
//     <div className="login-page">
//       <div className="container">
//         <h2 className="title">Registro de Cliente</h2>
//         <p className="subtitle">CosMo Restaurante - Regístrate para hacer reservas</p>

//         {errorGeneral && <div className="error-message">{errorGeneral}</div>}
        
//         {success && (
//           <div className="success-message">
//             ¡Registro exitoso! Ya puedes iniciar sesión y hacer reservas.
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
          
//           <div className="form-group">
//             <label>Nombre Completo</label>
//             <input
//               type="text"
//               name="nombreCliente"
//               value={formData.nombreCliente}
//               onChange={handleChange}
//               className={`form-control ${errors.nombreCliente ? 'is-invalid' : ''}`}
//               placeholder="Tu nombre completo"
//             />
//             {errors.nombreCliente && <div className="invalid-feedback">{errors.nombreCliente}</div>}
//           </div>

//           <div className="form-group">
//             <label>Teléfono</label>
//             <input
//               type="tel"
//               name="telefonoCliente"
//               value={formData.telefonoCliente}
//               onChange={handleChange}
//               className={`form-control ${errors.telefonoCliente ? 'is-invalid' : ''}`}
//               placeholder="1234567890"
//             />
//             {errors.telefonoCliente && <div className="invalid-feedback">{errors.telefonoCliente}</div>}
//           </div>

//           <div className="form-group">
//             <label>Correo Electrónico</label>
//             <input
//               type="email"
//               name="correoCliente"
//               value={formData.correoCliente}
//               onChange={handleChange}
//               className={`form-control ${errors.correoCliente ? 'is-invalid' : ''}`}
//               placeholder="correo@ejemplo.com"
//             />
//             {errors.correoCliente && <div className="invalid-feedback">{errors.correoCliente}</div>}
//           </div>

//           <div className="actions">
//             <button type="submit" disabled={loading} className="btn btn-save">
//               <FaSave /> {loading ? 'Registrando...' : 'Registrarme'}
//             </button>
//             <button 
//               type="button" 
//               onClick={() => navigate('/')} 
//               className="btn btn-cancel"
//             >
//               <FaTimes /> Volver al Login
//             </button>
//           </div>
//         </form>

//         <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#e0e0e0' }}>
//           <p>¿Eres empleado? <a href="/login" style={{ color: '#9f5afd' }}>Inicia sesión aquí</a></p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSave, FaTimes } from 'react-icons/fa';
import './Login.css';

export default function RegisterCliente() {
  const [formData, setFormData] = useState({
    nombreCliente: '',
    telefonoCliente: '',
    correoCliente: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { registerCliente } = useAuth();

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

    const result = await registerCliente(
      formData.nombreCliente,
      formData.telefonoCliente,
      formData.correoCliente,
      formData.password
    );

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="container register-container">
        <h2 className="title">Registro de Cliente</h2>
        <p className="subtitle">CosMo Restaurante - Regístrate para hacer reservas</p>

        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            ¡Registro exitoso! Redirigiendo al login...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Nombre Completo</label>
              <input
                type="text"
                name="nombreCliente"
                value={formData.nombreCliente}
                onChange={handleChange}
                required
                className="form-control"
                placeholder="Tu nombre completo"
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                name="telefonoCliente"
                value={formData.telefonoCliente}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                className="form-control"
                placeholder="1234567890"
              />
            </div>

            <div className="form-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                name="correoCliente"
                value={formData.correoCliente}
                onChange={handleChange}
                required
                className="form-control"
                placeholder="correo@ejemplo.com"
              />
            </div>

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
                placeholder="Repite tu contraseña"
              />
            </div>
          </div>

          <div className="actions">
            <button type="submit" disabled={loading} className="btn btn-save">
              <FaSave /> {loading ? 'Registrando...' : 'Registrarme'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/login')} 
              className="btn btn-cancel"
            >
              <FaTimes /> Volver al Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}