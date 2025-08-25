import InputField from "../Input/InputField";
import styles from "../../pages/Inicio/LoginForm.module.css"
import { useState } from "react";
import axios from "axios";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
//import { useNavigate } from "react-router-dom";

const CriarForm = () =>{

    const navigate = useNavigate();

    const [form, setForm] = useState({
        nome: "",
        email: "",
        senha: "",
        cargo: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(
                "http://localhost:5000/api/usuarios/cadastrar",
                {
                    nome: form.nome,
                    email: form.email,
                    senha: form.senha,
                    cargo: form.cargo
                }
            );
            alert("Usuário adicionado com sucesso!");
            setForm({ nome: "", email: "", senha: "", cargo: ""});
            navigate("/login");
        } catch (error) {
            console.error(error);
            alert("Erro ao cadastrar");
        }
    };

    return(
        <form onSubmit={handleSubmit} className={styles.loginContainer}>
            <InputField label="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required/>
            <InputField label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required/>
            <InputField type="password" label="Senha" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} required/>
            <InputField label="Cargo" value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} required/>
            <Button type="submit" text="Criar conta" color=""/>
        </form>
    );
}

export default CriarForm;