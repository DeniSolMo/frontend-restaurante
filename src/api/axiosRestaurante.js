import axios from 'axios';

// Microservicio de Restaurante1 (puerto 7072)
const apiRestaurante = axios.create({
  //baseURL: 'http://localhost:7072/api',
  baseURL: 'https://microservicio-restaurante-468816459584.northamerica-south1.run.app/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token
apiRestaurante.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('🔍 [Restaurante] Interceptor ejecutado');
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

apiRestaurante.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ [Restaurante] Error:', error.response?.status);
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiRestaurante;