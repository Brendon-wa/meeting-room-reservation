import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthContext } from '@/context/AuthContext';
import Login from '../login/page';

const mockSignIn = jest.fn();
const mockSignOut = jest.fn();
const mockIsLoading = false;

const renderLogin = () => {
  return render(
    <AuthContext.Provider value={{ signIn: mockSignIn, signOut: mockSignOut, isLoadingContext: mockIsLoading }}>
      <Login />
    </AuthContext.Provider>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    renderLogin();
  });

  test('renders Login form', async () => {
    expect(screen.getByPlaceholderText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    expect(screen.getByText(/Não possui uma conta\? Cadastre-se aqui./i)).toBeInTheDocument();
  });

  test('validates form inputs', async () => {
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.click(submitButton);

    expect(await screen.findByText(/E-mail obrigatório/i)).toBeInTheDocument();
    expect(await screen.findByText(/Minímo de 8 caracteres/i)).toBeInTheDocument();
  });

  test('calls signIn function on valid form submission', async () => {
    const emailInput = screen.getByPlaceholderText(/E-mail/i);
    const passwordInput = screen.getByPlaceholderText(/Senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  test('displays error message when signIn fails', async () => {
    mockSignIn.mockRejectedValueOnce(new Error('Login failed'));

    const emailInput = screen.getByPlaceholderText(/E-mail/i);
    const passwordInput = screen.getByPlaceholderText(/Senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled();
    });
  });
});
