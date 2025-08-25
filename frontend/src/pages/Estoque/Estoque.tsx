import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";
import Header from "../../components/Header/Header";
import Table from "../../components/TabelaProdutos/TabelaProdutos";
import Title from "../../components/Title/Title";
import Button from "../../components/Button/Button";
import { useState } from "react";
import axios from "axios";
import InputField from "../../components/Input/InputField";
import styles from "./../../components/TabelaProdutos/TabelaProdutos.module.css"

function Estoque(){
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nome: "",
        preco: "",
        estoque: "",
        codigo_barras: "",
        categoria: "",
        fornecedor: "",
    });

    const [loading, setLoading] = useState(false);
    const [verModal, setVerModal] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:5000/api/produtos/cadastrar",
                {
                    nome: form.nome,
                    preco: Number(form.preco),
                    estoque: Number(form.estoque),
                    codigo_barras: form.codigo_barras,
                    categoria: form.categoria,
                    fornecedor: form.fornecedor
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Produto adicionado com sucesso!");
            setForm({ nome: "", preco: "", estoque: "", codigo_barras: "", categoria: "", fornecedor: "" });
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Erro ao cadastrar");
        } finally {
            setLoading(false);
        }
    };
    return(
        <>
            <Header leftContent={<BackButton text="Voltar" onClick={() => {navigate("/dashboard")}}/>}
                 centerContent={<Title titulo="Estoque"/>}
                 rightContent={<Button text="Adicionar" style={{ width: '100px' }} color={""} onClick={() => setVerModal(true)} />}/>
            {verModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2 className="text-xl font-bold mb-4">Adicionar Produto</h2>

                        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                            <div>
                                <InputField label="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="border rouded p-2" required />
                            </div>
                            <div>
                                <InputField label="Preço" step="0.01" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} className="border rounded p-2" required />
                            </div>
                            <div>
                                <InputField label="Estoque" value={form.estoque} onChange={(e) => setForm({ ...form, estoque: e.target.value })} className="border rounded p-2" required />
                            </div>
                            <div>
                                <InputField label="Código de Barras" value={form.codigo_barras} onChange={(e) => setForm({ ...form, codigo_barras: e.target.value })} className="border rounded p-2" required />
                            </div>
                            <div>
                                <InputField label="Categoria" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className="border rounded p-2" required />
                            </div>
                            <div>
                                <InputField label="Fornecedor" value={form.fornecedor} onChange={(e) => setForm({ ...form, fornecedor: e.target.value })} className="border rounded p-2" required />
                            </div>
                            <Button type="submit" disabled={loading} text="Adicionar" color="" />
                            <Button text="Cancelar" color="grey" onClick={() => setVerModal(false)}/>
                        </form>
                    </div>
                </div>
            )}
            <Table buscaAPI={true}/>
        </>
    );
}

export default Estoque;