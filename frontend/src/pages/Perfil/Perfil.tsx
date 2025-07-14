import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";
import BackButton from "../../components/BackButton/BackButton";
import Button from "../../components/Button/Button";
import Header from "../../components/Header/Header";
import InputField from "../../components/Input/InputField";
import Title from "../../components/Title/Title";
import styles from "./Perfil.module.css"
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface TokenPayload {
  id: string;
  cargo: string;
  iat: number;
  exp: number;
}

interface Usuario {
  nome: string;
  email: string;
  cargo: string;
  status: string;
  dataAdmissao: string;
}

function formatarDataInput(data: string | Date | undefined): string {
  if (!data) return "";

  const d = new Date(data);
  if (isNaN(d.getTime())) return "";

  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export function Perfil(){
    const navigate = useNavigate();

    const [userData, setUserData] = useState<Usuario>({
        nome: "",
        email: "",
        cargo: "",
        status: "Ativo",
        dataAdmissao: "",
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Você precisa estar logado para acessar esta página.");
            window.location.href = "/";
            return;
        }
        axios.get("http://localhost:5000/api/usuarios/perfil", {
            headers:{
                Authorization: `Bearer ${token}`,
            },
        })
        .then(res =>{
            console.log("Dados recebidos", res.data);
            const data = res.data;
            setUserData({
                nome: data.nome || "",
                email: data.email || "",
                cargo: data.cargo || "",
                status: data.status || "",
                dataAdmissao: formatarDataInput(data.dataAdmissao),
            });
        })
        .catch(err =>{
            console.error("Erro ao buscar", err);
            alert("Erro ao carregar dados");
        });
    }, []);

    const handleChange = (field: keyof Usuario, value: string) => {
        setUserData(prev => ({ ...prev, [field]:value}));
    };

    const handleSubmit = async (e: FormEvent) =>{
        e.preventDefault();
        const token = localStorage.getItem("token");
        if(!token) return;

        const decoded = jwtDecode<TokenPayload>(token);
        const userId = decoded.id;

        try{
            await axios.put(`http://localhost:5000/api/usuarios/editar/${userId}`, userData, {
                headers:{
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Dados atulaizados")
        } catch(err){
            console.error("Erro ao editar", err);
            alert("Erro ao editar os dados");
        }
    };

    return(
        <>
            <div className={styles.content} >
                 <Header leftContent={<BackButton text="Voltar" onClick={() => {navigate("/dashboard")}}/>}
                 centerContent={<Title titulo="Meu Perfil"/>}
                 rightContent={null}/>
                 <div className={styles.section}>
                    <form className={styles.formProfile} onSubmit={handleSubmit}> 
                        <InputField label="Nome Completo" placeholder="Seu nome" value={userData.nome} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("nome", e.target.value)}/>
                        <InputField label="Email" placeholder="seu@email.com" value={userData.email} onChange={(e: ChangeEvent<HTMLInputElement>) => {handleChange("email", e.target.value)}}/>
                        <InputField label="Cargo" placeholder="Seu cargo" value={userData.cargo} onChange={(e: ChangeEvent<HTMLInputElement>) => {handleChange("cargo", e.target.value)}}/>
                        <div className={styles.select}>
                            <label>Status</label>
                            <select value={userData.status} onChange={(e: ChangeEvent<HTMLSelectElement>) => {handleChange("status", e.target.value)}}>
                                <option value="Ativo">Ativo</option>
                                <option value="Inativo">Inativo</option>
                            </select>
                        </div>
                        <InputField label="Data de Admissão" type="date" value={userData.dataAdmissao} onChange={(e: ChangeEvent<HTMLInputElement>) => {handleChange("dataAdmissao", e.target.value)}}/>
                        <Button color="" text="Salvar Alterações"/>
                    </form>
                 </div>
            </div>
        </>
    );
}