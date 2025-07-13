import styles from './InputField.module.css';
import type { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: string;
}

const InputField = ({ label, icon, ...rest }: InputFieldProps) => {
  return (
    <div className={styles.inputGroup}>
      <label>{label}</label>
      <div className={styles.inputIcon}>
        <i className={`bx ${icon}`}></i>
        <input {...rest} />
      </div>
    </div>
  );
};

export default InputField;
