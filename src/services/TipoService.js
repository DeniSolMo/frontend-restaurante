// import axios from 'axios';

// // Usamos la ruta y puerto que me proporcionaste
// const API_BASE_URL = "http://localhost:7073/api/tipoProducto"; 

// export const listarTipos = () => {
//     return axios.get(API_BASE_URL);
// };

// export const crearTipo = (tipo) => {
//     return axios.post(API_BASE_URL, tipo);
// };

import apiProductos from '../api/axiosProductos';

export const listarTipos = () => {
    return apiProductos.get('/tipoProducto');
};

export const crearTipo = (tipo) => {
    return apiProductos.post('/tipoProducto', tipo);
};

export const getTipoById = (id) => {
    return apiProductos.get(`/tipoProducto/${id}`);
};

export const updateTipo = (id, tipo) => {
    return apiProductos.put(`/tipoProducto/${id}`, tipo);
};

export const deleteTipo = (id) => {
    return apiProductos.delete(`/tipoProducto/${id}`);
};