import styles from './BadgeStatus.module.css';

interface BadgeStatusProps {
  status: string;
}

export const BadgeStatus = ({ status }: BadgeStatusProps) => {
  const statusClass =
    status.toLowerCase() === 'pago' ? styles.completado : styles.pendente;

  return (
    <span className={`${styles.badge} ${statusClass}`}>
      {status}
    </span>
  );
};
