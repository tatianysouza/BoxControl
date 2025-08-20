import styles from './TabelaVendasRecentes.module.css';
import { BadgeStatus } from '../BadgeStatus/BadgeStatus';

interface Venda {
  cliente: string;
  data: string;
  status: string;
}

interface TabelaVendasRecentesProps {
  vendas: Venda[];
}

export const TabelaVendasRecentes = ({ vendas }: TabelaVendasRecentesProps) => (
  <div className={styles.tableWrapper}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Data da compra</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {vendas.map((venda, index) => (
          <tr key={index}>
            <td>{venda.cliente}</td>
            <td>{venda.data}</td>
            <td><BadgeStatus status={venda.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
