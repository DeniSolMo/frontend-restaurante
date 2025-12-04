// import { createContext, useState, useContext, useEffect } from 'react';
// import api from '../api/axios'; // <- Asegúrate que la ruta sea correcta

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userData = localStorage.getItem('user');
    
//     if (token && userData) {
//       setUser(JSON.parse(userData));
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     try {
//       console.log('🔐 Intentando login...');
//       const response = await api.post('/auth/login', { email, password });
//       const { token, idEmpleado, nombre, email: userEmail, puesto, role } = response.data;
      
//       console.log('✅ Login exitoso:', { nombre, email: userEmail, role });
      
//       const userData = { idEmpleado, nombre, email: userEmail, puesto, role };
      
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(userData));
//       setUser(userData);
      
//       return { success: true };
//     } catch (error) {
//       console.error('❌ Error en login:', error.response?.data || error.message);
//       return { 
//         success: false, 
//         message: error.response?.data || 'Error al iniciar sesión' 
//       };
//     }
//   };

//   const register = async (nombre, puesto, email, password, role = 'EMPLEADO') => {
//     try {
//       console.log('📝 Registrando usuario...');
//       await api.post('/auth/register', { nombre, puesto, email, password, role });
//       console.log('✅ Usuario registrado exitosamente');
//       return { success: true };
//     } catch (error) {
//       console.error('❌ Error al registrar:', error.response?.data || error.message);
//       return { 
//         success: false, 
//         message: error.response?.data || 'Error al registrar usuario' 
//       };
//     }
//   };

//   const logout = () => {
//     console.log('🚪 Cerrando sesión...');
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth debe usarse dentro de AuthProvider');
//   }
//   return context;
// };

import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Instancia para empleados
const authApiEmpleado = axios.create({
  
  baseURL: 'https://microservicio-springboot.azurewebsites.net/api',
  //baseURL: 'http://localhost:7076/api',
  headers: { 'Content-Type': 'application/json' }
});

// Instancia para clientes
const authApiCliente = axios.create({
  baseURL: 'https://microservicio-restaurante-468816459584.northamerica-south1.run.app/api',
  //baseURL: 'http://localhost:7072/api',
  headers: { 'Content-Type': 'application/json' }
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 Intentando login con:', email);
      
      let response;
      let isCliente = false;
      
      // Primero intentar como EMPLEADO
      try {
        console.log('📍 Intentando login como EMPLEADO...');
        response = await authApiEmpleado.post('/auth/login', { email, password });
        console.log('✅ Login exitoso como EMPLEADO');
      } catch (errorEmpleado) {
        // Si falla, intentar como CLIENTE
        console.log('📍 Intentando login como CLIENTE...');
        try {
          response = await authApiCliente.post('/auth-cliente/login', { 
            correoCliente: email, 
            password 
          });
          isCliente = true;
          console.log('✅ Login exitoso como CLIENTE');
        } catch (errorCliente) {
          console.error('❌ Falló login en ambos servicios');
          return { 
            success: false, 
            message: 'Credenciales inválidas' 
          };
        }
      }
      
      console.log('📦 Respuesta del servidor:', response.data);
      
      let userData;
      
      if (isCliente) {
        // Formato de respuesta para CLIENTE
        const { token, id_cliente, nombreCliente, correoCliente, role } = response.data;
        
        if (!token) {
          return { success: false, message: 'No se recibió token' };
        }
        
        userData = { 
          id: id_cliente, 
          nombre: nombreCliente, 
          email: correoCliente, 
          role: role,
          tipo: 'CLIENTE'
        };
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
      } else {
        // Formato de respuesta para EMPLEADO
        const { token, idEmpleado, nombre, email: userEmail, puesto, role } = response.data;
        
        if (!token) {
          return { success: false, message: 'No se recibió token' };
        }
        
        userData = { 
          id: idEmpleado, 
          nombre, 
          email: userEmail, 
          puesto, 
          role,
          tipo: 'EMPLEADO'
        };
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      
      console.log('✅ Login exitoso');
      return { success: true };
      
    } catch (error) {
      console.error('❌ Error en login:', error);
      return { 
        success: false, 
        message: 'Error al iniciar sesión' 
      };
    }
  };

  const registerCliente = async (nombreCliente, telefonoCliente, correoCliente, password) => {
    try {
      console.log('📝 Registrando cliente:', correoCliente);
      
      await authApiCliente.post('/auth-cliente/register', { 
        nombreCliente, 
        telefonoCliente, 
        correoCliente, 
        password 
      });
      
      console.log('✅ Cliente registrado exitosamente');
      return { success: true };
    } catch (error) {
      console.error('❌ Error al registrar cliente:', error);
      return { 
        success: false, 
        message: error.response?.data || 'Error al registrar' 
      };
    }
  };

  const registerEmpleado = async (nombre, puesto, email, password, role = 'MESERO') => {
    try {
      console.log('📝 Registrando empleado:', email);
      
      await authApiEmpleado.post('/auth/register', { 
        nombre, 
        puesto, 
        email, 
        password, 
        role 
      });
      
      console.log('✅ Empleado registrado exitosamente');
      return { success: true };
    } catch (error) {
      console.error('❌ Error al registrar empleado:', error);
      return { 
        success: false, 
        message: error.response?.data || 'Error al registrar' 
      };
    }
  };

  const logout = () => {
    console.log('🚪 Cerrando sesión...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      registerCliente, 
      registerEmpleado, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};