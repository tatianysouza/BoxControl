import styles from './BackButton.module.css';
import type { ButtonHTMLAttributes } from 'react';
import { FaArrowLeft } from "react-icons/fa";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

const BackButton = ({ text, ...rest }: ButtonProps) => {
  return (
    <button className={styles.button} {...rest}>
        <i className={styles.icon}>
            <FaArrowLeft/>
        </i>
        {text}
    </button>
  );
};

export default BackButton;
