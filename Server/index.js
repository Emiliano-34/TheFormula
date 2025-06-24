import express from 'express';
import cors from 'cors';
import cartRoutes from './routes/cartRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import pedidosRoutes from './routes/pedidosRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import inventarioRoutes from './routes/inventarioRoutes.js';
import ventasRoutes from './routes/ventasRoutes.js';
import chatbotRoutes from './routes/chatbot.js';
import resenasRoutes from './routes/resenas.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- INICIO DE LA CORRECCIÓN DE CORS DEFINITIVA ---
const allowedOrigins = [
  'http://localhost:5173',
  'https://emiliano-34.github.io'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite peticiones sin origen (como Postman) o si el origen está en la lista blanca
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ¡CORRECCIÓN! Permitir el método OPTIONS
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'] // ¡CORRECCIÓN! Permitir cabeceras comunes
};

// Usar la configuración de CORS para todas las rutas
app.use(cors(corsOptions));
// --- FIN DE LA CORRECCIÓN DE CORS ---

app.use(express.json());

// Monta las rutas
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api', paymentRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/categorias', categoryRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/chatbot', chatbotRoutes);
app.use('/api/resenas', resenasRoutes);
app.use('/api', chatbotRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});
