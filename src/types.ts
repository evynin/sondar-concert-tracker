// The four views you can switch between. If you add a page, add its key here.
export type View = 'home' | 'list' | 'signin' | 'signup';

export interface Concert {
  id: number;
  created_at: string;
  user_id: string;
  artist: string;
  venue: string;
  date: string;
  genre: string;
  ticket_price: number | null;
  status: 'Want to Go' | 'Got Tickets' | 'Attended' | 'Not Going';
  notes: string | null;
}