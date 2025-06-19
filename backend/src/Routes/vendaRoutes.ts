import express from 'express';
import { registrarVenda, listarVendas, excluirVenda } from '../controllers/vendaController';
import autenticarUsuario from '../middlewares/authMiddleware';
import autorizarCargo from '../middlewares/authRoleMiddleware';

const router = express.Router();

router.post('/registrar', autenticarUsuario, registrarVenda);
router.get('/listar', autenticarUsuario, autorizarCargo(['Gerente']), listarVendas);
router.delete('/excluir/:id', autenticarUsuario, autorizarCargo(['Gerente']), excluirVenda);

export default router;
