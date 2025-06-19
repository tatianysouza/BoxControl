import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import usuarioRoutes from './Routes/usuarioRoutes';
import produtoRoutes from './Routes/produtoRoutes';
import { PrismaClient } from '@prisma/client';
import vendaRoutes from './Routes/vendaRoutes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(cors());

// Rotas
app.use('/api/usuarios', usuarioRoutes);
app.use("/api/produtos", produtoRoutes);
app.use('/api/vendas', vendaRoutes);

// Conectar ao banco de dados e rodar o servidor
app.listen(process.env.PORT || 5000, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT || 5000}`);
});
