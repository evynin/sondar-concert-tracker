import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Concert } from '../types';
import ConcertForm from '../components/ConcertForm';

interface Props {
  user: User | null;
}

const statusColors: Record<string, string> = {
  'Want to Go': '#ffc857',
  'Got Tickets': '#255f85',
  'Attended':   '#c5283d',
  'Not Going':  '#6b7280',
};

const statusIcons: Record<string, string> = {
  'Want to Go': '⭐',
  'Got Tickets': '🎟',
  'Attended':   '🔥',
  'Not Going':  '✕',
};

export default function ConcertListView({ user }: Props) {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<Concert | null>(null);

  useEffect(() => { fetchConcerts(); }, []);

  async function fetchConcerts() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('concerts')
      .select('*')
      .order('date', { ascending: true });
    if (error) setError(error.message);
    else setConcerts(data ?? []);
    setLoading(false);
  }

  async function handleAdd(data: Partial<Concert>) {
    if (!user) return;
    const payload = { ...data, user_id: user.id, status: data.status ?? 'Not Going' };
    const { error } = await supabase.from('concerts').insert([payload]);
    if (error) { alert(error.message); return; }
    setShowForm(false);
    fetchConcerts();
  }

  async function handleEdit(data: Partial<Concert>) {
    if (!editing) return;
    const { error } = await supabase
      .from('concerts')
      .update(data)
      .eq('id', editing.id);
    if (error) { alert(error.message); return; }
    setEditing(null);
    fetchConcerts();
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this concert? This cannot be undone.')) return;
    const { error } = await supabase.from('concerts').delete().eq('id', id);
    if (error) { alert(error.message); return; }
    fetchConcerts();
  }

  if (loading) return (
    <>
      <style>{loaderCSS}</style>
      <div className="cl-loading">
        <div className="cl-bars">
          <span /><span /><span /><span /><span />
        </div>
        <p className="cl-loading-text">Loading Concerts</p>
      </div>
    </>
  );

  if (error) return (
    <>
      <style>{pageCSS}</style>
      <div className="cl-root">
        <p className="cl-error">Failed to load: {error}</p>
      </div>
    </>
  );

  if (showForm || editing) {
    return (
      <ConcertForm
        concert={editing}
        onSave={editing ? handleEdit : handleAdd}
        onCancel={() => { setShowForm(false); setEditing(null); }}
      />
    );
  }

  return (
    <>
      <style>{pageCSS}</style>
      <div className="cl-root">

        {/* Page header */}
        <div className="cl-header">
          <div>
            <p className="cl-label">Live Music</p>
            <h1 className="cl-title">Concerts</h1>
          </div>
          {user && (
            <button className="cl-btn-add" onClick={() => setShowForm(true)}>
              + Add Concert
            </button>
          )}
        </div>

        {/* Guest banner */}
        {!user && (
          <div className="cl-guest-banner">
            👀 Browsing as a guest —&nbsp;<strong>sign in</strong>&nbsp;to add, edit, or delete concerts.
          </div>
        )}

        {/* Empty state */}
        {concerts.length === 0 ? (
          <div className="cl-empty">
            <span className="cl-empty-icon">🎸</span>
            <p>{user
              ? 'No concerts yet. Click "+ Add Concert" to create one.'
              : 'No concerts yet. Sign in to add the first one.'
            }</p>
          </div>
        ) : (
          <div className="cl-grid">
            {concerts.map((c) => {
              const status = c.status ?? 'Not Going';
              return (
                <div key={c.id} className="cl-card">

                  {/* Colored top accent bar — logged-in only */}
                  {user && (
                    <div
                      className="cl-card-accent"
                      style={{ background: statusColors[status] ?? '#6b7280' }}
                    />
                  )}

                  <div className="cl-card-body">
                    <div className="cl-card-info">
                      <h3 className="cl-artist">{c.artist}</h3>
                      <p className="cl-meta">📍 {c.venue}</p>
                      <p className="cl-meta">
                        📅 {new Date(c.date).toLocaleDateString('en-US', {
                          weekday: 'short', year: 'numeric',
                          month: 'short', day: 'numeric',
                        })}
                      </p>
                      <p className="cl-meta">🎵 {c.genre}</p>
                      {c.ticket_price != null && (
                        <p className="cl-meta">🎟 ${c.ticket_price}</p>
                      )}
                      {c.notes && <p className="cl-notes">{c.notes}</p>}
                    </div>

                    {/* Status badge — logged-in only */}
                    {user && (
                      <div className="cl-card-right">
                        <span
                          className="cl-status-badge"
                          style={{ background: statusColors[status] ?? '#6b7280' }}
                        >
                          {statusIcons[status]} {status}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions — logged-in only */}
                  {user && (
                    <div className="cl-card-actions">
                      <button className="cl-btn-edit" onClick={() => setEditing(c)}>Edit</button>
                      <button className="cl-btn-delete" onClick={() => handleDelete(c.id)}>Delete</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

/* ── LOADER ── */
const loaderCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');
  .cl-loading {
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #481d24;
  }
  .cl-bars {
    display: flex;
    align-items: flex-end;
    gap: 6px;
    height: 48px;
  }
  .cl-bars span {
    width: 8px;
    border-radius: 4px;
    background: #ffc857;
    animation: clBarBounce 1s ease-in-out infinite;
  }
  .cl-bars span:nth-child(1) { animation-delay: 0s;   height: 20px; }
  .cl-bars span:nth-child(2) { animation-delay: 0.1s; height: 32px; background: #e9724c; }
  .cl-bars span:nth-child(3) { animation-delay: 0.2s; height: 48px; background: #c5283d; }
  .cl-bars span:nth-child(4) { animation-delay: 0.3s; height: 32px; background: #e9724c; }
  .cl-bars span:nth-child(5) { animation-delay: 0.4s; height: 20px; }
  @keyframes clBarBounce {
    0%, 100% { transform: scaleY(0.5); opacity: 0.5; }
    50%       { transform: scaleY(1);   opacity: 1; }
  }
  .cl-loading-text {
    margin-top: 20px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.2rem;
    letter-spacing: 6px;
    color: #ffc857;
    opacity: 0.8;
  }
`;

/* ── PAGE ── */
const pageCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');

  body {
  background: #481d24;
 }

  .cl-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    padding: 48px 24px 80px;
    max-width: 900px;
    margin: 0 auto;
    color: white;
  }
    

  .cl-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 28px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .cl-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.8rem;
    letter-spacing: 5px;
    color: #e9724c;
    margin: 0 0 6px;
  }
  .cl-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 6vw, 4rem);
    letter-spacing: 2px;
    color: white;
    margin: 0;
  }
  .cl-btn-add {
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 0.95rem;
    padding: 12px 24px;
    background: linear-gradient(135deg, #c5283d, #e9724c);
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    box-shadow: 0 6px 24px rgba(197,40,61,0.4);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .cl-btn-add:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(197,40,61,0.55);
    color: white;
    border: none;
  }

  .cl-guest-banner {
    background: rgba(255,200,87,0.08);
    border: 1px solid rgba(255,200,87,0.25);
    border-radius: 10px;
    padding: 12px 18px;
    margin-bottom: 24px;
    color: rgba(255,200,87,0.9);
    font-size: 0.9rem;
  }

  .cl-empty {
    text-align: center;
    padding: 80px 24px;
    color: rgba(255,255,255,0.4);
  }
  .cl-empty-icon { font-size: 3rem; display: block; margin-bottom: 12px; }
  .cl-empty p { font-size: 1rem; margin: 0; }

  .cl-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  .cl-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 14px;
    overflow: hidden;
    transition: background 0.2s, transform 0.2s;
  }
  .cl-card:hover {
    background: rgba(255,255,255,0.08);
    transform: translateY(-2px);
  }
  .cl-card-accent {
    height: 4px;
    width: 100%;
  }
  .cl-card-body {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20px 20px 12px;
    gap: 12px;
  }
  .cl-card-info { flex: 1; }
  .cl-artist {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.5rem;
    letter-spacing: 1px;
    color: #ffc857;
    margin: 0 0 8px;
  }
  .cl-meta {
    font-size: 0.88rem;
    color: rgba(255,255,255,0.55);
    margin: 0 0 4px;
  }
  .cl-notes {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.35);
    margin: 8px 0 0;
    font-style: italic;
    line-height: 1.5;
  }
  .cl-card-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex-shrink: 0;
  }
  .cl-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    color: white;
    white-space: nowrap;
  }
  .cl-card-actions {
    display: flex;
    gap: 8px;
    padding: 0 20px 16px;
  }
  .cl-btn-edit {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    padding: 6px 16px;
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.2);
    background: transparent;
    color: rgba(255,255,255,0.7);
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }
  .cl-btn-edit:hover {
    border-color: #ffc857;
    color: #ffc857;
  }
  .cl-btn-delete {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    padding: 6px 16px;
    border-radius: 20px;
    border: 1px solid rgba(197,40,61,0.4);
    background: transparent;
    color: rgba(197,40,61,0.8);
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .cl-btn-delete:hover {
    border-color: #c5283d;
    color: white;
    background: #c5283d;
  }
  .cl-error {
    color: #e9724c;
    background: rgba(197,40,61,0.1);
    border: 1px solid rgba(197,40,61,0.3);
    padding: 12px 16px;
    border-radius: 8px;
  }
`;