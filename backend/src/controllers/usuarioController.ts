import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = 'secreto'; // ideal: usar variável de ambiente

export const cadastrarUsuario = async (req: any, res: any) => {
  const { nome, email, senha, cargo } = req.body;

  if (!nome || !email || !senha || !cargo) {
    return res.status(400).json({ erro: 'Preencha todos os campos!' });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = await prisma.user.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        cargo,
      },
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
  }
};

export const loginUsuario = async (req: any, res: any) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos!' });
  }

  try {
    const usuario = await prisma.user.findUnique({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado!' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Senha incorreta!' });
    }

    const token = jwt.sign({ id: usuario.id, cargo: usuario.cargo }, JWT_SECRET, { expiresIn: '2h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao fazer login' });
  }
};
