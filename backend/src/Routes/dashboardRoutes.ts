import { Router } from 'express';
import autenticarUsuario from '../middlewares/authMiddleware';
import autorizarCargo from '../middlewares/authRoleMiddleware';
import { dadosDashboard, vendasPorFuncionario } from '../controllers/dashboardController';

const router = Router();

// Dashboard geral
router.get('/', autenticarUsuario, autorizarCargo(['Gerente']), dadosDashboard);

// Vendas por funcionário
router.get('/vendas-por-funcionario', autenticarUsuario, autorizarCargo(['Gerente']), vendasPorFuncionario);

export default router;
