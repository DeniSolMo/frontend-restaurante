// import axios from 'axios';

// // Asumiendo que tu microservicio 'fonda1' corre en el puerto 7073
// const API_BASE_URL = "http://localhost:7073/api/venta"; 

// export const crearVenta = (ventaDto) => {
//     return axios.post(API_BASE_URL, ventaDto);
// };
// // --- 👇 AÑADE ESTAS NUEVAS FUNCIONES 👇 ---

// // Obtiene la lista de todas las ventas
// export const listarVentas = () => {
//     return axios.get(API_BASE_URL);
// };

// // Obtiene los detalles de una sola venta por su ID
// export const getVentaById = (idVenta) => {
//     return axios.get(`${API_BASE_URL}/${idVenta}`);
// };


// // --- 👇 AÑADE ESTA FUNCIÓN 👇 ---
// export const deleteVenta = (idVenta) => {
//     return axios.delete(`${API_BASE_URL}/${idVenta}`);
// };
// // --- 👇 AÑADE ESTA FUNCIÓN SI NO LA TIENES 👇 ---
// export const updateVenta = (idVenta, ventaDto) => {
//     return axios.put(`${API_BASE_URL}/${idVenta}`, ventaDto);
// };

import apiProductos from '../api/axiosProductos';

export const crearVenta = (ventaDto) => {
    return apiProductos.post('/venta', ventaDto);
};

export const listarVentas = () => {
    return apiProductos.get('/venta');
};

export const getVentaById = (idVenta) => {
    return apiProductos.get(`/venta/${idVenta}`);
};

export const updateVenta = (idVenta, ventaDto) => {
    return apiProductos.put(`/venta/${idVenta}`, ventaDto);
};

export const deleteVenta = (idVenta) => {
    return apiProductos.delete(`/venta/${idVenta}`);
};