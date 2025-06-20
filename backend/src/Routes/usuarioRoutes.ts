import { Router } from 'express';
import { cadastrarUsuario, loginUsuario, perfilUsuario, editarUsuario, alterarStatusUsuario } from '../controllers/usuarioController';
import autenticarUsuario from '../middlewares/authMiddleware';
import autorizarCargo from '../middlewares/authRoleMiddleware';

const router = Router();

// Rotas públicas
router.post('/cadastrar', cadastrarUsuario);
router.post('/login', loginUsuario);

// Rotas protegidas
router.get('/perfil', autenticarUsuario, perfilUsuario);

router.get('/listar', autenticarUsuario, autorizarCargo(['Gerente']), async (req: any, res: any) => {
  try {
    const usuarios = await req.prisma.user.findMany({
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

router.put('/editar/:id', autenticarUsuario, editarUsuario);
router.patch('/status/:id', autenticarUsuario, autorizarCargo(['Gerente']), alterarStatusUsuario);

export default router;
