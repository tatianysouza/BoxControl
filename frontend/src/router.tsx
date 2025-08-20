import { Navigate, Route, Routes } from "react-router-dom";
import Escolha from "./pages/Escolha/Escolha";
import LoginForm from "./pages/Inicio/LoginForm";
import { Perfil } from "./pages/Perfil/Perfil";
import Estoque from "./pages/Estoque/Estoque";
import CashRegisterPage from "./pages/ControleCaixa/CashRegisterPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import MinhasVendas from "./pages/MinhasVendas/MinhasVendas";
import Vendas from "./pages/Vendas/Vendas";

function AppRouter() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginForm />} />
      {token && (
        <>
          <Route path="/dashboard" element={<Escolha />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/caixa" element={<CashRegisterPage />} />
          <Route path="/painel-de-controle" element={<Dashboard />} />
          <Route path="/minhas-vendas" element={<MinhasVendas />} />
          <Route path="/vendas" element={<Vendas />} />
        </>
      )}

      <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
    </Routes>
  );
}

export default AppRouter;