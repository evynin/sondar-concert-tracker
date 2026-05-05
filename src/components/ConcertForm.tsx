import { useState } from 'react';
import type { Concert } from '../types';

interface Props {
  concert: Concert | null;
  onSave: (data: Partial<Concert>) => void;
  onCancel: () => void;
}

export default function ConcertForm({ concert, onSave, onCancel }: Props) {
  const [artist, setArtist] = useState(concert?.artist ?? '');
  const [venue, setVenue] = useState(concert?.venue ?? '');
  const [date, setDate] = useState(concert?.date ?? '');
  const [genre, setGenre] = useState(concert?.genre ?? '');
  const [ticketPrice, setTicketPrice] = useState(
    concert?.ticket_price != null ? String(concert.ticket_price) : ''
  );
  const [status, setStatus] = useState<Concert['status']>(
    concert?.status ?? 'Want to Go'
  );
  const [notes, setNotes] = useState(concert?.notes ?? '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onSave({
      artist,
      venue,
      date,
      genre,
      ticket_price: ticketPrice !== '' ? parseFloat(ticketPrice) : null,
      status,
      notes: notes || null,
    });
  }

  const isEditing = concert !== null;

  return (
    <div>
      <h1>{isEditing ? 'Edit Concert' : 'Add Concert'}</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
        <label>
          Artist *
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="e.g. Radiohead"
            required
          />
        </label>

        <label>
          Venue *
          <input
            type="text"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="e.g. 9:30 Club, Washington DC"
            required
          />
        </label>

        <label>
          Date *
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        <label>
          Genre *
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="e.g. Indie Rock"
            required
          />
        </label>

        <label>
          Ticket Price
          <input
            type="number"
            value={ticketPrice}
            onChange={(e) => setTicketPrice(e.target.value)}
            placeholder="e.g. 45.00"
            min="0"
            step="0.01"
          />
        </label>

        <label>
          Status *
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Concert['status'])}
          >
            <option>Want to Go</option>
            <option>Got Tickets</option>
            <option>Attended</option>
          </select>
        </label>

        <label>
          Notes
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything worth remembering..."
            rows={3}
          />
        </label>

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button className="primary" type="submit">
            {isEditing ? 'Save Changes' : 'Add Concert'}
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}