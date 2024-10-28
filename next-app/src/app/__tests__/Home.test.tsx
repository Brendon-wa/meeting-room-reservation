import { render, screen, waitFor } from '@testing-library/react';
import Home from '@/app/page';
import { api } from '@/services/api';

jest.mock('@/services/api');

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders rooms after loading', async () => {
    const mockRooms = [
      { id: 1, name: 'Sala 1' },
      { id: 2, name: 'Sala 2' },
    ];

    (api.get as jest.Mock).mockResolvedValue({
      data: {
        data: mockRooms,
      },
    });

    render(<Home />);

    await waitFor(() => expect(screen.getByText('Salas')).toBeInTheDocument());

    mockRooms.forEach(room => {
      expect(screen.getByText(room.name)).toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<Home />);

    await waitFor(() => expect(screen.getByText('Salas')).toBeInTheDocument());

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
