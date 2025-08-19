import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const vendasEmMemoria: Record<number, ProdutoVenda[]> = {};

interface ProdutoVenda {
  produtoId: number;
  nome: string;
  preco: number;
  quantidade: number;
  codigoBarras: string;
}

export function iniciarSocket(io: Server) {
  io.on('connection', (socket) => {
    console.log('🟢 Cliente conectado ao socket de vendas');

    socket.on('disconnect', () => {
      console.log('🔴 Cliente desconectado do socket de vendas');
    });

    socket.on('adicionar_produto', async (data: { usuarioId: number; codigo_barras: string }) => {
      const { usuarioId, codigo_barras } = data;

      if (!usuarioId || !codigo_barras?.trim()) {
        socket.emit('erro_produto', { mensagem: 'Dados inválidos para adicionar produto!' });
        return;
      }

      console.log(`📦 Usuário ${usuarioId} adicionando produto: ${codigo_barras}`);

      try {
        const produto = await prisma.produto.findUnique({ where: { codigoBarras: codigo_barras } });
        if (!produto) {
          console.warn('⚠️ Produto não encontrado:', codigo_barras);
          socket.emit('erro_produto', { mensagem: 'Produto não encontrado!' });
          return;
        }

        if (!vendasEmMemoria[usuarioId]) vendasEmMemoria[usuarioId] = [];

        const itemExistente = vendasEmMemoria[usuarioId].find((i) => i.produtoId === produto.id);
        if (itemExistente) itemExistente.quantidade += 1;
        else vendasEmMemoria[usuarioId].push({
          produtoId: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          quantidade: 1,
          codigoBarras: produto.codigoBarras,
        });

        const produtosFormatados = vendasEmMemoria[usuarioId].map((p) => ({
          id: p.produtoId,
          name: p.nome,
          price: p.preco,
          quantidade: p.quantidade,
          codigoBarras: p.codigoBarras,
        }));

        console.log('✅ Emitido produto_atualizado para todos', produtosFormatados);
        io.emit('produto_atualizado', produtosFormatados);
      } catch (error: any) {
        console.error('❌ Erro ao adicionar produto:', error.message || error);
        socket.emit('erro_produto', { mensagem: 'Erro interno ao buscar produto' });
      }
    });

    socket.on('finalizar_venda', async (data: {
      nome_cliente: string;
      cpf_cliente: string;
      pago: boolean;
      itens: { codigo_barras: string; quantidade: number }[];
      usuarioId: number;
    }) => {
      const { nome_cliente, cpf_cliente, pago, itens } = data;

      if (!itens?.length) {
        socket.emit('erro_finalizar', { mensagem: 'Dados inválidos para finalizar venda!' });
        return;
      }

      try {
        const itensFormatados = await Promise.all(itens.map(async (item) => {
          const produto = await prisma.produto.findUnique({ where: { codigoBarras: item.codigo_barras } });
          if (!produto) throw new Error(`Produto não encontrado: ${item.codigo_barras}`);
          return { produtoId: produto.id, quantidade: item.quantidade, precoUnitario: produto.preco };
        }));

        const total = itensFormatados.reduce((acc, i) => acc + i.quantidade * i.precoUnitario, 0);

        const venda = await prisma.venda.create({
          data: {
            usuarioId: data.usuarioId,
            nomeCliente: nome_cliente,
            cpfCliente: cpf_cliente,
            pago,
            total,
            itens: { create: itensFormatados },
          },
        });

        console.log('🧾 Venda registrada com sucesso:', venda.id);

        for (const userId in vendasEmMemoria) {
          vendasEmMemoria[userId] = [];
        }

        io.emit('venda_finalizada', { vendaId: venda.id });

      } catch (error: any) {
        console.error('❌ Erro ao finalizar venda:', error.message || error);
        socket.emit('erro_finalizar', { mensagem: 'Erro ao finalizar venda!' });
      }
    });
  });
}
