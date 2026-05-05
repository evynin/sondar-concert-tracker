import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import type { View } from './types';
import NavBar from './components/NavBar';
import HomeView from './pages/HomeView';
import ConcertListView from './pages/ConcertListView';
import SignInView from './pages/SignInView';
import SignUpView from './pages/SignUpView';

export default function App() {
  // The current "page" is just a piece of state. This is the Option A
  // navigation pattern from the Project 2 assignment: no router, just a
  // conditional render keyed off a string.
  const [view, setView] = useState<View>('home');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Restore the session on page load so a refresh doesn't sign the user out.
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    // Keep `user` in sync when sign-in / sign-out happens anywhere in the app.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <>
      <NavBar view={view} setView={setView} user={user} />
      <main>
        {view === 'home' && <HomeView setView={setView} />}
        {view === 'list' && <ConcertListView user={user} />}
        {view === 'signin' && <SignInView setView={setView} />}
        {view === 'signup' && <SignUpView setView={setView} />}
      </main>
    </>
  );
}
