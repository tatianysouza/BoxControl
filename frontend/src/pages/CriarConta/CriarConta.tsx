import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";
import CriarForm from "../../components/CriarForm/CriarForm";
import Header from "../../components/Header/Header";
import Title from "../../components/Title/Title";

const CriarConta = () => {
    const navigate = useNavigate();
    return(
        <div>
            <Header leftContent={<BackButton text="Voltar" onClick={() => {navigate("/login")}}/>}
            centerContent={<Title titulo="Criar Conta"/>}
            rightContent={null}
            />
            <CriarForm/>
        </div>
    );
}

export default CriarConta;