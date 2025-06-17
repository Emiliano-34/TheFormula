import './VentasPorCategoria.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts';

const COLORS = ['#fe4219', '#19fe7b', '#edfe19', '#2e19fe', '#f719fe'];

const VentasPorCategoria = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/ventas/categorias-ventas')
      .then(response => setData(response.data))
      .catch(error => console.error('Error al obtener datos:', error));
  }, []);

  return (
  <div className="chart-container">
  <h2 className="text-3xl font-bold mb-6 text-center">Ventas por Categoría</h2>
  <div className="chart-wrapper">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barSize={120} margin={{ top: 40, right: 30, left: 20, bottom: 80 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="NOMBRE_CATEGORIA"
          interval={0}
          angle={-25}
          textAnchor="end" />
        <YAxis />
        <Tooltip formatter={(value) => value} />
        <Bar dataKey="total_vendidos">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <LabelList
            dataKey="total_vendidos"
            position="top"
            style={{ fill: 'black', fontWeight: 'bold' }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>
);
};

export default VentasPorCategoria;
