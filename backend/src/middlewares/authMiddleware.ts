import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

const autenticarUsuario = (req: any, res: any, next: any) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ erro: 'Acesso negado! Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ erro: 'Token inválido!' });
  }
};

export default autenticarUsuario;
