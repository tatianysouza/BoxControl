import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ListaProdutosMaisVendidos } from "./ListaProdutosMaisVendidos";

vi.mock("./ListaProdutosMaisVendidos.module.css", () => ({
  default: {
    card: "card",
    title: "title",
    list: "list",
    item: "item",
  },
}));

describe("ListaProdutosMaisVendidos", () => {
  it("renderiza o título corretamente", () => {
    render(<ListaProdutosMaisVendidos produtos={[]} />);
    expect(screen.getByText("Produtos Mais Vendidos")).toBeInTheDocument();
  });

  it("renderiza todos os produtos passados na lista", () => {
    const produtos = [
      { nome: "Produto A", quantidade: 5 },
      { nome: "Produto B", quantidade: 3 },
    ];

    render(<ListaProdutosMaisVendidos produtos={produtos} />);

    expect(screen.getByText("Produto A - 5 unidades")).toBeInTheDocument();
    expect(screen.getByText("Produto B - 3 unidades")).toBeInTheDocument();
  });

  it("renderiza uma lista vazia sem quebrar", () => {
    render(<ListaProdutosMaisVendidos produtos={[]} />);
    const lista = screen.getByRole("list");
    expect(lista.children.length).toBe(0);
  });
});
