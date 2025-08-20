import Button from '../Button/Button';
import styles from './TabelaVendas.module.css';
import type { ItemVenda } from '../ModalDetalhesVenda/ModalDetalhesVenda';

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

type Props = {
  vendas: Venda[];
  onDetalhes: (venda: Venda) => void;
  onTogglePagamento: (venda: Venda) => void;
  onExcluir: (id: number) => void;
};

export default function TabelaVendas({ vendas, onDetalhes, onTogglePagamento, onExcluir }: Props) {
  return (
    <div className={styles.container}>
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
          {vendas.length === 0 ? (
            <tr>
              <td colSpan={7} className={styles.semVendas}>
                Nenhuma venda encontrada
              </td>
            </tr>
          ) : (
            vendas.map(venda => (
              <tr key={venda.id} className={styles.linha}>
                <td>{venda.nomeCliente}</td>
                <td>{venda.cpfCliente}</td>
                <td>{venda.usuarioNome}</td>
                <td>R$ {venda.total.toFixed(2)}</td>
                <td>{venda.pago ? 'Sim' : 'Não'}</td>
                <td>{venda.data}</td>
                <td className={styles.acoes}>
                  <Button color="blue" text="Detalhes" onClick={() => onDetalhes(venda)} />
                  <Button color="green" text={venda.pago ? 'Marcar Não Pago' : 'Marcar Pago'} onClick={() => onTogglePagamento(venda)} />
                  <Button color="red" text="Excluir" onClick={() => onExcluir(venda.id)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
