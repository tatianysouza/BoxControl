import styles from './CardEstatistica.module.css';

interface CardEstatisticaProps {
  corQuadrado: string;
  icone: string;
  titulo: string;
  valor: string;
}

export default function CardEstatistica({ corQuadrado, icone, titulo, valor }: CardEstatisticaProps) {
  return (
    <li className={styles.card}>
      <div className={styles.iconBox} style={{ backgroundColor: corQuadrado }}>
        <i className={`bx ${icone}`}></i>
      </div>
      <div className={styles.text}>
        <h3>{valor}</h3>
        <p>{titulo}</p>
      </div>
    </li>
  );
}
