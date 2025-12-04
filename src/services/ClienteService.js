// import axios from "axios"

// const REST_API_BASE_URL = "http://localhost:7072/api/cliente";

// export const listClientes = () => axios.get(REST_API_BASE_URL);

// export const crearCliente = (cliente) => axios.post(REST_API_BASE_URL, cliente);

// // 👇 AÑADE ESTA FUNCIÓN 👇
// export const getCliente = (id_cliente) => axios.get(`${REST_API_BASE_URL}/${id_cliente}`);

// // 👇 Y AÑADE ESTA OTRA 👇
// export const updateCliente = (id_cliente, cliente) => axios.put(`${REST_API_BASE_URL}/${id_cliente}`, cliente);

// // Elimina un cliente
// export const deleteCliente = (id_cliente) => axios.delete(`${REST_API_BASE_URL}/${id_cliente}`);

//

import apiRestaurante from '../api/axiosRestaurante';

export const listClientes = () => apiRestaurante.get('/cliente');

export const crearCliente = (cliente) => apiRestaurante.post('/cliente', cliente);

export const getCliente = (id) => apiRestaurante.get(`/cliente/${id}`);

export const updateCliente = (id, cliente) => apiRestaurante.put(`/cliente/${id}`, cliente);

export const deleteCliente = (id) => apiRestaurante.delete(`/cliente/${id}`);