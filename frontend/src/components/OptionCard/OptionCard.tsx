import styles from './OptionCard.module.css';

interface OptionCardProps {
  icon: string;
  label: string;
  onClick?: () => void;
}

const OptionCard = ({ icon, label, onClick }: OptionCardProps) => {
  return (
    <button className={styles.optionCard} onClick={onClick} type="button">
      <i className={`bx ${icon}`}></i>
      <span>{label}</span>
    </button>
  );
};

export default OptionCard;
