import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './Components/Header'; 
import { ListClienteComponent } from './Components/ListClienteComponent';
import { ClienteComponent } from './Components/ClienteComponent';
import { ListProductoComponent } from './Components/ListProductoComponent';
import { ProductoComponent } from './Components/ProductoComponent';
import { ListTipoComponent } from './Components/ListTipoComponent';
import { TipoComponent } from './Components/TipoComponent';
import { ListEmpleadoComponent } from './Components/ListEmpleadoComponent';
import { EmpleadoComponent } from './Components/EmpleadoComponent';
import { MesaComponent } from './Components/MesaComponent';
import { ListMesaComponent } from './Components/ListMesaComponent';
import { VentaComponent } from './Components/VentaComponent';
import { ListVentaComponent } from './Components/ListVentaComponent';
import { DetalleVentaComponent } from './Components/DetalleVentaComponent';
import { ReservaComponent } from './Components/ReservaComponent';
import { ListReservaComponent } from './Components/ListReservaComponent';

// Componentes de autenticación
import Login from './Components/Login';
import RegisterCliente from './Components/RegisterCliente';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas - Solo Login y Register */}
            <Route path='/login' element={<Login />} />
            <Route path='/register-cliente' element={<RegisterCliente />} />

          {/* Rutas protegidas - Requieren autenticación */}
<Route path="/*" element={
  <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR', 'EMPLEADO', 'CLIENTE']}>
    <div>
      <Header />
      <main className="main-content">
        <Routes>
          
          {/* ================= CLIENTE ================= */}
          <Route path="/productos" element={<ListProductoComponent />} />
          <Route path="/reservas" element={<ListReservaComponent />} />

          {/* ================= EMPLEADO ================= */}
          <Route path="/registrar-cliente" element={
            <ProtectedRoute allowedRoles={['EMPLEADO', 'SUPERVISOR', 'ADMIN']}>
              <ClienteComponent />
            </ProtectedRoute>
          } />
          <Route path="/clientes" element={
            <ProtectedRoute allowedRoles={['EMPLEADO', 'SUPERVISOR', 'ADMIN']}>
              <ListClienteComponent />
            </ProtectedRoute>
          } />
          <Route path="/editar-cliente/:id_cliente" element={
            <ProtectedRoute allowedRoles={['EMPLEADO', 'SUPERVISOR', 'ADMIN']}>
              <ClienteComponent />
            </ProtectedRoute>
          } />

          {/* Ventas */}
          <Route path="/registrar-venta" element={
            <ProtectedRoute allowedRoles={['EMPLEADO', 'SUPERVISOR', 'ADMIN']}>
              <VentaComponent />
            </ProtectedRoute>
          } />
          <Route path="/historial-ventas" element={
            <ProtectedRoute allowedRoles={['EMPLEADO', 'SUPERVISOR', 'ADMIN']}>
              <ListVentaComponent />
            </ProtectedRoute>
          } />

          {/* Reservas */}
          <Route path="/registrar-reserva" element={
            <ProtectedRoute allowedRoles={['EMPLEADO', 'SUPERVISOR', 'ADMIN']}>
              <ReservaComponent />
            </ProtectedRoute>
          } />
          <Route path="/editar-reserva/:idReserva" element={
            <ProtectedRoute allowedRoles={['EMPLEADO', 'SUPERVISOR', 'ADMIN']}>
              <ReservaComponent />
            </ProtectedRoute>
          } />

          {/* ================= SUPERVISOR ================= */}
          <Route path="/registrar-producto" element={
            <ProtectedRoute allowedRoles={['SUPERVISOR', 'ADMIN']}>
              <ProductoComponent />
            </ProtectedRoute>
          } />

        {/* Rutas de Tipos */}
                    <Route path='/tipos' element={<ListTipoComponent />} />
                    <Route path='/registrar-tipo' element={
                      <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR']}>
                        <TipoComponent />
                      </ProtectedRoute>
                    } />
          <Route path="/editar-producto/:id_producto" element={
            <ProtectedRoute allowedRoles={['SUPERVISOR', 'ADMIN']}>
              <ProductoComponent />
            </ProtectedRoute>
          } />

          {/* Mesas */}
          <Route path="/mesas" element={<ListMesaComponent />} />
          <Route path="/registrar-mesa" element={
            <ProtectedRoute allowedRoles={['SUPERVISOR', 'ADMIN']}>
              <MesaComponent />
            </ProtectedRoute>
          } />
          <Route path="/editar-mesa/:idMesa" element={
            <ProtectedRoute allowedRoles={['SUPERVISOR', 'ADMIN']}>
              <MesaComponent />
            </ProtectedRoute>
          } />

          {/* Empleados */}
          <Route path="/empleados" element={
            <ProtectedRoute allowedRoles={['SUPERVISOR', 'ADMIN']}>
              <ListEmpleadoComponent />
            </ProtectedRoute>
          } />
          <Route path="/registrar-empleado" element={
            <ProtectedRoute allowedRoles={['SUPERVISOR', 'ADMIN']}>
              <EmpleadoComponent />
            </ProtectedRoute>
          } />

          {/* ADMIN ALL */}
          <Route path="*" element={<Navigate to="/productos" replace />} />
        </Routes>
      </main>
    </div>
  </ProtectedRoute>
} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;