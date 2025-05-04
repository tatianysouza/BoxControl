import { Router } from 'express';
import { cadastrarUsuario, loginUsuario } from '../controllers/usuarioController';
import autenticarUsuario from '../middlewares/authMiddleware';
import autorizarCargo from '../middlewares/authRoleMiddleware';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/cadastrar', cadastrarUsuario);
router.post('/login', loginUsuario);

router.get('/perfil', autenticarUsuario, (req: any, res: any) => {
  res.json({
    mensagem: `Bem-vindo, usuário ${req.usuario.id}!`,
    cargo: req.usuario.cargo,
  });
});

router.get('/listar', autenticarUsuario, autorizarCargo(['Gerente']), async (req: any, res: any) => {
  try {
    const usuarios = await prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        cargo: true,
        status: true,
        dataAdmissao: true,
      },
    });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar usuários' });
  }
});

export default router;
