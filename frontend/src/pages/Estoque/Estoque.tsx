import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";
import Header from "../../components/Header/Header";
import Table from "../../components/Table/Table";
import Title from "../../components/Title/Title";

const produto = [
    {id: 1, nome: "Arroz", codBarras: "1234", estoque: 5, categoria: "Alimento", fornecedor: "A&B alimentos"},
    {id: 2, nome: "Feijão", codBarras: "5678", estoque: 5, categoria: "Alimento", fornecedor: "A&B alimentos"}
];

function Estoque(){
    const navigate = useNavigate();
    return(
        <>
            <Header leftContent={<BackButton text="Voltar" onClick={() => {navigate("/dashboard")}}/>}
                 centerContent={<Title titulo="Estoque"/>}
                 rightContent={null}/>
            <Table produtos={produto} buscaAPI={false}/>
        </>
    );
}

export default Estoque;