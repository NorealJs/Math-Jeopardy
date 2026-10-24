import React, { useEffect, useRef, useState } from 'react';
import legacyMarkup from './legacy-content.html?raw';

const tabs = [
  ['learn', 'Learn First'],
  ['visual', 'Visual pathway'],
  ['game', 'Play Jeopardy'],
  ['assessment', 'Exit Ticket'],
  ['guide', 'Teacher Guide']
];

const contentMarkup = legacyMarkup.replace(
  /(<section\b[^>]*\bid="(?:admin|share|game|assessment|guide|visual)"[^>]*?)\sclass="hidden(?:\s+([^"]+))?"/g,
  (_, section, remainingClasses = '') => `${section} class="${remainingClasses}"`
);

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.14 12.94a7.9 7.9 0 0 0 .06-.94 7.9 7.9 0 0 0-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.3 7.3 0 0 0-1.63-.94l-.36-2.54A.49.49 0 0 0 13.89 2h-3.78a.49.49 0 0 0-.49.42L9.26 4.96a7.3 7.3 0 0 0-1.63.94l-2.39-.96a.5.5 0 0 0-.61.22L2.71 8.48a.5.5 0 0 0 .12.64l2.03 1.58a7.9 7.9 0 0 0-.06.94c0 .32.02.63.06.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.12.21.37.3.61.22l2.39-.96c.5.39 1.05.71 1.63.94l.36 2.54c.04.24.25.42.49.42h3.78c.24 0 .45-.18.49-.42l.36-2.54a7.3 7.3 0 0 0 1.63-.94l2.39.96c.24.09.49 0 .61-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
    </svg>
  );
}

function QrIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm8-2h3v3h-3v-3zm5 0h3v5h-3v-2h-2v-3h2zm-5 5h3v3h-3v-3zm5 2h3v1h-3v-1z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
    </svg>
  );
}

