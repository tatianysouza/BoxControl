import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Estoque from './Estoque';
import type { ReactNode } from 'react';

type Produto = {
  id: number;
  nome: string;
  codBarras: string;
  estoque: number;
  categoria: string;
  fornecedor: string;
};

interface BackButtonProps {
  text: string;
  onClick: () => void;
}

interface TitleProps {
  titulo: string;
}

interface HeaderProps {
  leftContent?: ReactNode;
  centerContent?: ReactNode;
  rightContent?: ReactNode;
}

interface TableProps {
  produtos: Produto[];
  buscaAPI: boolean;
}

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../components/BackButton/BackButton', () => ({
  default: ({ text, onClick }: BackButtonProps) => (
    <button onClick={onClick}>{text}</button>
  ),
}));

vi.mock('../../components/Title/Title', () => ({
  default: ({ titulo }: TitleProps) => <h1>{titulo}</h1>,
}));

vi.mock('../../components/Header/Header', () => ({
  default: ({ leftContent, centerContent, rightContent }: HeaderProps) => (
    <header>
      {leftContent}
      {centerContent}
      {rightContent}
    </header>
  ),
}));

vi.mock('../../components/Table/Table', () => ({
  default: ({ produtos }: TableProps) => (
    <table data-testid="mock-table">
      <tbody>
        {produtos.map((produto) => (
          <tr key={produto.id}>
            <td>{produto.nome}</td>
            <td>{produto.codBarras}</td>
            <td>{produto.estoque}</td>
            <td>{produto.categoria}</td>
            <td>{produto.fornecedor}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

describe('Tela Estoque', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renderiza título e tabela com produtos', () => {
    render(
      <MemoryRouter>
        <Estoque />
      </MemoryRouter>
    );

    expect(screen.getByText('Estoque')).toBeInTheDocument();
    expect(screen.getByText('Arroz')).toBeInTheDocument();
    expect(screen.getByText('Feijão')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
    expect(screen.getByText('5678')).toBeInTheDocument();
  });

  it('navega para /dashboard ao clicar em "Voltar"', () => {
    render(
      <MemoryRouter>
        <Estoque />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Voltar'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
