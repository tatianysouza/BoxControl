import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const dadosDashboard = async (req: any, res: any) => {
  try {
    const limiteEstoque = 5;

    // Produtos com estoque baixo
    const produtosBaixoEstoque = await prisma.produto.findMany({
      where: {
        estoque: {
          lte: limiteEstoque,
        },
      },
      select: {
        id: true,
        nome: true,
        estoque: true,
      },
    });

    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 23, 59, 59);

    // Quantidade de vendas no mês atual
    const vendasMes = await prisma.venda.count({
      where: {
        data: {
          gte: inicioMes,
          lte: fimMes,
        },
      },
    });

    // Total arrecadado no mês
    const totalArrecadado = await prisma.venda.aggregate({
      _sum: {
        total: true,
      },
      where: {
        data: {
          gte: inicioMes,
          lte: fimMes,
        },
      },
    });

    // Produtos mais vendidos no mês (top 5)
    const produtosMaisVendidosRaw = await prisma.itemVenda.groupBy({
      by: ['produtoId'],
      _sum: {
        quantidade: true,
      },
      where: {
        venda: {
          data: {
            gte: inicioMes,
            lte: fimMes,
          },
        },
      },
      orderBy: {
        _sum: {
          quantidade: 'desc',
        },
      },
      take: 5,
    });

    const produtosIds = produtosMaisVendidosRaw.map(item => item.produtoId);

    const produtos = await prisma.produto.findMany({
      where: { id: { in: produtosIds } },
    });

    const produtosMaisVendidos = produtosMaisVendidosRaw.map(item => {
      const produto = produtos.find(p => p.id === item.produtoId);
      return {
        produtoId: item.produtoId,
        quantidadeVendida: item._sum.quantidade,
        produto,
      };
    });

    res.json({
      produtosBaixoEstoque,
      vendasMes,
      totalArrecadado: totalArrecadado._sum.total || 0,
      produtosMaisVendidos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar dados do dashboard' });
  }
};

export const vendasPorFuncionario = async (req: any, res: any) => {
  try {
    const { usuarioId, ano, mes } = req.query;

    const hoje = new Date();
    const filtroAno = ano ? Number(ano) : hoje.getFullYear();
    const filtroMes = mes ? Number(mes) - 1 : hoje.getMonth();

    const inicioMes = new Date(filtroAno, filtroMes, 1);
    const fimMes = new Date(filtroAno, filtroMes + 1, 0, 23, 59, 59);

    const usuarioLogadoId = req.usuario.id;

    const filtro: any = {
      data: {
        gte: inicioMes,
        lte: fimMes,
      },
      usuarioId: usuarioId ? Number(usuarioId) : usuarioLogadoId,
    };

    const vendas = await prisma.venda.findMany({
      where: filtro,
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
      },
      orderBy: {
        data: 'desc',
      },
    });

    res.json(vendas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar vendas por funcionário' });
  }
};
