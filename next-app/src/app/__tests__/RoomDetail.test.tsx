import { render, screen, waitFor } from '@testing-library/react';
import RoomDetail from '../room/[detail]/page';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';

jest.mock('@/services/api');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();

describe('RoomDetail Component', () => {
  const mockRoomData = {
    id: 1,
    name: 'Room 1',
    description: 'A great room for meetings',
    value: '100',
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it('renders room details when data is loaded', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: { data: mockRoomData } });

    render(<RoomDetail params={{ detail: 1 }} />);

    await waitFor(() => {
      expect(screen.getByText('Room 1')).toBeInTheDocument();
      expect(screen.getByText('A great room for meetings')).toBeInTheDocument();
      expect(screen.getByText('R$ 100,00 / hora')).toBeInTheDocument();
    });
  });

  it('redirects to booking when user is logged in', async () => {
    localStorage.setItem('@desafio:user', JSON.stringify({ is_admin: false }));

    (api.get as jest.Mock).mockResolvedValueOnce({ data: { data: mockRoomData } });

    render(<RoomDetail params={{ detail: 1 }} />);

    await waitFor(() => {
      screen.getByText('Reservar').click();
    });

    expect(mockPush).toHaveBeenCalledWith('/booking?itemId=1');
  });

  it('prompts user to log in if not logged in', async () => {
    localStorage.removeItem('@desafio:user');

    (api.get as jest.Mock).mockResolvedValueOnce({ data: { data: mockRoomData } });
    window.confirm = jest.fn(() => true);

    render(<RoomDetail params={{ detail: 1 }} />);

    await waitFor(() => {
      screen.getByText('Reservar').click();
    });

    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});
