import { useState, useEffect } from 'react';

const Chatbot = () => {
  const [minimizado, setMinimizado] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [conversacion, setConversacion] = useState([]);

  const mensajeInicial = `Hola, soy **Fermín**, tu asistente experto en suplementos, vitaminas y productos de salud. 💊🧠💪

Nuestra tienda ofrece:
- Multivitamínicos
- Proteínas
- Omega-3
- Suplementos deportivos

Dime qué necesitas y con gusto te ayudaré.`;

  useEffect(() => {
    if (!minimizado && conversacion.length === 0) {
      setConversacion([{ emisor: 'bot', texto: mensajeInicial }]);
    }
  }, [minimizado]);

  const enviarMensaje = async () => {
    if (mensaje.trim() === '') return;

    const nuevaConversacion = [...conversacion, { emisor: 'usuario', texto: mensaje }];
    setConversacion(nuevaConversacion);
    setMensaje('');

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: mensaje }),
      });

      const data = await res.json();

      setConversacion([...nuevaConversacion, { emisor: 'bot', texto: data.respuesta }]);
    } catch (error) {
      console.error('Error al conectar con el chatbot:', error);
      setConversacion([
        ...nuevaConversacion,
        { emisor: 'bot', texto: 'Lo siento, hubo un error al conectarme. Intenta de nuevo.' },
      ]);
    }
  };

  return (
    <div style={{ position: 'fixed', top: '50%', right: minimizado ? '10px' : '30px', transform: 'translateY(-50%)', zIndex: 1000 }}>
      {minimizado ? (
        <button
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#007bff',
            color: '#fff',
            border: '2px solid #ccc',
          }}
          onClick={() => setMinimizado(false)}
        >
          💬
        </button>
      ) : (
        <div
          style={{
            width: '300px',
            height: '400px',
            backgroundColor: '#fff',
            border: '2px solid #ccc',
            borderRadius: '10px',
            padding: '10px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
            {conversacion.map((msg, index) => (
              <div key={index} style={{ textAlign: msg.emisor === 'usuario' ? 'right' : 'left' }}>
                <p>
                  <strong>{msg.emisor === 'usuario' ? 'Tú' : 'Fermín'}:</strong><br />
                  {msg.texto.split('\n').map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
                </p>
              </div>
            ))}
          </div>

          <input
            type="text"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && enviarMensaje()}
            placeholder="Escribe un mensaje..."
            style={{ marginBottom: '10px', padding: '5px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={enviarMensaje}>Enviar</button>
            <button
              onClick={() => setMinimizado(true)}
              style={{
                backgroundColor: 'red',
                color: 'white',
                border: '2px solid #ccc',
                borderRadius: '5px',
              }}
            >
              Minimizar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
