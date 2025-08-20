import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import Header from '../../components/Header/Header';
import BackButton from '../../components/BackButton/BackButton';
import Title from '../../components/Title/Title';
import CardEstatistica from '../../components/CardEstatistica/CardEstatistica';
import { ListaProdutosMaisVendidos } from '../../components/ListaProdutosMaisVendidos/ListaProdutosMaisVendidos';

type Estatistica = {
  titulo: string;
  valor: number; 
  icone: string;
};

type ProdutoMaisVendido = {
  nome: string;
  quantidade: number;
};

type ProdutoBaixoEstoqueAPI = {
  id: number;
  nome: string;
  estoque: number;
};

type ProdutoMaisVendidoAPI = {
  produtoId: number;
  quantidadeVendida: number | null;
  produto: { nome: string } | null;
};

type DashboardResponse = {
  produtosBaixoEstoque: ProdutoBaixoEstoqueAPI[];
  vendasMes: number;
  totalArrecadado: number;
  produtosMaisVendidos: ProdutoMaisVendidoAPI[];
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [estatisticas, setEstatisticas] = useState<Estatistica[]>([]);
  const [produtosMaisVendidos, setProdutosMaisVendidos] = useState<ProdutoMaisVendido[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:5000/api/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) {
          throw new Error(`Falha ao buscar /api/dashboard (status ${response.status})`);
        }

        const data: DashboardResponse = await response.json();

        const estats: Estatistica[] = [
          { titulo: 'Total em vendas', valor: data.totalArrecadado ?? 0, icone: 'bxs-dollar-circle' },
          { titulo: 'Quantidade de vendas', valor: data.vendasMes ?? 0, icone: 'bxs-group' },
          { titulo: 'Produtos com estoque baixo', valor: data.produtosBaixoEstoque?.length ?? 0, icone: 'bxs-calendar-check' },
        ];
        setEstatisticas(estats);

        const produtos: ProdutoMaisVendido[] = (data.produtosMaisVendidos ?? []).map((p) => ({
          nome: p.produto?.nome ?? 'Produto desconhecido',
          quantidade: p.quantidadeVendida ?? 0,
        }));
        setProdutosMaisVendidos(produtos);
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard', error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <>
      <Header
        leftContent={<BackButton text="Voltar" onClick={() => navigate('/Dashboard')} />}
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
          </div>
        </div>
      </div>
    </>
  );
}
