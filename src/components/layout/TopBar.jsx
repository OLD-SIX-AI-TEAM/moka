/** @jsxImportSource react */
import { useLanguage } from '../../hooks/useLanguage';

export function TopBar({ mode, setMode, toggleTheme, isLight }) {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <div className="brand">
          <div className="brand-icon">M</div>
          <h1 className="brand-text">墨卡 Moka</h1>
        </div>
      </div>
      
      <div className="top-bar-center">
        <div className="mode-switcher">
          <button 
            className={`mode-pill ${mode === "single" ? "active" : ""}`}
            onClick={() => setMode("single")}
          >
            <span>{t('singleMode')}</span>
          </button>
          <button 
            className={`mode-pill ${mode === "split" ? "active" : ""}`}
            onClick={() => setMode("split")}
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
      </div>
    </header>
  );
}
