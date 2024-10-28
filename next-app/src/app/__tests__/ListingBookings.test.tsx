import { act, render, screen, waitFor } from '@testing-library/react';
import ListingBookings from '@/app/dash/bookings/page';
import { api } from '@/services/api';
import { UserDTO } from '@/dtos/UserDTO';
import { useRouter } from 'next/navigation';

const mockUser: UserDTO = {
   id: 1,
   name: 'Test User',
   email: 'test@example.com',
   is_admin: false,
   created_at: '',
   updated_at: ''
};

jest.mock('next/navigation', () => ({
   useRouter: jest.fn(),
}));

const mockBookings = [
   { id: 1, room_name: 'Room 1', date: '2023-12-01', start_time: '10:00', end_time: '12:00', status: 'Reservado', user_name: 'John Doe' },
   { id: 2, room_name: 'Room 2', date: '2023-12-02', start_time: '14:00', end_time: '16:00', status: 'Reservado', user_name: 'Jane Doe' },
];

beforeEach(() => {
   (api.get as jest.Mock).mockResolvedValue({ data: { data: mockBookings } });
   window.localStorage.setItem('@desafio:user', JSON.stringify({ is_admin: false }));

   (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
   });
});

jest.mock('@/services/api');
jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
   if (key === '@desafio:user') {
      return JSON.stringify(mockUser);
   }
   return null;
});

describe('ListingBookings', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test('displays message when there are no bookings', async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({
         data: { data: [] },
      });

      render(<ListingBookings />);

      await waitFor(() => {
         expect(screen.getByText('Sem reservas cadastradas')).toBeInTheDocument();
      });
   });

   test('renders bookings when available', async () => {
      await act(async () => {
         render(<ListingBookings />);
      });

      await waitFor(() => {
         expect(screen.getByText('Reservas')).toBeInTheDocument();
      });

      expect(screen.getByText('Room 1')).toBeInTheDocument();
      expect(screen.getByText('Room 2')).toBeInTheDocument();
   });
});
