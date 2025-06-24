import express from 'express';
import fetch from 'node-fetch';
import { cargarCatalogoProductos } from '../utils/cargarCatalogo.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const catalogo = cargarCatalogoProductos();

const mensajeBienvenida = `Hola, soy **Fermín**, tu asistente experto en suplementos y salud. 💊💪

Nuestra tienda ofrece:
- Multivitamínicos
- Proteínas
- Omega-3
- Suplementos deportivos

Dime cómo te puedo ayudar :)`;

const respuestasPredefinidas = [
  {
    patrones: ['hola', 'buenas', 'hey', 'qué tal', 'saludos'],
    respuesta: mensajeBienvenida,
  },
  {
    patrones: ['opciones veganas', 'recomiéndame opciones veganas', 'algo vegano'],
    respuesta: `Aquí tienes algunas opciones que podrían interesarte:\n- Barra Vegana Lenny & Larrys Chocolate Almond Sea Salt 45 Gramos\n- Proteína vegetal con chía y avena`,
  },
  {
    patrones: ['recomiéndame proteínas', 'proteína', 'quiero proteína', 'proteinas'],
    respuesta: `Aquí tienes algunas opciones que podrían interesarte:\n- Proteína Birdman Vainilla 500g\n- Proteína Whey Optimum 1kg Chocolate`,
  }
];

// Función para buscar coincidencia con patrones predefinidos
function buscarRespuestaPredefinida(mensaje) {
  const mensajeLower = mensaje.toLowerCase();
  for (const r of respuestasPredefinidas) {
    if (r.patrones.some(p => mensajeLower.includes(p))) {
      return r.respuesta;
    }
  }
  return null;
}

// Generar prompt para DeepSeek u OpenRouter
function construirPromptCatalogo() {
  return catalogo.map(p =>
    `- ${p.nombre} | Ingredientes: ${p.ingredientes}`
  ).join('\n');
}

// Ruta POST /api/chat
router.post('/chat', async (req, res) => {
  const { userMessage } = req.body;

  // Revisión de respuestas locales
  const respuestaLocal = buscarRespuestaPredefinida(userMessage);
  if (respuestaLocal) {
    return res.json({ respuesta: respuestaLocal });
  }

  // Si no hay respuesta local, consultar API de lenguaje
  const catalogoTexto = construirPromptCatalogo();

  const promptSistema = `
Eres Fermín, un experto en suplementos, vitaminas y productos de salud.
Usa la siguiente lista de productos para responder basándote en sus ingredientes y nombres. 
Si el usuario menciona sabores, condiciones (como vegano, sin azúcar) o ingredientes, sugiere productos relacionados.

Lista de productos:
${catalogoTexto}
`;

  try {
    const response = await fetch(process.env.API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.MODEL,
        messages: [
          { role: 'system', content: promptSistema },
          { role: 'user', content: userMessage },
        ],
      }),
    });

    const data = await response.json();

    if (data.choices?.[0]?.message?.content) {
      return res.json({ respuesta: data.choices[0].message.content });
    } else {
      return res.json({
        respuesta: 'Lo siento, no pude generar una respuesta en este momento.',
      });
    }
  } catch (error) {
    console.error('Error al conectar con la API de lenguaje:', error);
    res.status(500).json({
      respuesta: 'Ocurrió un error al procesar tu solicitud.',
    });
  }
});

export default router;
