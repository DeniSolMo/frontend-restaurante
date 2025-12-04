// import axios from 'axios';

// // Asumiendo que el endpoint de Atender está en el MS de reservaciones
// const API_BASE_URL = "http://localhost:7076/api/atender"; 

// // Función para crear un registro de atención
// // Espera un objeto como { idventa: 1, idempleado: 5 }
// export const crearAtencion = (atencionData) => {
//     return axios.post(API_BASE_URL, atencionData);
// };

// // ... (tu función crearAtencion)

// // --- 👇 AÑADE ESTA FUNCIÓN 👇 ---
// export const listarAtenciones = () => {
//     return axios.get(API_BASE_URL);
// };

import api from '../api/axios';

export const crearAtencion = (atencionData) => {
    return api.post('/atender', atencionData);
};

export const listarAtenciones = () => {
    return api.get('/atender');
};

export const getAtencionById = (id) => {
    return api.get(`/atender/${id}`);
};

export const updateAtencion = (id, atencionData) => {
    return api.put(`/atender/${id}`, atencionData);
};

export const deleteAtencion = (id) => {
    return api.delete(`/atender/${id}`);
};