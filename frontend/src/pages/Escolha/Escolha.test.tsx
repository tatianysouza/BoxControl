import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Escolha from './Escolha';

interface HeaderProps {
  leftContent?: React.ReactNode;
  centerContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}
interface OptionCardProps {
  icon: string;
  label: string;
  onClick: () => void;
}
interface LogoutButtonProps {
  onClick: () => void;
}

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../components/Header/Header', () => ({
  default: (props: HeaderProps) => (
    <header>
      {props.leftContent}
      {props.centerContent}
      {props.rightContent}
    </header>
  ),
}));

vi.mock('../../components/OptionCard/OptionCard', () => ({
  default: ({ label, onClick }: OptionCardProps) => (
    <div onClick={onClick} data-testid={`option-${label}`}>
      {label}
    </div>
  ),
}));

vi.mock('../../components/LogoutButton/LogoutButton', () => ({
  default: ({ onClick }: LogoutButtonProps) => (
    <button onClick={onClick}>Logout</button>
  ),
}));

describe('Tela Escolha', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'fake-token');
    mockNavigate.mockClear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renderiza corretamente as opções e botão de logout', () => {
    render(
      <MemoryRouter>
        <Escolha />
      </MemoryRouter>
    );

    expect(screen.getByText('Escolha uma opção:')).toBeInTheDocument();
    expect(screen.getByTestId('option-Meu Perfil')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('navega para perfil ao clicar em "Meu Perfil"', () => {
    render(
      <MemoryRouter>
        <Escolha />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId('option-Meu Perfil'));
    expect(mockNavigate).toHaveBeenCalledWith('/perfil');
  });

  it('remove token e navega ao clicar em "Logout"', () => {
    render(
      <MemoryRouter>
        <Escolha />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Logout'));
    expect(localStorage.getItem('token')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
