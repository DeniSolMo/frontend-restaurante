// // src/services/FileStorageService.js
// import axios from 'axios';


// //const API_URL = "http://localhost:7073/api/files"; // Tu URL del backend
// const API_URL = "https://fonda-productos-production.up.railway.app/api"; // Tu URL del backend


// export const uploadFile = (file) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     // Devuelve la promesa de Axios
//     return axios.post(API_URL + "/upload", formData); 
// };

import axios from 'axios';

// URL Base del backend
const BASE_URL = "https://fonda-productos-production.up.railway.app/api"; 

export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // CORRECCIÓN: Asegúrate de apuntar a /api/files/upload 
    // (o solo /api/files si tu @PostMapping no tiene ruta extra en el Controller)
    return axios.post(BASE_URL + "/files/upload", formData); 
};