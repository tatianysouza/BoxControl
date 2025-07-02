import styles from './Button.module.css';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

const Button = ({ text, ...rest }: ButtonProps) => {
  return (
    <button className={styles.button} {...rest}>
      {text}
    </button>
  );
};

export default Button;
