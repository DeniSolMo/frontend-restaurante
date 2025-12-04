import React from 'react';
import './Header.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaUserPlus, 
  FaUserTie, 
  FaCashRegister, 
  FaHistory, 
  FaCalendarAlt, 
  FaCalendarCheck,
  FaSignOutAlt,
  FaUser
} from 'react-icons/fa';
import { MdTableRestaurant, MdAddBox } from 'react-icons/md';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Roles
  const isAdmin = user?.role === 'ADMIN';
  const isSupervisor = user?.role === 'SUPERVISOR';
  const isEmpleado = user?.role === 'EMPLEADO';
  const isCliente  = user?.role === 'CLIENTE';

  return (
    <header className="main-header">
      <div className="logo">
        <a href="/productos">CosMo Restaurante</a>
      </div>

      <nav>
        <ul>

          {/* ===================== PRODUCTOS (todos pueden ver) ===================== */}
          <li className="dropdown">
            <a href="/productos">Productos</a>
            <div className="dropdown-panel">
              <div className="mega-menu-column">
                <ul>
                  {(isSupervisor || isAdmin) && (
                    <li><a href="/registrar-producto">Registrar Producto</a></li>
                  )}
                </ul>
              </div>
            </div>
          </li>

          {/* ===================== CLIENTES ===================== */}
          {(isEmpleado || isSupervisor || isAdmin) && (
            <li className="dropdown">
              <a href="/clientes">Clientes</a>
              <div className="dropdown-panel">
                <div className="mega-menu-column">
                  <ul>
                    <li><a href="/clientes"><FaUsers /> Ver Clientes</a></li>

                    {/* Registrar cliente: empleado, supervisor, admin */}
                    {(isEmpleado || isSupervisor || isAdmin) && (
                      <li><a href="/registrar-cliente"><FaUserPlus /> Registrar Cliente</a></li>
                    )}
                  </ul>
                </div>
              </div>
            </li>
          )}

          {/* ===================== CATEGORÍAS (solo admins & supervisor) ===================== */}
          {(isSupervisor || isAdmin) && (
            <li className="dropdown">
              <a href="/tipos">Categorías</a>
              <div className="dropdown-panel">
                <div className="mega-menu-column">
                  <ul>
                    <li><a href="/tipos">Ver Tipos</a></li>
                    <li><a href="/registrar-tipo">Registrar Tipo</a></li>
                  </ul>
                </div>
              </div>
            </li>
          )}

          {/* ===================== EMPLEADOS (solo supervisor & admin) ===================== */}
          {(isSupervisor || isAdmin) && (
            <li className="dropdown">
              <a href="/empleados">Empleados</a>
              <div className="dropdown-panel">
                <div className="mega-menu-column">
                  <ul>
                    <li><a href="/empleados"><FaUsers /> Ver Empleados</a></li>
                    <li><a href="/registrar-empleado"><FaUserTie /> Registrar Empleado</a></li>
                  </ul>
                </div>
              </div>
            </li>
          )}

          {/* ===================== MESAS (solo supervisor & admin) ===================== */}
          {(isSupervisor || isAdmin) && (
            <li className="dropdown">
              <a href="/mesas">Mesas</a>
              <div className="dropdown-panel">
                <div className="mega-menu-column">
                  <ul>
                    <li><a href="/mesas"><MdTableRestaurant /> Ver Mesas</a></li>
                    <li><a href="/registrar-mesa"><MdAddBox /> Registrar Mesa</a></li>
                  </ul>
                </div>
              </div>
            </li>
          )}

          {/* ===================== VENTAS (empleado, supervisor, admin) ===================== */}
          {(isEmpleado || isSupervisor || isAdmin) && (
            <li className="dropdown">
              <a href="/historial-ventas">Ventas</a>
              <div className="dropdown-panel">
                <div className="mega-menu-column">
                  <ul>
                    <li><a href="/historial-ventas"><FaHistory /> Ver Historial</a></li>
                    <li><a href="/registrar-venta"><FaCashRegister /> Registrar Venta</a></li>
                  </ul>
                </div>
              </div>
            </li>
          )}

          {/* ===================== RESERVAS (todos pueden ver) ===================== */}
          <li className="dropdown">
            <a href="/reservas">Reservas</a>
            <div className="dropdown-panel">
              <div className="mega-menu-column">
                <ul>
                  <li><a href="/reservas"><FaCalendarAlt /> Ver Reservas</a></li>

                  {/* Crear reservas: empleado, supervisor, admin */}
                  {(isEmpleado || isSupervisor || isAdmin) && (
                    <li><a href="/registrar-reserva"><FaCalendarCheck /> Crear Reserva</a></li>
                  )}
                </ul>
              </div>
            </div>
          </li>

        </ul>
      </nav>

      {/* ===================== USER INFO ===================== */}
      <div className="user-section">
        <div className="user-info">
          <FaUser className="user-icon" />
          <div className="user-details">
            <span className="user-name">{user?.nombre}</span>
            <span className="user-role">{user?.role}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt /> Cerrar Sesión
        </button>
      </div>
    </header>
  );
};
