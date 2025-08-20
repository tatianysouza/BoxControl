import Button from '../Button/Button';
import styles from './ModalDetalhesVenda.module.css';

export type ItemVenda = {
  id: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
};

type Props = {
  vendaId: number;
  nomeCliente: string;
  cpfCliente: string;
  itens: ItemVenda[];
  onClose: () => void;
};

export default function ModalDetalhesVenda({ vendaId, nomeCliente, cpfCliente, itens, onClose }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Detalhes da Venda #{vendaId}</h2>
        <p><strong>Cliente:</strong> {nomeCliente}</p>
        <p><strong>CPF:</strong> {cpfCliente}</p>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Preço</th>
            </tr>
          </thead>
          <tbody>
            {itens.map(item => (
              <tr key={item.id}>
                <td>{item.nome}</td>
                <td>{item.quantidade}</td>
                <td>R$ {item.precoUnitario.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.actions}>
          <Button color="gray" text="Fechar" onClick={onClose} />
        </div>
      </div>
    </div>
  );
}
