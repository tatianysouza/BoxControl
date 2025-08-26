import { render, screen, fireEvent } from "@testing-library/react";
import UserTable from "./UserTable";

const mockFuncionarios = [
  {
    id: 1,
    nome: "João Silva",
    email: "joao@empresa.com",
    cargo: "Desenvolvedor",
    status: true,
    dataAdmissao: "2023-01-01",
  },
  {
    id: 2,
    nome: "Maria Souza",
    email: "maria@empresa.com",
    cargo: "Designer",
    status: false,
    dataAdmissao: "2022-05-10",
  },
];

describe("UserTable", () => {
  it("deve exibir mensagem quando não houver funcionários", () => {
    render(<UserTable funcionarios={[]} onEditarStatus={() => {}} />);
    expect(screen.getByText("Nenhum funcionário encontrado.")).toBeInTheDocument();
  });

  it("deve renderizar a tabela com os funcionários", () => {
    render(<UserTable funcionarios={mockFuncionarios} onEditarStatus={() => {}} />);

    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Maria Souza")).toBeInTheDocument();
    expect(screen.getByText("Desenvolvedor")).toBeInTheDocument();
    expect(screen.getByText("Designer")).toBeInTheDocument();
  });

  it("deve chamar onEditarStatus ao mudar o status", () => {
    let recebido: { id: number; status: boolean } | null = null;

    const onEditarStatus = (id: number, novoStatus: boolean) => {
      recebido = { id, status: novoStatus };
    };

    render(<UserTable funcionarios={mockFuncionarios} onEditarStatus={onEditarStatus} />);

    // pega o select do segundo funcionário (que está Inativo)
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[1], { target: { value: "Ativo" } });

    expect(recebido).toEqual({ id: 2, status: true });
  });
});