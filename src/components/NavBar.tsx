import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { View } from '../types';

interface Props {
  view: View;
  setView: (v: View) => void;
  user: User | null;
}

export default function NavBar({ view, setView, user }: Props) {
  async function handleSignOut() {
    await supabase.auth.signOut();
    setView('home');
  }

  return (
    <>
   <style>{`
    .nav {
      background: #c5283dff;
    }
    
    .nav button {
      background: transparent;
      border: transparent;
   }
    .nav button:hover {
      background: #ffc857ff;
    }
    .nav button.active {
      font-weight: bold;
      background: #e9724cff;
    }
  `}</style>


    <nav className="nav">
      <span className="brand">🎵 Sondar</span>
      <button
        className={view === 'home' ? 'active' : ''}
        onClick={() => setView('home')}
      >
        Home
      </button>
      <button
        className={view === 'list' ? 'active' : ''}
        onClick={() => setView('list')}
      >
        Concerts
      </button>

      <span className="spacer" />

      {user ? (
        <>
          <span style={{ color: 'var(--muted)', fontSize: '0.9em' }}>{user.email}</span>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <>
          <button
            className={view === 'signin' ? 'active' : ''}
            onClick={() => setView('signin')}
          >
            Sign In
          </button>
          <button
            className={view === 'signup' ? 'active' : ''}
            onClick={() => setView('signup')}
          >
            Sign Up
          </button>
        </>
      )}
    </nav>
    </>
  );
}