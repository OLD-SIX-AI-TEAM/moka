/** @jsxImportSource react */
import { useLanguage } from '../../hooks/useLanguage';

export function TopBar({ mode, setMode, toggleTheme, isLight, loading, exporting }) {
  const { language, toggleLanguage, t } = useLanguage();
  const isProcessing = loading || exporting;

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <div className="brand">
          <div className="brand-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28">
              <defs>
                <linearGradient id="mokaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#A78BFA"/>
                  <stop offset="100%" stop-color="#7C3AED"/>
                </linearGradient>
              </defs>
              <path d="M16 2C16 2 8 12 8 18C8 22.4183 11.5817 26 16 26C20.4183 26 24 22.4183 24 18C24 12 16 2 16 2Z" fill="url(#mokaGrad)"/>
              <ellipse cx="13" cy="16" rx="3" ry="5" fill="white" opacity="0.25"/>
              <path d="M10 28L10 22L13 25L16 22L19 25L22 22L22 28" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.9"/>
              <circle cx="16" cy="28" r="1.5" fill="#A78BFA"/>
            </svg>
          </div>
          <h1 className="brand-text">墨卡 Moka</h1>
        </div>
      </div>

      <div className="top-bar-center">
        <div className={`mode-switcher ${isProcessing ? 'disabled' : ''}`}>
          <button
            className={`mode-pill ${mode === "single" ? "active" : ""}`}
            onClick={() => !isProcessing && setMode("single")}
            disabled={isProcessing}
            title={isProcessing ? "生成中不可切换" : ""}
          >
            <span>{t('singleMode')}</span>
          </button>
          <button
            className={`mode-pill ${mode === "split" ? "active" : ""}`}
            onClick={() => !isProcessing && setMode("split")}
            disabled={isProcessing}
            title={isProcessing ? "生成中不可切换" : ""}
          >
            <span>{t('multiMode')}</span>
          </button>
        </div>
      </div>
      
      <div className="top-bar-right">
        <div className="lang-switcher">
          <button
            className={`lang-btn ${language === "zh" ? "active" : ""}`}
            onClick={() => language !== "zh" && toggleLanguage()}
            title="中文"
          >
            中
          </button>
          <button
            className={`lang-btn ${language === "en" ? "active" : ""}`}
            onClick={() => language !== "en" && toggleLanguage()}
            title="English"
          >
            EN
          </button>
        </div>
        
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={isLight ? t('darkMode') : t('lightMode')}
        >
          {isLight ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2"/>
              <path d="M12 20v2"/>
              <path d="m4.93 4.93 1.41 1.41"/>
              <path d="m17.66 17.66 1.41 1.41"/>
              <path d="M2 12h2"/>
              <path d="M20 12h2"/>
              <path d="m6.34 17.66-1.41 1.41"/>
              <path d="m19.07 4.93-1.41 1.41"/>
            </svg>
          )}
        </button>
        
        <a
          href="https://github.com/OLD-SIX-AI-TEAM/moka"
          target="_blank"
          rel="noopener noreferrer"
          className="github-btn"
          title="Star us on GitHub"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span className="star-text">★ Star</span>
        </a>
      </div>
    </header>
  );
}
