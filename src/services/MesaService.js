import api from '../api/axios';

// Ya no necesitas API_BASE_URL porque 'api' ya tiene el baseURL configurado

export const listarMesas = () => api.get('/mesa');

export const crearMesa = (mesa) => api.post('/mesa', mesa);

export const getMesaById = (idMesa) => api.get(`/mesa/${idMesa}`);

export const updateMesa = (idMesa, mesa) => api.put(`/mesa/${idMesa}`, mesa);

export const deleteMesa = (idMesa) => api.delete(`/mesa/${idMesa}`);

export const toggleEstadoMesa = (idMesa) => {
    return api.patch(`/mesa/${idMesa}/toggle-estado`);
};

export const listarMesasDisponibles = () => {
    return api.get('/mesa/disponibles');
};