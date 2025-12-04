import axios from 'axios';

// Microservicio de Productos (puerto 7073)
const apiProductos = axios.create({
  //baseURL: 'http://localhost:7073/api',
  baseURL: 'https://fonda-productos-production.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token
apiProductos.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('🔍 [Productos] Interceptor ejecutado');
    console.log('🔑 Token:', token ? 'Existe ✅' : 'No existe ❌');
    console.log('📍 URL:', config.url);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Header Authorization agregado');
    }
    return config;
  },
  (error) => {
    console.error('❌ Error en interceptor request:', error);
    return Promise.reject(error);
  }
);

apiProductos.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ [Productos] Error:', error.response?.status);
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiProductos;