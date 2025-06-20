import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import usuarioRoutes from './Routes/usuarioRoutes';
import produtoRoutes from './Routes/produtoRoutes';
import vendaRoutes from './Routes/vendaRoutes';
import dashboardRoutes from './Routes/dashboardRoutes';

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rotas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/vendas', vendaRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Rodar servidor
app.listen(process.env.PORT || 5000, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT || 5000}`);
});
