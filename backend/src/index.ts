import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';

import usuarioRoutes from './Routes/usuarioRoutes';
import produtoRoutes from './Routes/produtoRoutes';
import vendaRoutes from './Routes/vendaRoutes';
import dashboardRoutes from './Routes/dashboardRoutes';
import { iniciarSocket } from './socket'; // importa a função do socket

dotenv.config();

const app = express();
const server = http.createServer(app);

// Inicializa o Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Inicializa o socket de vendas
iniciarSocket(io);

// Middlewares
app.use(express.json());
app.use(cors());

// Rotas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/vendas', vendaRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Rodar servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
