import React, { useState, useEffect } from 'react';
import { crearProducto, getProductoById, updateProducto } from '../services/ProductoService'; 
import { listarTipos } from '../services/TipoService';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';
import { uploadFile } from '../services/FileStorageService'; // Servicio que hicimos antes

export const ProductoComponent = () => {
    // Estados para los campos del formulario
    const [nombreProducto, setNombreProducto] = useState('');
    const [descripcionProducto, setDescripcionProducto] = useState('');
    const [precioProducto, setPrecioProducto] = useState('');
    const [tipoId, setTipoId] = useState('');
    const [estado, setEstado] = useState(true);
    // AÑADE ESTOS DOS ESTADOS:
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagenRuta, setImagenRuta] = useState(''); // Para guardar la ruta de la imagen

    const [tipos, setTipos] = useState([]);
    
    // --- Lógica de Validación (Añadida) ---
    const [errors, setErrors] = useState({
        nombreProducto: '',
        descripcionProducto: '',
        precioProducto: '',
        tipoId: ''
    });

    const navegar = useNavigate();
    const { id_producto } = useParams();

    useEffect(() => {
        listarTipos().then(response => {
            setTipos(response.data);
        }).catch(error => console.error("Error al cargar tipos:", error));

        if (id_producto) {
                    getProductoById(id_producto).then((response) => {
                        const producto = response.data;
                        setNombreProducto(producto.nombreProducto);
                        setDescripcionProducto(producto.descripcionProducto);
                        setPrecioProducto(producto.precioProducto);
                        setTipoId(producto.tipo.id_tipo);
                        setEstado(producto.estado);
                        // AÑADE ESTA LÍNEA:
                        setImagenRuta(producto.imagen_ruta); // Carga la ruta de imagen existente
                    }).catch(error => console.error("Error al cargar producto:", error));
        }
    }, [id_producto]);

    function validaForm() {
        let valida = true;
        const errorsCopy = { nombreProducto: '', descripcionProducto: '', precioProducto: '', tipoId: '', imagenRuta: '' };

        if (!nombreProducto.trim()) { errorsCopy.nombreProducto = 'El nombre es requerido'; valida = false; }
        if (!descripcionProducto.trim()) { errorsCopy.descripcionProducto = 'La descripción es requerida'; valida = false; }
        if (!precioProducto || precioProducto <= 0) { errorsCopy.precioProducto = 'El precio debe ser mayor a 0'; valida = false; }
        if (!tipoId) { errorsCopy.tipoId = 'Debe seleccionar un tipo'; valida = false; }
        

        setErrors(errorsCopy);
        return valida;
    }

function saveOrUpdateProducto(e) {
        e.preventDefault();
        
        if (!validaForm()) { // 1. Validar el formulario
            return; // Detiene si no es válido
        }

        // 2. Revisar si hay un archivo nuevo
        if (selectedFile) {
            // 3. Si SÍ hay archivo nuevo
            uploadFile(selectedFile).then(response => {
                // 'response.data' es el string "Archivo subido con éxito: nombre.jpg"
                // Necesitamos extraer solo el nombre del archivo.
                const filename = response.data.split(': ')[1]; 
                
                // Llamamos a una nueva función para guardar, pasándole el NUEVO nombre de archivo
                guardarDatosProducto(filename);

            }).catch(error => {
                console.error("Error al subir la imagen:", error);
                alert("Error al subir la imagen.");
            });
        } else {
            // 4. Si NO hay archivo nuevo
            // Llamamos a la función de guardar pasándole la ruta de imagen que YA TENÍA
            guardarDatosProducto(imagenRuta);
        }
    }

    // NUEVA FUNCIÓN (extraída de tu 'saveOrUpdateProducto' original)
    function guardarDatosProducto(rutaDeImagen) {
        
        // Creamos el objeto producto, AÑADIENDO la imagen_ruta
        const producto = { 
            nombreProducto, 
            descripcionProducto, 
            precioProducto, 
            tipo: { id_tipo: tipoId }, 
            estado,
            imagen_ruta: rutaDeImagen // ¡Añadido!
        };
        
        // Esta lógica es la misma que ya tenías
        if (id_producto) {
            updateProducto(id_producto, producto).then(() => {
                console.log("Actualizando producto con imagen:", rutaDeImagen);
                alert("Producto actualizado");
                navegar('/productos');
            }).catch(error => console.error(error));
        } else {
            crearProducto(producto).then(() => {
                alert("Producto guardado con éxito ");
                navegar('/productos');
            }).catch(error => console.error(error));
        }
    }

    return (
        <div className="container">
            <h2 className="title">{id_producto ? 'Editar Producto' : 'Registro de Nuevo Producto'}</h2>
            
            <form onSubmit={saveOrUpdateProducto}>
                { }
                <div className="form-grid">
                    
                    { }
                    <div className="form-group">
                        <label>Nombre del Producto</label>
                        <input 
                            type="text" 
                            value={nombreProducto} 
                            // 2. Se añade la clase para que tome los estilos y la validación
                            className={`form-control ${errors.nombreProducto ? 'is-invalid' : ''}`}
                            onChange={(e) => setNombreProducto(e.target.value)} 
                        />
                        {errors.nombreProducto && <div className='invalid-feedback'>{errors.nombreProducto}</div>}
                    </div>

                    { }
                    <div className="form-group">
                        <label>Precio</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            value={precioProducto} 
                            className={`form-control ${errors.precioProducto ? 'is-invalid' : ''}`}
                            onChange={(e) => setPrecioProducto(e.target.value)} 
                        />
                        {errors.precioProducto && <div className='invalid-feedback'>{errors.precioProducto}</div>}
                    </div>

                    { }
                    <div className="form-group full-width">
                        <label>Descripción</label>
                        <input 
                            type="text" 
                            value={descripcionProducto} 
                            className={`form-control ${errors.descripcionProducto ? 'is-invalid' : ''}`}
                            onChange={(e) => setDescripcionProducto(e.target.value)} 
                        />
                        {errors.descripcionProducto && <div className='invalid-feedback'>{errors.descripcionProducto}</div>}
                    </div>

                    { }
                    <div className="form-group">
                        <label>Tipo de Producto</label>
                        <select 
                            value={tipoId} 
                            className={`form-control ${errors.tipoId ? 'is-invalid' : ''}`}
                            onChange={(e) => setTipoId(e.target.value)}
                        >
                            <option value="">-- Selecciona un tipo --</option>
                            {tipos.map(tipo => (
                                <option key={tipo.id_tipo} value={tipo.id_tipo}>{tipo.tipo}</option>
                            ))}
                        </select>
                        {errors.tipoId && <div className='invalid-feedback'>{errors.tipoId}</div>}
                    </div>

                    {/* CAMPO DE IMAGEN (AÑADIR) */}
                        <div className="form-group">
                            <label>Imagen del Producto</label>
                            <input 
                                type="file" 
                                className="form-control"
                                onChange={(e) => setSelectedFile(e.target.files[0])} 
                            />
                            {/* Muestra la imagen actual si estamos editando */}
                            {id_producto && imagenRuta && (
                                <small>Imagen actual: {imagenRuta}</small>
                            )}
                        </div>

                </div>

                { }
                <div className="actions">
                    <button type="submit" className="btn btn-save"><FaSave /> Guardar Producto</button>
                    <button type="button" className="btn btn-cancel text-2xl font-bold text-white" onClick={() => navegar('/productos')}><FaTimes /> Cancelar</button>
                </div>
            </form>
        </div>
    );
};