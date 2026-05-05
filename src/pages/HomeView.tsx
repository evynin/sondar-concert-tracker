import { useEffect, useState } from 'react';

export default function HomeView({ setView }: { setView: (v: string) => void }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');
        
        :root {
          --golden-pollen: #ffc857ff;
          --burnt-peach: #e9724cff;
          --intense-cherry: #c5283dff;
          --night-bordeaux: #481d24ff;
          --baltic-blue: #255f85ff;
        }

        html, body {
        background: var(--night-bordeaux);
        margin: 0;
        padding: 0;
        } 

        .home-root {
          font-family: 'DM Sans', sans-serif;
          background: var(--night-bordeaux);
          min-height: 100vh;
          overflow-x: hidden;
          color: white;
        }

        /* ── LOADING SCREEN ── */
        .loader-overlay {
          position: fixed;
          inset: 0;
          background: var(--night-bordeaux);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 999;
          transition: opacity 0.6s ease, visibility 0.6s ease;
        }
        .loader-overlay.hidden {
          opacity: 0;
          visibility: hidden;
        }
        .loader-bars {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          height: 48px;
        }
        .loader-bars span {
          width: 8px;
          border-radius: 4px;
          background: var(--golden-pollen);
          animation: barBounce 1s ease-in-out infinite;
        }
        .loader-bars span:nth-child(1) { animation-delay: 0s;    height: 20px; }
        .loader-bars span:nth-child(2) { animation-delay: 0.1s;  height: 32px; background: var(--burnt-peach); }
        .loader-bars span:nth-child(3) { animation-delay: 0.2s;  height: 48px; background: var(--intense-cherry); }
        .loader-bars span:nth-child(4) { animation-delay: 0.3s;  height: 32px; background: var(--burnt-peach); }
        .loader-bars span:nth-child(5) { animation-delay: 0.4s;  height: 20px; }
        @keyframes barBounce {
          0%, 100% { transform: scaleY(0.5); opacity: 0.5; }
          50%       { transform: scaleY(1);   opacity: 1;   }
        }
        .loader-text {
          margin-top: 20px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.4rem;
          letter-spacing: 6px;
          color: var(--golden-pollen);
          opacity: 0.8;
        }

        /* ── HERO ── */
        .hero {
          position: relative;
          min-height: 92vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px 24px 80px;
          overflow: hidden;
        }

        /* animated spotlight rings */
        .hero::before,
        .hero::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .hero::before {
          width: 700px; height: 700px;
          top: -200px; left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(circle, rgba(197,40,61,0.25) 0%, transparent 70%);
          animation: pulse 4s ease-in-out infinite;
        }
        .hero::after {
          width: 400px; height: 400px;
          bottom: -100px; right: -100px;
          background: radial-gradient(circle, rgba(37,95,133,0.3) 0%, transparent 70%);
          animation: pulse 4s ease-in-out infinite 2s;
        }
        @keyframes pulse {
          0%, 100% { transform: translateX(-50%) scale(1);   opacity: 0.7; }
          50%       { transform: translateX(-50%) scale(1.1); opacity: 1;   }
        }
        .hero::after { animation: pulseAlt 5s ease-in-out infinite 1s; }
        @keyframes pulseAlt {
          0%, 100% { transform: scale(1);   opacity: 0.6; }
          50%       { transform: scale(1.15); opacity: 1; }
        }

        /* noise grain overlay */
        .hero-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
        }

        /* ── LOGO ── */
        .logo-lockup {
          position: relative;
          z-index: 1;
          margin-bottom: 32px;
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s;
        }
        .logo-lockup.visible { opacity: 1; transform: translateY(0); }

        .logo-badge {
          width: 96px;
          height: 96px;
          border-radius: 28px;
          background: linear-gradient(135deg, var(--intense-cherry), var(--night-bordeaux));
          border: 2px solid rgba(255,200,87,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          box-shadow: 0 0 40px rgba(197,40,61,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
          font-size: 2.8rem;
        }

        .logo-wordmark {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem;
          letter-spacing: 8px;
          color: var(--golden-pollen);
          text-transform: uppercase;
        }

        /* ── HEADLINE ── */
        .hero-headline {
          position: relative;
          z-index: 1;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3.5rem, 10vw, 7rem);
          line-height: 0.95;
          letter-spacing: 2px;
          margin: 0 0 8px;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease 0.5s, transform 0.7s ease 0.5s;
        }
        .hero-headline.visible { opacity: 1; transform: translateY(0); }
        .hero-headline .line-cherry { color: var(--intense-cherry); }
        .hero-headline .line-pollen { color: var(--golden-pollen); }
        .hero-headline .line-white  { color: white; }

        .hero-sub {
          position: relative;
          z-index: 1;
          font-size: 1.1rem;
          color: rgba(255,255,255,0.65);
          max-width: 480px;
          margin: 20px auto 40px;
          line-height: 1.7;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease 0.7s, transform 0.7s ease 0.7s;
        }
        .hero-sub.visible { opacity: 1; transform: translateY(0); }

        .hero-cta {
          position: relative;
          z-index: 1;
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease 0.9s, transform 0.7s ease 0.9s;
        }
        .hero-cta.visible { opacity: 1; transform: translateY(0); }

        .btn-primary-hero {
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          padding: 14px 32px;
          background: linear-gradient(135deg, var(--intense-cherry), var(--burnt-peach));
          color: white;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          letter-spacing: 0.5px;
          box-shadow: 0 8px 32px rgba(197,40,61,0.45);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-primary-hero:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(197,40,61,0.6);
          color: white;
          border: none;
        }

        .btn-ghost-hero {
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 1rem;
          padding: 14px 32px;
          background: transparent;
          color: rgba(255,255,255,0.8);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 50px;
          cursor: pointer;
          letter-spacing: 0.5px;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .btn-ghost-hero:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.5);
          color: white;
        }

        /* ── DIVIDER ── */
        .divider-line {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,200,87,0.3), transparent);
          margin: 0;
        }

        /* ── STATUS CARDS ── */
        .status-section {
          padding: 72px 24px;
          max-width: 900px;
          margin: 0 auto;
        }

        .section-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 0.85rem;
          letter-spacing: 5px;
          color: var(--burnt-peach);
          text-align: center;
          margin-bottom: 12px;
        }

        .section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2rem, 5vw, 3rem);
          text-align: center;
          color: white;
          margin: 0 0 48px;
          letter-spacing: 1px;
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .status-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 28px 24px;
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease, background 0.2s;
        }
        .status-card.visible { opacity: 1; transform: translateY(0); }
        .status-card:nth-child(2) { transition-delay: 0.1s; }
        .status-card:nth-child(3) { transition-delay: 0.2s; }
        .status-card:hover { background: rgba(255,255,255,0.07); }

        .status-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          border-radius: 16px 16px 0 0;
        }
        .card-want::before  { background: var(--golden-pollen); }
        .card-got::before   { background: var(--baltic-blue); }
        .card-went::before  { background: var(--intense-cherry); }

        .status-icon {
          font-size: 2rem;
          margin-bottom: 14px;
          display: block;
        }

        .status-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem;
          letter-spacing: 2px;
          margin: 0 0 8px;
        }
        .card-want  .status-name { color: var(--golden-pollen); }
        .card-got   .status-name { color: #5ab4e8; }
        .card-went  .status-name { color: var(--burnt-peach); }

        .status-desc {
          color: rgba(255,255,255,0.55);
          font-size: 0.9rem;
          line-height: 1.6;
          margin: 0;
        }

        /* ── FOOTER CTA ── */
        .footer-cta {
          text-align: center;
          padding: 48px 24px 72px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .footer-cta p {
          color: rgba(255,255,255,0.45);
          font-size: 0.95rem;
          margin: 0;
        }

      `}</style>

      {/* Loading overlay */}
      <div className={`loader-overlay${loaded ? ' hidden' : ''}`}>
        <div className="loader-bars">
          <span /><span /><span /><span /><span />
        </div>
        <div className="loader-text">Loading Sondar</div>
      </div>

      <div className="home-root">

        {/* Hero */}
        <section className="hero">
          <div className="hero-grain" />

          <div className={`logo-lockup${loaded ? ' visible' : ''}`}>
            <div className="logo-badge">🎵</div>
            <div className="logo-wordmark">Sondar</div>
          </div>

          <h1 className={`hero-headline${loaded ? ' visible' : ''}`}>
            <span className="line-white">Every</span><br />
            <span className="line-cherry">Show.</span><br />
            <span className="line-pollen">Tracked.</span>
          </h1>

          <p className={`hero-sub${loaded ? ' visible' : ''}`}>
            From the shows you're dying to see, to the ones you'll never forget —
            Sondar is your personal concert archive.
          </p>

          <div className={`hero-cta${loaded ? ' visible' : ''}`}>
          <button
            className="btn-primary-hero"
            onClick={() => setView('list')}
          >
            Browse Concerts
          </button>
          <button
            className="btn-ghost-hero"
            onClick={() => setView('signup')}
          >
            Sign Up Free
          </button>
          </div>
        </section>

        {/* Status cards */}
        <section className="status-section">
          <p className="section-label">How It Works</p>
          <h2 className="section-title">Three Statuses. Total Control.</h2>

          <div className="status-grid">
            <div className={`status-card card-want${loaded ? ' visible' : ''}`}>
              <span className="status-icon">⭐</span>
              <p className="status-name">Want to Go</p>
              <p className="status-desc">
                Save shows on your radar before tickets sell out. Build your wishlist and never miss an announcement.
              </p>
            </div>
            <div className={`status-card card-got${loaded ? ' visible' : ''}`}>
              <span className="status-icon">🎟</span>
              <p className="status-name">Got Tickets</p>
              <p className="status-desc">
                Locked in and ready. Track everything you're confirmed for with venue, date, and price all in one place.
              </p>
            </div>
            <div className={`status-card card-went${loaded ? ' visible' : ''}`}>
              <span className="status-icon">🔥</span>
              <p className="status-name">Attended</p>
              <p className="status-desc">
                Build a personal archive of every show you've been to. Your concert history, forever.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="footer-cta">
          <p>Browse the concert list as a guest · Sign up to start tracking your own shows</p>
        </div>

      </div>
    </>
  );
}