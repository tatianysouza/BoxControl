import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";
import Header from "../../components/Header/Header";
import Title from "../../components/Title/Title";
import { useEffect, useState } from "react";
import axios from "axios";
import UserTable from "../../components/UserTable/UserTable";

interface Funcionario {
    id: number;
    nome: string;
    email: string;
    cargo: string;
    status: boolean;
    dataAdmissao: string;
}

const Funcionarios = () => {

    const navigate = useNavigate();
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFuncionarios = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Usuário não autenticado');

                const response = await axios.get<Funcionario[]>(
                    "http://localhost:5000/api/usuarios/listar",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setFuncionarios(response.data);
            } catch (error) {
                console.error('Erro ao buscar funcionarios', error);
            }
            setLoading(false);
        };
        fetchFuncionarios();
    }, []);

    const editStatus = async (id: number, novoStatus: boolean) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Usuário não autenticado');

            await axios.patch(
                `http://localhost:5000/api/usuarios/status/${id}`,
                { status: novoStatus },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setFuncionarios((prev) =>
                prev.map((f) =>
                    f.id === id ? { ...f, status: novoStatus } : f
                )
            );

            alert("Status atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar status", error);
            alert("Erro ao atualizar status do funcionário");
        }
    };

    return (
        <>
            <Header
                leftContent={<BackButton text="Voltar" onClick={() => navigate('/Dashboard')} />}
                centerContent={<Title titulo="Funcionários" />}
                rightContent={null}
            />
            <div className="p-4">
                {loading ? (
                    <p>Carregando funcionários...</p>
                ) : (
                    <UserTable funcionarios={funcionarios} onEditarStatus={editStatus} />
                )
                }
            </div>
        </>
    )
}

export default Funcionarios;