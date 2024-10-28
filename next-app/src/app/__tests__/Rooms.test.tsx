import { render, screen } from '@testing-library/react';
import { Rooms } from '../_components/rooms';
import { RoomDTO } from '@/dtos/RoomDTO';

describe('Rooms Component', () => {
  const mockRoomData: RoomDTO = {
     id: 1,
     name: 'Room 1',
     value: '100',
     description: '',
     photos: '',
     is_available: false,
     created_at: '',
     updated_at: ''
  };

  it('renders the room information correctly', () => {
    render(<Rooms data={mockRoomData} />);

    expect(screen.getByText('Room 1')).toBeInTheDocument();

    expect(screen.getByText('R$ 100,00 / hora')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /ver detalhes/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ver detalhes/i })).toHaveAttribute('href', '/room/1');
  });

  it('renders the image with correct alt text', () => {
    render(<Rooms data={mockRoomData} />);

    const image = screen.getByAltText('Image Room 1');
    expect(image).toBeInTheDocument();
  });
});
