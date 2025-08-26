import express from "express";
import { cadastrarProduto, listarProdutos, buscarProdutoPorCodigo, editarProduto, excluirProduto } from "../controllers/produtoController";
import autenticarUsuario from "../middlewares/authMiddleware";
import autorizarCargo from "../middlewares/authRoleMiddleware";

const router = express.Router();

router.post("/cadastrar", autenticarUsuario, autorizarCargo(["Gerente"]), cadastrarProduto);
router.get("/listar", autenticarUsuario, autorizarCargo(["Gerente"]), listarProdutos);
router.get("/:codigo_barras", autenticarUsuario, buscarProdutoPorCodigo);
router.put("/editar/:id", autenticarUsuario, autorizarCargo(["Gerente"]), editarProduto);
router.delete("/excluir/:id", autenticarUsuario, autorizarCargo(["Gerente"]), excluirProduto);

export default router;
