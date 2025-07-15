import styles from './LogoutButton.module.css';

interface LogoutButtonProps {
  onClick?: () => void;
}

const LogoutButton = ({ onClick }: LogoutButtonProps) => {
  return (
    <button className={styles.logoutBtn} onClick={onClick}>
      <i className="bx bx-power-off"></i> Sair
    </button>
  );
};

export default LogoutButton;
