import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../register/page';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';

jest.mock('@/services/api');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();

describe('Register Component', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it('renders the registration form', () => {
    render(<Register />);

    expect(screen.getByText('Cadastro')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
  });

  it('shows validation errors for invalid inputs', async () => {
    render(<Register />);

    fireEvent.click(screen.getByText('Cadastrar'));

    expect(await screen.findByText('Nome obrigatório')).toBeInTheDocument();
    expect(await screen.findByText('E-mail obrigatório')).toBeInTheDocument();
    expect(await screen.findByText('Minímo de 8 caracteres')).toBeInTheDocument();
  });

  it('submits the form and redirects on successful registration', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ data: {} });

    render(<Register />);

    fireEvent.input(screen.getByPlaceholderText('Nome'), { target: { value: 'John Doe' } });
    fireEvent.input(screen.getByPlaceholderText('E-mail'), { target: { value: 'john@example.com' } });
    fireEvent.input(screen.getByPlaceholderText('Senha'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/register', {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('handles API errors on registration', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('Registration failed'));

    render(<Register />);

    fireEvent.input(screen.getByPlaceholderText('Nome'), { target: { value: 'John Doe' } });
    fireEvent.input(screen.getByPlaceholderText('E-mail'), { target: { value: 'john@example.com' } });
    fireEvent.input(screen.getByPlaceholderText('Senha'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/register', {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
