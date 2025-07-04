import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renderiza com o texto correto', () => {
    render(<Button text="Entrar" />);
    expect(screen.getByText('Entrar')).toBeInTheDocument();
  });

  it('chama a função onClick quando clicado', () => {
    const handleClick = vi.fn();
    render(<Button text="Clique aqui" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Clique aqui'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
