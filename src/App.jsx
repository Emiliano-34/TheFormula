import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AgregarProducto from './components/AgregarProducto';
import ActualizarInventario from './components/ActualizarInventario';
import PanelAdmin from './pages/PanelAdmin';
import AdminRoute from './components/AdminRoute';
import Productos from './components/Productos';
import HistorialPedidos from './pages/HistorialPedidos';


import DetalleProducto from './pages/DetalleProducto';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Perfil from './pages/Perfil';
import TodosProductos from './pages/TodosProductos';
import Buscar from './pages/Buscar';
import DireccionEnvio from './pages/DireccionEnvio';
import MetodosPago from './pages/MetodosPago';
import Checkout from './pages/checkout';

import AdminLayout from './components/AdminLayout';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/favoritos" element={<Favorites />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/producto/:id" element={<DetalleProducto />} />
      <Route path="/todos-productos" element={<TodosProductos />} />
      <Route path="/buscar" element={<Buscar />} />
      <Route path="/direccion-envio" element={<DireccionEnvio />} />
      <Route path="/metodos-pago" element={<MetodosPago />} />
      <Route path="/historial-pedidos" element={<HistorialPedidos />} />
      {/* Rutas protegidas del admin */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<PanelAdmin />} />
        <Route path="productos" element={<Productos />} />
        <Route path="agregar-producto" element={<AgregarProducto />} />
        <Route path="Actualizar-Inventario" element={<ActualizarInventario />} />
      </Route>
    </Routes>
  );
}

export default App;
