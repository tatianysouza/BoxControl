import Header from '../../components/Header/Header';
import OptionCard from '../../components/OptionCard/OptionCard';
import LogoutButton from '../../components/LogoutButton/LogoutButton';
import styles from './Escolha.module.css';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

interface TokenPayload {
  id: string;
  nome: string;
  cargo: string;
  iat: number;
  exp: number;
}

const Escolha = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const profile = () => {
    navigate("/perfil");
  }

  const token = localStorage.getItem("token");
  let cargo: string | null = null;

  if (token) {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      cargo = decoded.cargo;
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
    }
  }

  const isGerente = cargo === "Gerente";

  return (
    <div>
      <Header
        leftContent={<img src="../../../public/images/Logos/BoxControlBanner.png" alt="Logo" style={{ height: '35px' }} />}
        centerContent={null}
        rightContent={<LogoutButton onClick={logout} />}
      />

      <main className={styles.chooseContainer}>
        <h3>Escolha uma opção:</h3>
        <div className={styles.optionsGrid}>
          <OptionCard icon="bx-user-circle" label="Meu Perfil" onClick={profile} />
          <OptionCard icon="bx-wallet" label="Controle de Caixa" onClick={() => navigate("/caixa")} />
          <OptionCard icon="bx-shopping-bag" label="Minhas Vendas" onClick={() => navigate("/minhas-vendas")} />
          {isGerente && (
            <>
              <OptionCard icon="bx-box" label="Estoque" onClick={() => navigate("/estoque")} />
              <OptionCard icon="bx-bar-chart-alt-2" label="Painel / Dashboard" onClick={() => navigate("/dashboard")} />
              <OptionCard icon="bx-shopping-bag" label="Vendas gerais" onClick={() => navigate("/vendas")} />
              <OptionCard icon="bx-user" label="Funcionários" onClick={() => navigate("/funcionarios")} />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Escolha;
