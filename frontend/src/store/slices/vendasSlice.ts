import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export type ItemVenda = {
  id: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
};

export type Venda = {
  id: number;
  nomeCliente: string;
  cpfCliente: string;
  total: number;
  pago: boolean;
  data: string;
  usuarioNome: string;
  itens: ItemVenda[];
};

type VendasState = {
  vendas: Venda[];
  loading: boolean;
  error: string | null;
};

const initialState: VendasState = {
  vendas: [],
  loading: false,
  error: null,
};

type ItemVendaBackend = {
  id: number;
  quantidade: number;
  precoUnitario: number;
  produto?: { id: number; nome: string };
};

type VendaBackend = {
  id: number;
  nomeCliente: string;
  cpfCliente: string;
  total: number;
  pago: boolean;
  data: string;
  usuario?: { nome: string };
  itens: ItemVendaBackend[];
};

export const fetchVendas = createAsyncThunk<Venda[]>('vendas/fetch', async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get<VendaBackend[]>('http://localhost:5000/api/vendas/listar', {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data.map((v: VendaBackend): Venda => ({
    id: v.id,
    nomeCliente: v.nomeCliente,
    cpfCliente: v.cpfCliente,
    total: v.total,
    pago: v.pago,
    data: new Date(v.data).toLocaleString('pt-BR'),
    usuarioNome: v.usuario?.nome || 'Desconhecido',
    itens: v.itens.map((i: ItemVendaBackend): ItemVenda => ({
      id: i.id,
      nome: i.produto?.nome || '',
      quantidade: i.quantidade,
      precoUnitario: i.precoUnitario,
    })),
  }));
});

export const togglePagamentoVenda = createAsyncThunk<void, Venda>(
  'vendas/togglePagamento',
  async (venda, { dispatch }) => {
    const token = localStorage.getItem('token');
    await axios.patch(
      `http://localhost:5000/api/vendas/pagamento/${venda.id}`,
      { pago: !venda.pago },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(fetchVendas());
  }
);

export const excluirVenda = createAsyncThunk<void, number>(
  'vendas/excluir',
  async (id, { dispatch }) => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/vendas/excluir/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(fetchVendas());
  }
);

const vendasSlice = createSlice({
  name: 'vendas',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchVendas.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendas.fulfilled, (state, action) => {
        state.loading = false;
        state.vendas = action.payload;
      })
      .addCase(fetchVendas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar vendas';
      });
  },
});

export default vendasSlice.reducer;
