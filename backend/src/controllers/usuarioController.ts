import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Cadastrar novo usuário
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

// Login de usuário
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

    if (!usuario.status) {
      return res.status(403).json({ erro: 'Usuário desativado. Entre em contato com o gerente.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Senha incorreta!' });
    }

    const token = jwt.sign(
      { id: usuario.id, cargo: usuario.cargo },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao fazer login' });
  }
};

// Alterar status do usuário (ativar/desativar)
export const alterarStatusUsuario = async (req: any, res: any) => {
  const { id } = req.params;
  const { status } = req.body;

  if (typeof status !== 'boolean') {
    return res.status(400).json({ erro: 'Status deve ser true ou false.' });
  }

  try {
    const usuario = await prisma.user.findUnique({ where: { id: Number(id) } });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    const usuarioAtualizado = await prisma.user.update({
      where: { id: Number(id) },
      data: { status }
    });

    res.json({ mensagem: `Usuário ${status ? 'ativado' : 'desativado'} com sucesso!`, usuario: usuarioAtualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao atualizar status do usuário.' });
  }
};

// Editar usuário
export const editarUsuario = async (req: any, res: any) => {
  const { id } = req.params;
  const { nome, email, cargo } = req.body;
  const idUsuarioLogado = req.usuario?.id;
  const cargoUsuarioLogado = req.usuario?.cargo;

  try {
    const usuario = await prisma.user.findUnique({ where: { id: Number(id) } });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    if (Number(id) !== idUsuarioLogado && cargoUsuarioLogado !== 'Gerente') {
      return res.status(403).json({ erro: 'Você só pode editar seu próprio perfil.' });
    }

    if (cargo && cargo !== usuario.cargo && cargoUsuarioLogado !== 'Gerente') {
      return res.status(403).json({ erro: 'Somente gerentes podem alterar o cargo de um usuário.' });
    }

    const usuarioAtualizado = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        nome: nome ?? usuario.nome,
        email: email ?? usuario.email,
        cargo: cargo ?? usuario.cargo,
      },
    });

    res.json({ mensagem: 'Usuário atualizado com sucesso!', usuario: usuarioAtualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao atualizar usuário.' });
  }
};

// Ver perfil do usuário autenticado
export const perfilUsuario = async (req: any, res: any) => {
  const id = req.usuario?.id;

  try {
    const usuario = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        cargo: true,
        status: true,
        dataAdmissao: true
      }
    });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar perfil.' });
  }
};
