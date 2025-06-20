import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const registrarVenda = async (req: any, res: any) => {
  const {
    itens,
    nome_cliente = 'Não informado',
    cpf_cliente = 'Não informado',
    pago = true
  } = req.body;

  const usuario_id = req.usuario?.id;

  if (!usuario_id || !itens || itens.length === 0) {
    return res.status(400).json({ erro: 'Usuário e itens são obrigatórios!' });
  }

  try {
    let total = 0;
    const precosProdutos: Record<number, number> = [];

    for (const item of itens) {
      const produto = await prisma.produto.findUnique({
        where: { codigoBarras: item.codigo_barras }
      });

      if (!produto) {
        return res.status(404).json({ erro: `Produto com código ${item.codigo_barras} não encontrado!` });
      }

      if (produto.estoque < item.quantidade) {
        return res.status(400).json({ erro: `Estoque insuficiente para o produto ${produto.nome}` });
      }

      const subtotal = produto.preco * item.quantidade;
      total += subtotal;
      item.produto_id = produto.id;
      precosProdutos[produto.id] = produto.preco;

      await prisma.produto.update({
        where: { id: produto.id },
        data: {
          estoque: produto.estoque - item.quantidade
        }
      });
    }

    if (total > 500 && cpf_cliente === 'Não informado') {
      return res.status(400).json({ erro: 'CPF do cliente é obrigatório para vendas acima de R$ 500!' });
    }

    const novaVenda = await prisma.venda.create({
      data: {
        usuarioId: usuario_id,
        total,
        nomeCliente: nome_cliente,
        cpfCliente: cpf_cliente,
        pago,
        itens: {
          create: itens.map((item: any) => ({
            produtoId: item.produto_id,
            quantidade: item.quantidade,
            precoUnitario: precosProdutos[item.produto_id]
          }))
        }
      }
    });

    res.status(201).json({ mensagem: 'Venda registrada com sucesso!', venda_id: novaVenda.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao registrar venda' });
  }
};

export const listarVendas = async (req: any, res: any) => {
  try {
    const vendas = await prisma.venda.findMany({
      orderBy: { data: 'desc' },
      include: {
        itens: {
          include: { produto: true }
        },
        usuario: {
          select: { nome: true }
        }
      }
    });

    res.json(vendas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar vendas' });
  }
};

export const excluirVenda = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const venda = await prisma.venda.findUnique({
      where: { id: Number(id) },
      include: {
        itens: true
      }
    });

    if (!venda) {
      return res.status(404).json({ erro: 'Venda não encontrada' });
    }

    for (const item of venda.itens) {
      await prisma.produto.update({
        where: { id: item.produtoId },
        data: {
          estoque: {
            increment: item.quantidade
          }
        }
      });
    }

    await prisma.itemVenda.deleteMany({
      where: { vendaId: Number(id) }
    });

    await prisma.venda.delete({
      where: { id: Number(id) }
    });

    res.json({ mensagem: 'Venda cancelada e estoque restaurado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao excluir a venda' });
  }
};

export const atualizarStatusPagamento = async (req: any, res: any) => {
  const { id } = req.params;
  const { pago } = req.body;

  if (typeof pago !== 'boolean') {
    return res.status(400).json({ erro: 'O campo "pago" deve ser true ou false.' });
  }

  try {
    const vendaAtualizada = await prisma.venda.update({
      where: { id: Number(id) },
      data: { pago }
    });

    res.json({ mensagem: 'Status de pagamento atualizado!', venda: vendaAtualizada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao atualizar status de pagamento' });
  }
};
