import { useEffect, useState } from "react";
import styles from "./TabelaProdutos.module.css"
import axios from "axios";
import Button from "../Button/Button";
import InputField from "../Input/InputField";

interface Produto{
    id: number
    nome: string;
    codigoBarras: string;
    estoque: number;
    categoria: string;
    fornecedor: string;
    preco: number;
}

interface TabelaProps{
    produtos?: Produto[];
    buscaAPI: boolean;
}
export default function Table({produtos: propsProdutos, buscaAPI = false}: TabelaProps){
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(buscaAPI);
    const [produtoEscolhido, setProdutoEscolhido] = useState<Produto | null>(null);
    const [verModal, setVerModal] = useState(false);

    useEffect(() =>{
        if(!buscaAPI){
            setProdutos(propsProdutos || []);
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) throw new Error("Usuário não autenticado");

        setLoading(true);
        axios
            .get("http://localhost:5000/api/produtos/listar", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                const adaptados: Produto[] = res.data.map((p: any) => ({
                    id: p.id,
                    nome: p.nome,
                    codigoBarras: p.codigoBarras,
                    estoque: p.estoque,
                    categoria: p.categoria,
                    fornecedor: p.fornecedor,
                    preco: p.preco,
                }));
                setProdutos(adaptados);
            })
            .catch((err) => {
                console.error("Erro ao carregar produtos", err);
            })
            .finally(()=> setLoading(false));
    }, [propsProdutos, buscaAPI]);

    const abrirModal = (produto: Produto) => {
        setProdutoEscolhido(produto);
        setVerModal(true);
    };

    const fecharModal = () => {
        setProdutoEscolhido(null);
        setVerModal(false);
    }

    const excluirProduto = async (id: number) => {
        if (!window.confirm("Deseja realmente excluir esse produto do estoque?")) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Usuário não autenticado");

            await axios.delete(`http://localhost:5000/api/produtos/excluir/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setProdutos((prev) => prev.filter((p) => p.id !== id));
            alert("Produto excluído com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir produto: ", error);
            alert("Erro ao exluir o produto, tente novamente!");
        }
    };

    const editar = async () => {
        if (!produtoEscolhido) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Usuário não autenticado");

            await axios.put(`http://localhost:5000/api/produtos/editar/${produtoEscolhido.id}`,
                {
                    nome: produtoEscolhido.nome,
                    estoque: produtoEscolhido.estoque,
                    categoria: produtoEscolhido.categoria,
                    fornecedor: produtoEscolhido.fornecedor,
                    codigoBarras: (produtoEscolhido as any).codigoBarras,
                    preco: (produtoEscolhido as any).preco,            
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setProdutos((prev) =>
                prev.map((p) => (p.id === produtoEscolhido.id ? produtoEscolhido : p))
            );
            alert("Produto atualizado com sucesso!");
            fecharModal();
        } catch (error) {
            console.error("Erro ao editar produto: ", error);
            alert("Erro ao atualizar o produto.");
        }
    };

    if(loading){
        return <p>Carregando ...</p>
    }
    return(
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead className={styles.cabecalho}>
                    <tr>
                        <th>Nome</th>
                        <th>Coódigo de Barras</th>
                        <th>Categoria</th>
                        <th>Estoque</th>
                        <th>Fornecedor</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {produtos.map((p) => (
                        <tr key={p.id}>
                            <td>{p.nome}</td>
                            <td>{p.codigoBarras}</td>
                            <td>{p.categoria}</td>
                            <td>{p.estoque}</td>
                            <td>{p.fornecedor}</td>
                            <td>
                                <div className={styles.actions}>
                                    <Button text={"Editar"} color="#ffa719ff" onClick={() => abrirModal(p)}/> 
                                    <Button text={"Excluir"} color="red" onClick={() => excluirProduto(p.id)} /> 
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {verModal && produtoEscolhido && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Editar Produto</h2>
                            <InputField
                                type="text"
                                value={produtoEscolhido.nome}
                                onChange={(e) => setProdutoEscolhido({ ...produtoEscolhido, nome: e.target.value })} 
                                label="Nome" />
                            <InputField
                                type="text"
                                value={produtoEscolhido.codigoBarras}
                                onChange={(e) => setProdutoEscolhido({ ...produtoEscolhido, codigoBarras: e.target.value })} 
                                label="Código de Barras" />
                            <InputField
                                type="number"
                                value={produtoEscolhido.preco}
                                onChange={(e) => setProdutoEscolhido({ ...produtoEscolhido, preco: parseInt(e.target.value) || 0, })} 
                                label="Preço" />
                            <InputField
                                type="text"
                                value={produtoEscolhido.categoria}
                                onChange={(e) => setProdutoEscolhido({ ...produtoEscolhido, categoria: e.target.value })} 
                                label="Categoria" />
                            <InputField
                                type="number"
                                value={produtoEscolhido.estoque}
                                onChange={(e) => setProdutoEscolhido({ ...produtoEscolhido, estoque: parseInt(e.target.value) || 0, })} 
                                label="Estoque" />
                            <InputField
                                type="text"
                                value={produtoEscolhido.fornecedor}
                                onChange={(e) => setProdutoEscolhido({ ...produtoEscolhido, fornecedor: e.target.value })} 
                                label="Fornecedor" />
                        <Button text="Salvar" color="green" onClick={editar} />
                        <Button text="Cancelar" color="grey" onClick={fecharModal} />
                    </div>
                </div>
            )}
        </div>
    );
}