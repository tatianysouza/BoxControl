import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header';
import BackButton from '../../components/BackButton/BackButton';
import Title from '../../components/Title/Title';
import Button from '../../components/Button/Button';
import ModalDetalhesVenda, { type ItemVenda } from '../../components/ModalDetalhesVenda/ModalDetalhesVenda';
import InputField from '../../components/Input/InputField';
import styles from './Vendas.module.css';

type ItemVendaBackend = {
  id: number;
  quantidade: number;
  precoUnitario: number;
  produto: { id: number; nome: string };
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

type Venda = {
  id: number;
  nomeCliente: string;
  cpfCliente: string;
  total: number;
  pago: boolean;
  data: string;
  usuarioNome: string;
  itens: ItemVenda[];
};

export default function Vendas() {
  const navigate = useNavigate();
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [modalVenda, setModalVenda] = useState<Venda | null>(null);
  const [busca, setBusca] = useState('');

  const fetchVendas = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get<VendaBackend[]>('http://localhost:5000/api/vendas/listar', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data: Venda[] = res.data.map(v => ({
        id: v.id,
        nomeCliente: v.nomeCliente,
        cpfCliente: v.cpfCliente,
        total: v.total,
        pago: v.pago,
        data: new Date(v.data).toLocaleString('pt-BR'),
        usuarioNome: v.usuario?.nome || 'Desconhecido',
        itens: v.itens.map(i => ({
          id: i.id,
          nome: i.produto?.nome || '',
          quantidade: i.quantidade,
          precoUnitario: i.precoUnitario,
        })),
      }));

      setVendas(data);
    } catch (error) {
      console.error('Erro ao buscar vendas', error);
      alert('Erro ao carregar vendas');
    }
  };

  useEffect(() => {
    fetchVendas();
  }, []);

  const togglePagamento = async (venda: Venda) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/vendas/pagamento/${venda.id}`,
        { pago: !venda.pago },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchVendas();
    } catch (error) {
      console.error('Erro ao atualizar pagamento', error);
      alert('Erro ao atualizar pagamento');
    }
  };

  const handleExcluir = async (id: number) => {
    if (!confirm('Deseja realmente excluir essa venda?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/vendas/excluir/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchVendas();
    } catch (error) {
      console.error('Erro ao excluir venda', error);
      alert('Erro ao excluir venda');
    }
  };

  const vendasFiltradas = vendas.filter(v =>
    v.nomeCliente.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <>
      <Header
        leftContent={<BackButton text="Voltar" onClick={() => navigate('/Dashboard')} />}
        centerContent={<Title titulo="Vendas" />}
      />

      <div className={styles.container}>
        <div className={styles.filtro}>
          <InputField
            label="Pesquisar por cliente"
            placeholder="Digite o nome do cliente"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            icon="bx-search"
          />
        </div>

        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>CPF</th>
              <th>Funcionário</th>
              <th>Total</th>
              <th>Pago</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vendasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.semVendas}>
                  Nenhuma venda encontrada
                </td>
              </tr>
            ) : (
              vendasFiltradas.map(venda => (
                <tr key={venda.id} className={styles.linha}>
                  <td>{venda.nomeCliente}</td>
                  <td>{venda.cpfCliente}</td>
                  <td>{venda.usuarioNome}</td>
                  <td>R$ {venda.total.toFixed(2)}</td>
                  <td className={venda.pago ? styles.pago : styles.naoPago}>
                    {venda.pago ? 'Sim' : 'Não'}
                  </td>
                  <td>{venda.data}</td>
                  <td className={styles.acoes}>
                    <Button color="var(--blue)" text="Detalhes" onClick={() => setModalVenda(venda)} />
                    <Button color="var(--green)" text={venda.pago ? 'Marcar Não Pago' : 'Marcar Pago'} onClick={() => togglePagamento(venda)} />
                    <Button color="var(--red)" text="Excluir" onClick={() => handleExcluir(venda.id)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalVenda && (
        <ModalDetalhesVenda
          vendaId={modalVenda.id}
          nomeCliente={modalVenda.nomeCliente}
          cpfCliente={modalVenda.cpfCliente}
          itens={modalVenda.itens}
          onClose={() => setModalVenda(null)}
        />
      )}
    </>
  );
}
