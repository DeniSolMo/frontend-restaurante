// import apiProductos from '../api/axiosProductos';

// // Lista productos activos (los que NO están eliminados/desactivados)
// export const listarProductos = () => {
//     return apiProductos.get('/producto');
// };

// // Crea un nuevo producto
// export const crearProducto = (producto) => {
//     return apiProductos.post('/producto', producto);
// };

// // Obtiene un producto por su ID
// export const getProductoById = (id_producto) => {
//     return apiProductos.get(`/producto/${id_producto}`);
// };

// // Actualiza un producto existente
// export const updateProducto = (id_producto, producto) => {
//     return apiProductos.put(`/producto/${id_producto}`, producto);
// };

// // Elimina (desactiva) un producto
// export const deleteProducto = (id_producto) => {
//     return apiProductos.delete(`/producto/${id_producto}`);
// };

// // Lista TODOS los productos (incluidos los desactivados)
// // Útil para reportes o paneles de administración
// export const listarTodosLosProductos = () => {
//     return apiProductos.get('/producto/todos');
// };

import apiProductos from '../api/axiosProductos';

// Lista productos activos
export const listarProductos = () => apiProductos.get('/producto');

// Crea un nuevo producto
export const crearProducto = (producto) => apiProductos.post('/producto', producto);

// Obtiene un producto por su ID
export const getProductoById = (id_producto) => apiProductos.get(`/producto/${id_producto}`);

// Actualiza un producto existente
export const updateProducto = (id_producto, producto) => apiProductos.put(`/producto/${id_producto}`, producto);

// Elimina (desactiva) un producto
export const deleteProducto = (id_producto) => apiProductos.delete(`/producto/${id_producto}`);

// Lista TODOS los productos (incluidos los desactivados)
// ¡Sí! Esto sigue funcionando igual, solo se ve más corto.
export const listarTodosLosProductos = () => apiProductos.get('/producto/todos');