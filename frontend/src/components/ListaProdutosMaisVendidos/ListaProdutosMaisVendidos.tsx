import styles from './ListaProdutosMaisVendidos.module.css';

interface Produto {
  nome: string;
  quantidade: number;
}

interface ListaProdutosMaisVendidosProps {
  produtos: Produto[];
}

export const ListaProdutosMaisVendidos = ({ produtos }: ListaProdutosMaisVendidosProps) => (
  <div className={styles.card}>
    <div className={styles.title}>Produtos Mais Vendidos</div>
    <ul className={styles.list}>
      {produtos.map((produto, index) => (
        <li key={index} className={styles.item}>
          {produto.nome} - {produto.quantidade} unidades
        </li>
      ))}
    </ul>
  </div>
);
