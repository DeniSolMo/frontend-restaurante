// import axios from 'axios';

// const API_BASE_URL = "http://localhost:7076/api/reserva"; 

// export const listarReservas = () => axios.get(API_BASE_URL);
// export const crearReserva = (reserva) => axios.post(API_BASE_URL, reserva);

// // --- 👇 AÑADE ESTAS DOS FUNCIONES SI NO LAS TIENES 👇 ---
// // Obtiene una reserva específica por su ID
// export const getReservaById = (idReserva) => axios.get(`${API_BASE_URL}/${idReserva}`);

// // Actualiza una reserva existente
// export const updateReserva = (idReserva, reserva) => axios.put(`${API_BASE_URL}/${idReserva}`, reserva);

// // --- 👇 AÑADE ESTA FUNCIÓN FALTANTE 👇 ---
// export const deleteReserva = (idReserva) => {
//     return axios.delete(`${API_BASE_URL}/${idReserva}`);
// };

import api from '../api/axios';

export const listarReservas = () => {
    return api.get('/reserva');
};

export const crearReserva = (reserva) => {
    return api.post('/reserva', reserva);
};

export const getReservaById = (idReserva) => {
    return api.get(`/reserva/${idReserva}`);
};

export const updateReserva = (idReserva, reserva) => {
    return api.put(`/reserva/${idReserva}`, reserva);
};

export const deleteReserva = (idReserva) => {
    return api.delete(`/reserva/${idReserva}`);
};