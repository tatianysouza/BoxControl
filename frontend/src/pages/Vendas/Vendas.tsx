import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../../components/Header/Header';
import BackButton from '../../components/BackButton/BackButton';
import Title from '../../components/Title/Title';
import Button from '../../components/Button/Button';
import ModalDetalhesVenda from '../../components/ModalDetalhesVenda/ModalDetalhesVenda';
import InputField from '../../components/Input/InputField';
import styles from './Vendas.module.css';
import type { RootState } from '../../store/store';
import type { AppDispatch } from '../../store/store';
import { fetchVendas, togglePagamentoVenda, excluirVenda } from '../../store/slices/vendasSlice';
import type { Venda } from '../../store/slices/vendasSlice';

export default function Vendas() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { vendas, loading, error } = useSelector((state: RootState) => state.vendas);

  const [modalVenda, setModalVenda] = useState<Venda | null>(null);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    dispatch(fetchVendas());
  }, [dispatch]);

  const handleTogglePagamento = (venda: Venda) => {
    dispatch(togglePagamentoVenda(venda));
  };

  const handleExcluir = (id: number) => {
    if (!confirm('Deseja realmente excluir essa venda?')) return;
    dispatch(excluirVenda(id));
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

        {loading ? (
          <p>Carregando vendas...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
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
                      <Button color="var(--green)" text={venda.pago ? 'Marcar Não Pago' : 'Marcar Pago'} onClick={() => handleTogglePagamento(venda)} />
                      <Button color="var(--red)" text="Excluir" onClick={() => handleExcluir(venda.id)} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
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
