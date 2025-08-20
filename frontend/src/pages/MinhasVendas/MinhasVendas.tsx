import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
import BackButton from '../../components/BackButton/BackButton';
import Title from '../../components/Title/Title';
import { TabelaVendasRecentes } from '../../components/TabelaVendasRecentes/TabelaVendasRecentes';

interface VendaItem {
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
  produto: {
    id: number;
    nome: string;
  };
}

interface VendaRecenteAPI {
  id: number;
  usuarioId: number;
  total: number;
  nomeCliente: string;
  cpfCliente: string;
  pago: boolean;
  data: string;
  itens: VendaItem[];
}

interface VendaRecente {
  cliente: string;
  data: string;
  status: string;
  total: number;
}

export default function MinhasVendas() {
  const navigate = useNavigate();
  const [vendas, setVendas] = useState<VendaRecente[]>([]);

  useEffect(() => {
    const fetchMinhasVendas = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Usuário não autenticado');

        const response = await axios.get<VendaRecenteAPI[]>(
          'http://localhost:5000/api/dashboard/minhas-vendas',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const vendasFormatadas: VendaRecente[] = response.data.map((v) => ({
          cliente: v.nomeCliente || 'Cliente desconhecido',
          data: new Date(v.data).toLocaleDateString('pt-BR'),
          status: v.pago ? 'Pago' : 'Pendente',
          total: v.total,
        }));

        setVendas(vendasFormatadas);
      } catch (error) {
        console.error('Erro ao buscar minhas vendas', error);
      }
    };

    fetchMinhasVendas();
  }, []);

  return (
    <>
      <Header
        leftContent={<BackButton text="Voltar" onClick={() => navigate('/Dashboard')} />}
        centerContent={<Title titulo="Minhas Vendas" />}
        rightContent={null}
      />

      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        <TabelaVendasRecentes vendas={vendas} />
      </div>
    </>
  );
}
