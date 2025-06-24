import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <>
      <Header />
      <div className="main-layout">
        <Sidebar />
        <div className="content">
          <Outlet /> {/* Aquí se insertarán las subrutas */}
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
