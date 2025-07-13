import { useEffect, useState } from "react";
import styles from "./Table.module.css"
import axios from "axios";
import Button from "../Button/Button";

interface Produto{
    id: number
    nome: string;
    codBarras: string;
    estoque: number;
    categoria: string;
    fornecedor: string;
}

interface TabelaProps{
    produtos?: Produto[];
    buscaAPI: boolean;
}
export default function Table({produtos: propsProdutos, buscaAPI = false}: TabelaProps){
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(buscaAPI);
    
    useEffect(() =>{
        if(!buscaAPI){
            setProdutos(propsProdutos || []);
            return;
        }

        setLoading(true);
        axios
            .get("http://localhost:5000/api/produtos/listar")
            .then((res) => {
                setProdutos(res.data);
            })
            .catch((err) => {
                console.error("Erro ao carregar produtos", err);
            })
            .finally(()=> setLoading(false));
    }, [propsProdutos, buscaAPI]);

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
                            <td>{p.codBarras}</td>
                            <td>{p.estoque}</td>
                            <td>{p.categoria}</td>
                            <td>{p.fornecedor}</td>
                            <td>
                                <div className={styles.actions}>
                                    <Button text={"Editar"} color="#ffa719ff"/> 
                                    <Button text={"Excluir"} color="red"/> 
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}