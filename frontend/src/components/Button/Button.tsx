import styles from './Button.module.css';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  color: string;
}

const Button = ({ text, color, ...rest }: ButtonProps) => {
  return (
    <button className={styles.button} style={{ backgroundColor: color }} {...rest}>
      {text}
    </button>
  );
};

export default Button;
