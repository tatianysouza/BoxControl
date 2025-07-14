import InputField from '../../components/Input/InputField';
import Button from '../../components/Button/Button';
import styles from './LoginForm.module.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try{
      const response = await axios.post("http://localhost:5000/api/usuarios/login", {email, senha});
      const token = response.data.token;

      if(token){
        localStorage.setItem("token", token);
        alert("Logado com sucesso!");
        navigate("/dashboard");
      }
    } catch(error: unknown){
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.erro || "Erro ao fazer login");
        console.error("Axios error:", error);
      } else {
        console.error("Erro inesperado:", error);
      }
    }
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <InputField
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          icon="bx-lock-alt"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <Button text="Entrar" type="submit" color='' onClick={handleSubmit}/>
      </form>
    </div>
  );
};

export default LoginForm;
