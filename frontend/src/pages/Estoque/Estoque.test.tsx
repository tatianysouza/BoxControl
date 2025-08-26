import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Estoque from "./Estoque";
import axios from "axios";

vi.mock("axios");

vi.mock("../../components/BackButton/BackButton", () => ({
  default: ({ text, onClick }: { text: string; onClick: () => void }) => (
    <button onClick={onClick}>{text}</button>
  ),
}));

vi.mock("../../components/Title/Title", () => ({
  default: ({ titulo }: { titulo: string }) => <h1>{titulo}</h1>,
}));

vi.mock("../../components/Header/Header", () => ({
  default: ({ leftContent, centerContent, rightContent }: any) => (
    <header>
      {leftContent}
      {centerContent}
      {rightContent}
    </header>
  ),
}));

vi.mock("../../components/Button/Button", () => ({
  default: ({ text, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {text}
    </button>
  ),
}));

vi.mock("../../components/InputField/InputField", () => ({
  default: ({ label, value, onChange }: any) => (
    <label>
      {label}
      <input value={value} onChange={onChange} />
    </label>
  ),
}));

vi.mock("../../components/TabelaProdutos/TabelaProdutos", () => ({
  default: () => <div data-testid="mock-table">Tabela</div>,
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Tela Estoque", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("token", "fake-token");

    // Mock padrão de axios
    (axios.get as vi.Mock).mockResolvedValue({ data: [] });
    (axios.post as vi.Mock).mockResolvedValue({ data: {} });
  });

  it("renderiza título e tabela", async () => {

    render(
      <MemoryRouter>
        <Estoque />
      </MemoryRouter>
    );

    expect(await screen.findByText("Estoque")).toBeInTheDocument();
    expect(screen.getByTestId("mock-table")).toBeInTheDocument();
  });

  it("navega para /dashboard ao clicar em Voltar", async () => {
    localStorage.setItem("role", "gerente");

    render(
      <MemoryRouter>
        <Estoque />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Voltar"));
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});