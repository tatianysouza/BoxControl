import React from "react";
import styles from "./ProductRow.module.css";

interface ProductRowProps {
  id: number;
  name: string;
  price: number;
  quantidade: number;
  onQuantityChange: (id: number, quantidade: number) => void;
}

const ProductRow: React.FC<ProductRowProps> = ({
  id,
  name,
  price,
  quantidade,
  onQuantityChange,
}) => {
  return (
    <li className={styles.productItem}>
      <span>{name}</span>
      <span>
        <input
          type="number"
          min={1}
          value={quantidade}
          onChange={(e) => onQuantityChange(id, Number(e.target.value))}
          className={styles.qtyInput}
        />
        {" x "}
        <span className={styles.price}>{price.toFixed(2)}</span>
      </span>
    </li>
  );
};
console.log("🔍 Renderizando:", name);


export default ProductRow;
