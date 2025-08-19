import React, { useState, useEffect } from "react";
import socket from "../../socket";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/InputField";
import ProductRow from "../../components/ProductRow/ProductRow";
import styles from "./CashRegisterPage.module.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";

interface Product {
  id: number;
  name: string;
  price: number;
  codigoBarras: string;
  quantidade: number;
}

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

const CashRegisterPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cliente, setCliente] = useState("");
  const [cpf, setCpf] = useState("");
  const [pago, setPago] = useState(true);
  const [codigoBarras, setCodigoBarras] = useState("");
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  const total = products.reduce((acc, p) => acc + p.price * p.quantidade, 0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado!");
      window.location.href = "/";
      return;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const id = Number(decoded.id);
      setUsuarioId(id);

      socket.emit("join_usuario", { usuarioId: id });
      socket.on("produto_atualizado", (produtos: Product[]) => setProducts(produtos));
      socket.on("erro_produto", (data) => alert(data.mensagem));
      socket.on("venda_finalizada", () => {
        alert("Venda finalizada!");
        setProducts([]);
        setCliente("");
        setCpf("");
        setPago(true);
        setCodigoBarras("");
      });
      socket.on("erro_finalizar", (data) => alert(data.mensagem));
    } catch (error) {
      console.error(error);
    }

    return () => {
      socket.off("produto_atualizado");
      socket.off("erro_produto");
      socket.off("venda_finalizada");
      socket.off("erro_finalizar");
    };
  }, []);

  const handleAdicionarProduto = () => {
    if (!usuarioId || !codigoBarras.trim()) return;
    socket.emit("adicionar_produto", { usuarioId, codigo_barras: codigoBarras.trim() });
    setCodigoBarras("");
  };

  const handleQuantityChange = (id: number, qty: number) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, quantidade: qty } : p)));

  const handleFinalizarCompra = () => {
    if (!usuarioId || products.length === 0) return alert("Adicione produtos!");
    const itens = products.map((p) => ({ codigo_barras: p.codigoBarras, quantidade: p.quantidade }));
    socket.emit("finalizar_venda", { nome_cliente: cliente || "Não informado", cpf_cliente: cpf || "Não informado", pago, itens, usuarioId });
  };

  const navigate = useNavigate();
  
  return (
    <div className={styles.page}>
      <Header leftContent={<BackButton text="Voltar" onClick={() => {navigate("/dashboard")}}/>} 
      centerContent={<h2>Controle de Caixa</h2>} rightContent={null} />
      <div className={styles.container}>
        <div className={styles.productList}>
          <h2>Produtos</h2>
          <div className={styles.productHeader}><span>Produto</span><span>Qtd x Preço</span></div>
          <ul className={styles.productItems}>
            {products.map((product) => (
              <ProductRow key={product.id} {...product} onQuantityChange={handleQuantityChange} />
            ))}
          </ul>
        </div>

        <div className={styles.summary}>
          <div>
            <div className={styles.total}>R$ {total.toFixed(2)}</div>
            <div className={styles.clientFields}>
              <Input label="Cliente" placeholder="Nome do cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
              <Input label="CPF" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} />
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={!pago} onChange={() => setPago((prev) => !prev)} />
                Não Pago
              </label>
              <div className={styles.inputRow}>
                <Input label="Código de Barras" placeholder="Digite ou escaneie" value={codigoBarras} onChange={(e) => setCodigoBarras(e.target.value)} />
                <Button text="Adicionar" color="var(--light-blue)" onClick={handleAdicionarProduto} />
              </div>
            </div>
          </div>

          <Button text="Finalizar Compra" color="primary" onClick={handleFinalizarCompra} />
        </div>
      </div>
    </div>
  );
};

export default CashRegisterPage;
