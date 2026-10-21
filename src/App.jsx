import React, { useEffect, useState } from 'react';
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

function App() {
  const [activeTab, setActiveTab] = useState('learn');
  const [legacyError, setLegacyError] = useState('');

  useEffect(() => {
    const onNavigate = (event) => {
      setActiveTab(event.detail);
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

  function navigate(tab) {
    setActiveTab(tab);
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
      <header className="app-header">
        <div className="header-tools">
          <button className="icon-button" type="button" onClick={() => navigate('admin')} aria-label="Admin editor" title="Admin editor">
            <SettingsIcon />
          </button>
          <button className="icon-button" type="button" onClick={() => navigate('share')} aria-label="Share QR code" title="Share QR code">
            <QrIcon />
          </button>
        </div>
        <h1>🎯 MATH JEOPARDY!</h1>
        <p>Sequences, Series, and Financial Applications | Grade 11 General Mathematics</p>
        <p><strong>Understand • Choose • Solve • Explain</strong></p>
        <nav className="nav" aria-label="Main navigation">
          {tabs.map(([id, label]) => (
            <button key={id} type="button" onClick={() => navigate(id)} aria-current={activeTab === id ? 'page' : undefined}>
              {label}
            </button>
          ))}
          <button type="button" onClick={restartGame} className="restart-button">Restart Game</button>
        </nav>
      </header>
      <main className="app-content" data-active-tab={activeTab} dangerouslySetInnerHTML={{ __html: contentMarkup }} />
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
