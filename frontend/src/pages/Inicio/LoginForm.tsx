import InputField from '../../components/Input/InputField';
import Button from '../../components/Button/Button';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2>Login no BoxControl</h2>

        <InputField
          label="Email"
          type="email"
          placeholder="Digite seu email"
          icon="bx-envelope"
          required
        />

        <InputField
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          icon="bx-lock-alt"
          required
        />

        <Button text="Entrar" type="submit" />
      </form>
    </div>
  );
};

export default LoginForm;
