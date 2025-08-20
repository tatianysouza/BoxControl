import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import Header from '../../components/Header/Header';
import BackButton from '../../components/BackButton/BackButton';
import Title from '../../components/Title/Title';
import CardEstatistica from '../../components/CardEstatistica/CardEstatistica';
import { TabelaVendasRecentes } from '../../components/TabelaVendasRecentes/TabelaVendasRecentes';
import { ListaProdutosMaisVendidos } from '../../components/ListaProdutosMaisVendidos/ListaProdutosMaisVendidos';

export default function Dashboard() {
  const navigate = useNavigate();

  const estatisticas = [
    { titulo: 'Total em vendas', valor: 'R$2543,00', icone: 'bxs-dollar-circle' },
    { titulo: 'Quantidade de vendas', valor: '2834', icone: 'bxs-group' },
    { titulo: 'Produtos com estoque baixo', valor: '5', icone: 'bxs-calendar-check' },
  ];

  const vendasRecentes = [
    { cliente: 'Micheal John', data: '18-10-2021', status: 'Completado' },
    { cliente: 'Ryan Doe', data: '01-06-2022', status: 'Pendente' },
    { cliente: 'Selma', data: '01-02-2023', status: 'Completado' },
  ];

  const produtosMaisVendidos = [
    { nome: 'Café', quantidade: 150 },
    { nome: 'Arroz', quantidade: 100 },
    { nome: 'Feijão', quantidade: 80 },
    { nome: 'Macarrão', quantidade: 60 },
  ];

  return (
    <>
      <Header
        leftContent={<BackButton text="Voltar" onClick={() => navigate("/Dashboard")} />}
        centerContent={<Title titulo="Painel de Controle" />}
        rightContent={null}
      />

      <div className={styles.page}>
        <div className={styles.cardGroup}>
          {estatisticas.map((item, index) => (
            <CardEstatistica
              key={index}
              corQuadrado="#3C91E6"
              icone={item.icone}
              titulo={item.titulo}
              valor={item.valor}
            />
          ))}
        </div>

        <div className={styles.container}>
          <div className={styles.productList}>
            <ListaProdutosMaisVendidos produtos={produtosMaisVendidos} />
            <TabelaVendasRecentes vendas={vendasRecentes} />
          </div>
        </div>
      </div>
    </>
  );
}
