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
  const [resenas, setResenas] = useState([]);
  const [nuevaResena, setNuevaResena] = useState({ texto: '', calificacion: 0 });

  const enviarResena = async () => {
  try {
    console.log("Enviando reseña:", {
    texto: nuevaResena.texto,
    calificacion: nuevaResena.calificacion,
    });

    const response = await fetch(`http://localhost:3001/api/resenas/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      texto: nuevaResena.texto,
      calificacion: nuevaResena.calificacion,
    }),
    });

    if (!response.ok) {
      throw new Error('Error al enviar reseña');
    }

    const data = await response.json();
    console.log("Reseña enviada con éxito", data);

    // Opcional: agregar la nueva reseña a la lista
    setResenas([...resenas, { texto: nuevaResena.texto, calificacion: nuevaResena.calificacion }]);

    // Limpiar el formulario
    setNuevaResena({ texto: '', calificacion: 0 });
  } catch (error) {
    console.error("Error al enviar reseña:", error);
  }
  };

 useEffect(() => {
  const fetchProducto = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/products/${id}`);
      if (!res.ok) throw new Error('Respuesta no válida del servidor');

      const data = await res.json();
      if (!data.success || !data.product) {
        setProducto(false);
        return;
      }

      setProducto(data.product);

      // productos relacionados
      if (data.product.categoriaId) {
        const relRes = await fetch(
          `http://localhost:3001/api/products/relacionados/${data.product.categoriaId}/${data.product.id}`
        );
        if (relRes.ok) {
          const relData = await relRes.json();
          if (relData.success) setRelacionados(relData.products || []);
        }
      }

    } catch (err) {
      console.error('Error al cargar el producto:', err);
      setProducto(false);
    }
  };

  fetchProducto();
  const fetchResenas = async () => {
  try {
    const res = await fetch(`http://localhost:3001/api/resenas/${id}`);
    const data = await res.json();
    if (data.success) setResenas(data.reseñas);
  } catch (err) {
    console.error('Error al obtener reseñas:', err);
  }
};

fetchResenas();

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
          <img src={producto.image} alt={`${producto.name} miniatura 1`} />
          <img src={producto.image} alt={`${producto.name} miniatura 2`} />
        </div>

        <div className="principal">
          <img src={producto.image} alt={producto.name} />
        </div>

        <div className="info">
          <h1>{producto.name}</h1>
          <div style={{ color: '#e67e22', fontSize: '14px' }}>
            {producto.reviews} reseñas
          </div>
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

      <div className="resenas-container">
  <h2>Reseñas</h2>

  {resenas.length === 0 ? (
    <p>No hay reseñas todavía.</p>
  ) : (
    resenas.map((resena, idx) => (
      <div key={idx} className="resena">
        <div><strong>Calificación:</strong> {resena.calificacion} ⭐</div>
        <p>{resena.texto}</p>
      </div>
    ))
  )}

  <div className="nueva-resena">
    <h3>Escribe tu reseña</h3>
    <textarea
      value={nuevaResena.texto}
      onChange={(e) => setNuevaResena({ ...nuevaResena, texto: e.target.value })}
      placeholder="Escribe tu comentario aquí"
    />
    <select
      value={nuevaResena.calificacion}
      onChange={(e) =>
        setNuevaResena({ ...nuevaResena, calificacion: parseInt(e.target.value) })
      }
    >
      <option value={0}>Calificación</option>
      <option value={1}>1</option>
      <option value={2}>2</option>
      <option value={3}>3</option>
      <option value={4}>4</option>
      <option value={5}>5</option>
    </select>
    <button onClick={enviarResena}>Enviar reseña</button>
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