import { render, screen, fireEvent } from '@testing-library/react';
import { CardBookings } from '@/app/_components/bookings_card';
import { BookingDTO } from '@/dtos/BookingDTO';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
   useRouter: jest.fn(),
}));

const mockBooking: BookingDTO = {
   id: 1,
   room_name: 'Sala 1',
   date: '2023-12-01',
   start_time: '10:00',
   end_time: '12:00',
   status: 'Reservado',
   user_name: 'John Doe',
   room_id: 0,
   user_id: 0,
   created_at: '',
   updated_at: ''
};

jest.mock('@/services/api', () => ({
   api: {
      put: jest.fn(),
   },
}));

describe('CardBookings', () => {
   beforeEach(() => {
      (useRouter as jest.Mock).mockReturnValue({
         push: jest.fn(),
      });
      window.localStorage.setItem('@desafio:user', JSON.stringify({ is_admin: false }));
   });

   test('calls handleCancelBooking when cancel button is clicked', async () => {
      render(<CardBookings booking={mockBooking} />);

    const cancelButton = screen.getByRole('button', { name: /cancelar reserva/i });

    fireEvent.click(cancelButton);

    expect(window.confirm).toHaveBeenCalledWith(
        expect.stringContaining('Tem certeza que deseja cancelar a reserva na sala')
    );
   });
});
