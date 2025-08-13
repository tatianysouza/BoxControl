import Header from '../../components/Header/Header';
import OptionCard from '../../components/OptionCard/OptionCard';
import LogoutButton from '../../components/LogoutButton/LogoutButton';
import styles from './Escolha.module.css';
import { useNavigate } from 'react-router-dom';

const Escolha = () => {
  const navigate = useNavigate();

  const logout = () =>{
    localStorage.removeItem("token");
    navigate("/login");
  }
  const profile = () =>{
    navigate("/perfil");
  }
  return (
    <div>
        <Header
            leftContent={<img src="../../../public/images/Logos/BoxControlBanner.png" alt="Logo" style={{ height: '35px' }} />}
            centerContent={null}
            rightContent={<LogoutButton onClick={logout}/>}
        />

      <main className={styles.chooseContainer}>
        <h3>Escolha uma opção:</h3>
        <div className={styles.optionsGrid}>
          <OptionCard icon="bx-user-circle" label="Meu Perfil" onClick={profile} />
          <OptionCard icon="bx-wallet" label="Controle de Caixa" onClick={() => {navigate("/caixa")}} />
          <OptionCard icon="bx-shopping-bag" label="Minhas Vendas" onClick={() => {}} />
          <OptionCard icon="bx-box" label="Estoque" onClick={() => {navigate("/estoque")}} />
        </div>
      </main>
    </div>
  );
};

export default Escolha;
