import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { crearVenta, getVentaById, updateVenta } from '../services/VentaService';
import { listClientes } from '../services/ClienteService';
import { listarProductos } from '../services/ProductoService';
import { listarEmpleados } from '../services/EmpleadoService';
import { crearAtencion, listarAtenciones } from '../services/AtenderService';  
import { FaPlus, FaTrash, FaShoppingCart, FaUserTie } from 'react-icons/fa';

export const VentaComponent = () => {
    const navegar = useNavigate();
    const location = useLocation();
    const { idVenta } = useParams();  

     
    const [idCliente, setIdCliente] = useState('');
    const [idReserva, setIdReserva] = useState(null);
    const [idEmpleado, setIdEmpleado] = useState('');
    const [detalles, setDetalles] = useState([]);  
    const [total, setTotal] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);  

     
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    
     
    const [productoSeleccionadoId, setProductoSeleccionadoId] = useState('');
    const [cantidad, setCantidad] = useState(1);

     
    useEffect(() => {
        setLoading(true);
         
        const loadLists = Promise.all([
            listClientes(),
            listarProductos(),
            listarEmpleados(),
        ]).then(([clientesRes, productosRes, empleadosRes]) => {
            setClientes(clientesRes.data);
            setProductos(productosRes.data);
            setEmpleados(empleadosRes.data);
            return { productos: productosRes.data };  
        });

         
        if (idVenta) {
             
            loadLists.then(({ productos }) => {
                Promise.all([
                    getVentaById(idVenta),
                    listarAtenciones()  
                ]).then(([ventaRes, atencionesRes]) => {
                    const venta = ventaRes.data;
                    const atenciones = atencionesRes.data;

                     
                    setIdCliente(venta.idCliente.toString());
                    setIdReserva(venta.idReserva);
                    
                     
                    const atencion = atenciones.find(a => a.idVenta === venta.idVenta);
                    if (atencion) {
                        setIdEmpleado(atencion.idEmpleado.toString());
                    }

                     
                    const productoMap = new Map(productos.map(p => [p.id_producto, p.nombreProducto]));
                    const detallesEnriquecidos = venta.detalles.map(d => ({
                        idProducto: d.idProducto,  
                        cantidad: d.cantidad,
                        precioUnitario: d.precioUnitario,
                        nombreProducto: productoMap.get(d.idProducto) || 'Producto Desconocido'  
                    }));
                    setDetalles(detallesEnriquecidos);

                }).catch(error => console.error("Error al cargar datos para edición:", error))
                  .finally(() => setLoading(false));  
            
            }).catch(error => {
                 console.error("Error al cargar listas iniciales:", error);
                 setLoading(false);  
            });
        } else {  
             
            if (location.state?.idCliente) {
                setIdCliente(location.state.idCliente.toString());
            }
            if (location.state?.idReserva) {
                setIdReserva(location.state.idReserva);
            }
             
            loadLists.finally(() => setLoading(false));
        }

    }, [idVenta, location.state]);  

     
    useEffect(() => {
        const nuevoTotal = detalles.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);
        setTotal(nuevoTotal);
    }, [detalles]);

     
    const handleAgregarProducto = () => {
        if (!productoSeleccionadoId || cantidad <= 0) {
            alert("Selecciona un producto y una cantidad válida.");
            return;
        }
        const productoExistenteIndex = detalles.findIndex(d => d.idProducto === parseInt(productoSeleccionadoId));

        if (productoExistenteIndex > -1) {  
            const nuevosDetalles = [...detalles];
            nuevosDetalles[productoExistenteIndex].cantidad += parseInt(cantidad);
            setDetalles(nuevosDetalles);
        } else {  
            const producto = productos.find(p => p.id_producto === parseInt(productoSeleccionadoId));
            if (!producto) {
                alert("Producto no encontrado.");
                return;
            }
            const nuevoDetalle = {
                idProducto: producto.id_producto,
                nombreProducto: producto.nombreProducto,  
                cantidad: parseInt(cantidad),
                precioUnitario: producto.precioProducto,
            };
            setDetalles([...detalles, nuevoDetalle]);
        }
         
        setProductoSeleccionadoId('');
        setCantidad(1);
    };

     
    const handleEliminarProducto = (index) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles.splice(index, 1);
        setDetalles(nuevosDetalles);
    };

     
    const handleSaveOrUpdateVenta = () => {
        if (!idCliente || detalles.length === 0 || !idEmpleado) {
            alert("Selecciona un cliente, un empleado y agrega al menos un producto.");
            return;
        }
        setIsSubmitting(true);

         
        const ventaDto = {
            idCliente: parseInt(idCliente),
            idReserva: idReserva,
            detalles: detalles.map(d => ({  
                idProducto: d.idProducto,
                cantidad: d.cantidad,
                precioUnitario: d.precioUnitario
            })) 
        };

        const atencionData = { idEmpleado: parseInt(idEmpleado) };  

        if (idVenta) {  
            updateVenta(idVenta, ventaDto).then(() => {
                 
                 
                 
                alert("Venta actualizada con éxito ");
                navegar('/historial-ventas');
            }).catch(error => {
                console.error("Error al actualizar la venta:", error);
                alert("Error al actualizar la venta.");
            }).finally(() => setIsSubmitting(false));  

        } else {  
             
            crearVenta(ventaDto).then((ventaResponse) => {
                const ventaGuardada = ventaResponse.data;
                console.log("Venta guardada:", ventaGuardada);

                 
                crearAtencion({ ...atencionData, idVenta: ventaGuardada.idVenta }).then(() => {
                    console.log("Registro de atención guardado.");
                    alert("Venta y atención registradas con éxito ");
                    navegar('/historial-ventas');
                }).catch(atencionError => {
                    console.error("Error al registrar la atención:", atencionError);
                    alert("Venta registrada, pero hubo un error al asignar el empleado.");
                    navegar('/historial-ventas');  
                });

            }).catch(ventaError => {
                console.error("Error al registrar la venta:", ventaError);
                alert("Error al registrar la venta.");
                setIsSubmitting(false);  
            });
        }
    };

     
    if (loading) {
        return <div className="container"><h2 className="title">Cargando datos...</h2></div>;
    }

     
    return (
        <div className="container">
            { }
            <h2 className="title">{idVenta ? `Editando Venta #${idVenta}` : 'Registrar Nueva Venta'}</h2>
            
            { }
            <div className='form-grid'>
                <div className="form-group">
                    <label>Cliente</label>
                    <select 
                        className="form-control" 
                        value={idCliente} 
                        onChange={(e) => setIdCliente(e.target.value)} 
                        required
                        disabled={!!location.state?.idCliente || !!idVenta}  
                    >
                        <option value="">-- Selecciona un cliente --</option>
                        {clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombreCliente}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label><FaUserTie /> Empleado que atiende</label>
                    <select 
                        className="form-control" 
                        value={idEmpleado} 
                        onChange={(e) => setIdEmpleado(e.target.value)} 
                        required
                    >
                        <option value="">-- Selecciona un empleado --</option>
                        {empleados.map(emp => <option key={emp.idEmpleado} value={emp.idEmpleado}>{emp.nombre}</option>)}
                    </select>
                </div>
            </div>

            { }
            {idReserva && <p style={{marginTop: '1rem', fontStyle: 'italic', textAlign: 'center'}}>Venta asociada a la reserva ID: {idReserva}</p>}

            <hr />

            { }
            <h3 className="title" style={{fontSize: '1.5rem'}}>Agregar Productos al Carrito</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label>Producto</label>
                    <select className="form-control" value={productoSeleccionadoId} onChange={(e) => setProductoSeleccionadoId(e.target.value)}>
                        <option value="">-- Selecciona un producto --</option>
                        {productos.map(p => <option key={p.id_producto} value={p.id_producto}>{p.nombreProducto} (${p.precioProducto.toFixed(2)})</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label>Cantidad</label>
                    <input type="number" className="form-control" value={cantidad} onChange={(e) => setCantidad(e.target.value)} min="1" />
                </div>
                <div className="actions" style={{justifyContent: 'flex-start', alignSelf: 'end'}}>
                    <button type="button" className="btn btn-save" onClick={handleAgregarProducto}><FaPlus /> Agregar</button>
                </div>
            </div>

            <hr />

            { }
            <h3 className="title" style={{fontSize: '1.5rem'}}><FaShoppingCart /> Carrito de Compra</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
               <tbody>
    {detalles.map((item, index) => (
        <tr key={index}>
            <td>{item.nombreProducto}</td>
            <td>{item.cantidad}</td>
            <td>${item.precioUnitario.toFixed(2)}</td>
            <td>${(item.cantidad * item.precioUnitario).toFixed(2)}</td>
            <td>
                <button className="btn btn-delete" onClick={() => handleEliminarProducto(index)}>
                    <FaTrash />
                </button>
            </td>
        </tr>
    ))}
</tbody>
            </table>

            { }
            <div style={{textAlign: 'right', fontSize: '1.5rem', fontWeight: 'bold', margin: '1rem 0'}}>
                Total: ${total.toFixed(2)}
            </div>
            <div className="actions">
                <button 
                    type="button" 
                    className="btn btn-save" 
                    onClick={handleSaveOrUpdateVenta}
                    disabled={isSubmitting}  
                >
                    {isSubmitting ? 'Guardando...' : (idVenta ? 'Actualizar Venta' : 'Finalizar Venta')}
                </button>
                <button type="button" className="btn btn-cancel text-2xl font-bold text-white" onClick={() => navegar('/historial-ventas')}>
                    Cancelar
                </button>
            </div>
        </div>
    );
};