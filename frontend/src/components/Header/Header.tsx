import styles from './Header.module.css';

interface HeaderProps {
  leftContent?: React.ReactNode;
  centerContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

const Header = ({ leftContent, centerContent, rightContent }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.left}>{leftContent}</div>
      <div className={styles.center}>{centerContent}</div>
      <div className={styles.right}>{rightContent}</div>
    </header>
  );
};

export default Header;
