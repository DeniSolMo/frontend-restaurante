import axios from 'axios';

const api = axios.create({
  baseURL: 'https://microservicio-springboot.azurewebsites.net/api',
  //baseURL: 'http://localhost:7076/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token a TODAS las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // Debug - ver si el token existe
    console.log(' Interceptor ejecutado');
    console.log(' Token:', token ? 'Existe ' : 'No existe ');
    console.log(' URL:', config.url);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(' Header Authorization agregado');
    } else {
      console.warn(' No hay token en localStorage');
    }
    
    return config;
  },
  (error) => {
    console.error('Error en interceptor request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    console.log(' Respuesta exitosa:', response.config.url);
    return response;
  },
  (error) => {
    console.error(' Error en respuesta:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log(' Token inválido o sin permisos, redirigiendo...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;