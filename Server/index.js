import express from 'express';
import cors from 'cors';

import cartRoutes from './routes/cartRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import pedidosRoutes from './routes/pedidosRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js' // <-- Agrega esta línea
import inventarioRoutes from './routes/inventarioRoutes.js';
import ventasRoutes from './routes/ventasRoutes.js';
import chatbotRoutes from './routes/chatbot.js';
import resenasRoutes from './routes/resenas.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

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
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
