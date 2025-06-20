import express from 'express';
import { registrarVenda, listarVendas, excluirVenda, atualizarStatusPagamento } from '../controllers/vendaController';
import autenticarUsuario from '../middlewares/authMiddleware';
import autorizarCargo from '../middlewares/authRoleMiddleware';

const router = express.Router();

router.post('/registrar', autenticarUsuario, registrarVenda);
router.get('/listar', autenticarUsuario, autorizarCargo(['Gerente']), listarVendas);
router.delete('/excluir/:id', autenticarUsuario, autorizarCargo(['Gerente']), excluirVenda);
router.patch('/pagamento/:id', autenticarUsuario, autorizarCargo(['Gerente']), atualizarStatusPagamento);

export default router;
