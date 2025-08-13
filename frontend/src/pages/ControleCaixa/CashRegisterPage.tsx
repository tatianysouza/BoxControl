import React, { useState } from "react";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/InputField";
import ProductRow from "../../components/ProductRow/ProductRow";
import styles from "./CashRegisterPage.module.css";

interface Product {
  id: number;
  name: string;
  price: number;
  quantidade: number;
}

const mockProducts: Product[] = [
  { id: 1, name: "Arroz 5kg", price: 25.9, quantidade: 1 },
  { id: 2, name: "Feijão 1kg", price: 8.5, quantidade: 1 },
  { id: 3, name: "Leite 1L", price: 4.2, quantidade: 1 },
  { id: 4, name: "Refrigerante 2L", price: 9.9, quantidade: 1 },
];

const CashRegisterPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [cliente, setCliente] = useState("");
  const [cpf, setCpf] = useState("");
  const [pago, setPago] = useState(true);

  const handleQuantityChange = (id: number, qty: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantidade: qty } : p))
    );
  };

  const total = products.reduce((acc, p) => acc + p.price * p.quantidade, 0);

  return (
    <div className={styles.page}>
      <Header
        leftContent={null}
        centerContent={<h2>Controle de Caixa</h2>}
        rightContent={null}
      />

      <div className={styles.container}>
        {/* Lista de produtos */}
        <div className={styles.productList}>
          <h2>Produtos</h2>
          <div className={styles.productHeader}>
            <span>Produto</span>
            <span>Qtd x Preço</span>
          </div>
          <ul className={styles.productItems}>
            {products.map((product) => (
              <ProductRow
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                quantidade={product.quantidade}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </ul>
        </div>

        {/* Resumo da compra */}
        <div className={styles.summary}>
          <div>
            <div className={styles.total}>R$ {total.toFixed(2)}</div>

            <div className={styles.clientFields}>
              <Input
                label="Cliente"
                placeholder="Nome do cliente"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
              />
              <Input
                label="CPF"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={!pago}
                  onChange={() => setPago((prev) => !prev)}
                />
                Não Pago
              </label>
            </div>
          </div>

          <Button text="Finalizar Compra" color="primary" onClick={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default CashRegisterPage;
