// import Estoque from "./pages/Estoque/Estoque";
import { Navigate, Route, Routes } from "react-router-dom";
import Escolha from "./pages/Escolha/Escolha";
import LoginForm from "./pages/Inicio/LoginForm";
import { Perfil } from "./pages/Perfil/Perfil";
import Estoque from "./pages/Estoque/Estoque";
import CashRegisterPage from "./pages/ControleCaixa/CashRegisterPage";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {!token && <Route path="*" element={<Navigate to="/login" />} />}

      <Route path="/login" element={<LoginForm />} />

      {token && (
        <>
          <Route path="/dashboard" element={<Escolha />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/caixa" element={<CashRegisterPage/>} />
        </>
      )}
    </Routes>
  );
}

export default App
