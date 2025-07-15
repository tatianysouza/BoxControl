import { render, screen } from '@testing-library/react';
import InputField from './InputField';

describe('InputField', () => {
  it('renderiza o input com a label e o placeholder corretos', () => {
    render(
      <InputField
        label="Email"
        type="email"
        placeholder="Digite seu email"
        icon="bx-envelope"
      />
    );
    
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite seu email')).toBeInTheDocument();
  });
});
