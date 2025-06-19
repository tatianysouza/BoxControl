import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const cadastrarProduto = async (req: any, res: any) => {
  const { nome, codigo_barras, preco, estoque, categoria, fornecedor } = req.body;

  if (!nome || !codigo_barras || !preco || !estoque) {
    return res.status(400).json({ erro: "Preencha todos os campos obrigatórios!" });
  }

  try {
    const novoProduto = await prisma.produto.create({
      data: {
        nome,
        codigoBarras: codigo_barras,
        preco,
        estoque,
        categoria,
        fornecedor
      },
    });

    res.status(201).json(novoProduto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao cadastrar produto" });
  }
};

export const listarProdutos = async (req: any, res: any) => {
  try {
    const produtos = await prisma.produto.findMany();
    res.json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar produtos" });
  }
};

export const buscarProdutoPorCodigo = async (req: any, res: any) => {
  const { codigo_barras } = req.params;

  try {
    const produto = await prisma.produto.findUnique({
      where: { codigoBarras: codigo_barras }
    });

    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado!" });
    }

    res.json(produto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar produto" });
  }
};

export const editarProduto = async (req: any, res: any) => {
  const { id } = req.params;
  const { nome, codigo_barras, preco, estoque, categoria, fornecedor } = req.body;

  try {
    const produtoExistente = await prisma.produto.findUnique({ where: { id: Number(id) } });

    if (!produtoExistente) {
      return res.status(404).json({ erro: "Produto não encontrado!" });
    }

    const produtoAtualizado = await prisma.produto.update({
      where: { id: Number(id) },
      data: {
        nome,
        codigoBarras: codigo_barras,
        preco,
        estoque,
        categoria,
        fornecedor
      }
    });

    res.json({ mensagem: "Produto atualizado com sucesso!", produto: produtoAtualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atualizar produto" });
  }
};

export const excluirProduto = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const produtoExistente = await prisma.produto.findUnique({ where: { id: Number(id) } });

    if (!produtoExistente) {
      return res.status(404).json({ erro: "Produto não encontrado!" });
    }

    await prisma.produto.delete({ where: { id: Number(id) } });

    res.json({ mensagem: "Produto excluído com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao excluir produto" });
  }
};
