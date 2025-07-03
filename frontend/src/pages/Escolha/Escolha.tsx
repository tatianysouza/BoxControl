import Header from '../../components/Header/Header';
import OptionCard from '../../components/OptionCard/OptionCard';
import LogoutButton from '../../components/LogoutButton/LogoutButton';
import styles from './Escolha.module.css';


const Escolha = () => {
  return (
    <div>
        <Header
            leftContent={<img src="../../../public/images/Logos/BoxControlBanner.png" alt="Logo" style={{ height: '35px' }} />}
            centerContent={null}
            rightContent={<LogoutButton />}
        />

      <main className={styles.chooseContainer}>
        <h3>Escolha uma opção:</h3>
        <div className={styles.optionsGrid}>
          <OptionCard icon="bx-user-circle" label="Meu Perfil" onClick={() => {}} />
          <OptionCard icon="bx-wallet" label="Controle de Caixa" onClick={() => {}} />
          <OptionCard icon="bx-shopping-bag" label="Minhas Vendas" onClick={() => {}} />
        </div>
      </main>
    </div>
  );
};

export default Escolha;
