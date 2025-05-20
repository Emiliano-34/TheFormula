import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './DetalleProducto.css';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const DetallesProducto = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/products/${id}`);
        const data = await res.json();

        if (!data.success) {
          setProducto(false);
          return;
        }

        setProducto(data.product);

        // Cargar productos relacionados si hay categoriaId
        if (data.product?.categoriaId) {
          const relacionadosRes = await fetch(`http://localhost:3001/api/products/relacionados/${data.product.categoriaId}`);
          const relacionadosData = await relacionadosRes.json();
          if (relacionadosData.success) {
            setRelacionados(relacionadosData.products);
          }
        }
      } catch (err) {
        console.error('Error al cargar el producto:', err);
        setProducto(false);
      }
    };

    fetchProducto();
  }, [id]);

  const handleAddToCart = () => {
    if (producto) {
      const item = {
        id: producto.id,
        name: producto.name,
        price: producto.price,
        image: producto.image,
        cantidad
      };
      addToCart(item);
    }
  };

  if (producto === false) return <div className="detalle-container">Producto no encontrado</div>;
  if (producto === null) return <div className="detalle-container">Cargando...</div>;

  return (
    <>
      <Header />
      <div className="detalle-container">
        <div className="galeria">
          <img src={producto.image} alt="Mini" />
          <img src={producto.image} alt="Mini" />
        </div>

        <div className="principal">
          <img src={producto.image} alt={producto.name} />
        </div>

        <div className="info">
          <h1>{producto.name}</h1>
          <div style={{ color: '#e67e22', fontSize: '14px' }}>{producto.reviews} reseñas</div>
          <div className="precio">${Number(producto.price).toFixed(2)}</div>
          <div className="estado">En existencia</div>

          <div className="acciones">
            <div className="cantidad">
              <button onClick={() => setCantidad(c => Math.max(1, c - 1))}>-</button>
              <span>{cantidad}</span>
              <button onClick={() => setCantidad(c => c + 1)}>+</button>
            </div>
            <button className="agregar-carrito" onClick={handleAddToCart}>
              Añadir al carrito
            </button>
          </div>

          <div className="beneficios">
            <p><strong>Envío gratis</strong> — Ingresa tu código postal para validar</p>
            <p><strong>Devolución</strong> — 30 días para devolución gratuita</p>
          </div>
        </div>
      </div>

      {relacionados.length > 0 && (
        <div className="relacionados">
          <h2>Productos relacionados</h2>
          <div className="productos-relacionados">
            {relacionados.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default DetallesProducto;