function NavigationIcon({ name }) {
  const paths = {
    learn: 'M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5zm2.5-.5a.5.5 0 0 0-.5.5v11.6c.16-.06.33-.1.5-.1H18V4zM2 5h2v16H2z',
    visual: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm-2.5 3.5v9l7-4.5z',
    game: 'M4 4h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-5l-3 3-3-3H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2v11h5.83L12 19.17 14.17 17H20V6zm3 3h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z',
    assessment: 'M9 16.17 4.83 12 3.4 13.41 9 19l12-12-1.41-1.41z',
    guide: 'M4 3h7a4 4 0 0 1 4 4v14a4 4 0 0 0-4-4H4zm16 0h-3v2h3v12h-3a6 6 0 0 0-4 1.53V7a2 2 0 0 1 2-2h5z',
    restart: 'M12 4V1L8 5l4 4V6a6 6 0 1 1-5.65 8H4.26A8 8 0 1 0 12 4Z'
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('learn');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [legacyError, setLegacyError] = useState('');
  const menuToggleRef = useRef(null);
  const mobileNavWasOpen = useRef(false);

  useEffect(() => {
    const onNavigate = (event) => {
      setActiveTab(event.detail);
      setMobileNavOpen(false);
      window.scrollTo(0, 0);
    };
    window.addEventListener('math-jeopardy:navigate', onNavigate);

    const script = document.createElement('script');
    script.src = `${import.meta.env.BASE_URL}legacy.js`;
    script.onload = () => setLegacyError('');
    script.onerror = () => setLegacyError('The game could not be initialized. Reload the page and try again.');
    document.body.appendChild(script);

    return () => {
      window.removeEventListener('math-jeopardy:navigate', onNavigate);
      script.remove();
    };
  }, []);

  useEffect(() => {
    if (mobileNavOpen) {
      document.querySelector('#main-navigation button')?.focus();
    } else if (mobileNavWasOpen.current) {
      menuToggleRef.current?.focus();
    }
    mobileNavWasOpen.current = mobileNavOpen;
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) return undefined;

    function closeOnEscape(event) {
      if (event.key === 'Escape') setMobileNavOpen(false);
    }

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [mobileNavOpen]);

  function navigate(tab) {
    setActiveTab(tab);
    setMobileNavOpen(false);
    window.scrollTo(0, 0);
  }

  function restartGame() {
    if (typeof window.resetGame === 'function') {
      window.resetGame();
    } else {
      navigate('learn');
    }
  }

  return (
    <>
      <div className={`app-shell${sidebarCollapsed ? ' sidebar-collapsed' : ''}${mobileNavOpen ? ' mobile-nav-open' : ''}`}>
        <aside className="app-sidebar" aria-label="Site navigation">
          <div className="sidebar-brand">
            <span className="brand-mark" aria-hidden="true">🎯</span>
            <span className="brand-name">Math Jeopardy</span>
          </div>
          <p className="sidebar-caption">Learning menu</p>
          <nav id="main-navigation" className="nav" aria-label="Main navigation">
            {tabs.map(([id, label]) => (
              <button
                key={id}
                type="button"
                className="nav-item"
                onClick={() => navigate(id)}
                aria-current={activeTab === id ? 'page' : undefined}
                aria-label={label}
                title={sidebarCollapsed ? label : undefined}
              >
                <NavigationIcon name={id} />
                <span className="nav-label">{label}</span>
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="sidebar-footer-caption">Game controls</div>
            <button className="nav-item restart-button" type="button" onClick={restartGame} aria-label="Restart Game" title={sidebarCollapsed ? 'Restart Game' : undefined}>
              <NavigationIcon name="restart" />
              <span className="nav-label">Restart Game</span>
            </button>
            <p className="sidebar-subject">Grade 11 · General Mathematics</p>
          </div>
        </aside>
        {mobileNavOpen && (
          <button className="sidebar-backdrop" type="button" aria-label="Close navigation menu" onClick={() => setMobileNavOpen(false)} />
        )}
        <div className="app-main">
          <header className="app-header">
            <button
              ref={menuToggleRef}
              className="menu-toggle"
              type="button"
              aria-label={mobileNavOpen ? 'Close navigation menu' : sidebarCollapsed ? 'Expand navigation sidebar' : 'Collapse navigation sidebar'}
              aria-expanded={window.matchMedia('(max-width: 760px)').matches ? mobileNavOpen : !sidebarCollapsed}
              aria-controls="main-navigation"
              onClick={() => {
                if (window.matchMedia('(max-width: 760px)').matches) {
                  setMobileNavOpen((open) => !open);
                } else {
                  setSidebarCollapsed((collapsed) => !collapsed);
                }
              }}
            >
              <MenuIcon />
            </button>
            <div className="header-title">
              <h1>🎯 MATH JEOPARDY!</h1>
              <div className="header-subtitle">
                <p>Sequences, Series, and Financial Applications</p>
                <span className="header-grade">Grade 11 <span aria-hidden="true">•</span> Gen Math</span>
              </div>
            </div>
            <div className="header-tools">
              <button className="icon-button" type="button" onClick={() => navigate('admin')} aria-label="Admin editor" title="Admin editor">
                <SettingsIcon />
              </button>
              <button className="icon-button" type="button" onClick={() => navigate('share')} aria-label="Share QR code" title="Share QR code">
                <QrIcon />
              </button>
            </div>
          </header>
          <main className="app-content" data-active-tab={activeTab} dangerouslySetInnerHTML={{ __html: contentMarkup }} />
        </div>
      </div>
      <dialog id="saveSuccessDialog" aria-labelledby="saveSuccessTitle" aria-describedby="saveSuccessMessage">
        <h2 id="saveSuccessTitle">Question successfully edited!</h2>
        <p id="saveSuccessMessage">Your changes have been saved and are now live.</p>
        <form method="dialog"><button className="primary">Close</button></form>
      </dialog>
      {legacyError && <p className="runtime-error" role="alert">{legacyError}</p>}
    </>
  );
}

export default App;
