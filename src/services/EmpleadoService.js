import axios from 'axios';
//import api from '../axios/axios';
import api from '../api/axios';


// Usamos el puerto y la ruta que me proporcionaste
const API_BASE_URL = "http://localhost:7076/api/empleado"; 

// --- Funciones CRUD completas para Empleado ---

export const listarEmpleados = () => {
    return api.get('/empleado');
}

export const crearEmpleado = (empleado) => {
    return api.post('/empleado', empleado);
}

export const getEmpleadoById = (idEmpleado) => {
    return api.get(`/empleado/${idEmpleado}`);
}

export const updateEmpleado = (idEmpleado, empleado) => {
    return api.put(`/empleado/${idEmpleado}`, empleado);
}

export const deleteEmpleado = (idEmpleado) => {
    return api.delete(`/empleado/${idEmpleado}`);
}


//----------------------------------------------------------------------------------------//

