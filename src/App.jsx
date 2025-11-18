import { useState } from 'react';
import { DesignerProvider } from './context/DesignerContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import DesignerModal from './components/DesignerModal';
import SearchTab from './components/SearchTab';
import { getTranslation } from './utils/i18n';
import { Settings, Globe } from 'lucide-react';
import logo from './assets/logo.svg';
import './index.css';

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  const t = (key) => getTranslation(language, key);

  return (
    <div className="app">
      <header className="app-header">
        <img src={logo} alt="Logo" className="app-logo" />
        <div className="header-content">
          <h1 className="app-title">{t('appTitle')}</h1>
          <p className="app-subtitle">{t('appSubtitle')}</p>
        </div>
        <div className="header-actions">
          <div className="language-selector">
            <Globe className="icon-small" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="language-select"
            >
              <option value="de">Deutsch</option>
              <option value="en">English</option>
            </select>
          </div>
          <button
            className="btn-manage-designers"
            onClick={() => setIsModalOpen(true)}
          >
            <Settings className="icon" />
            {t('manageDesigners')}
          </button>
        </div>
      </header>

      <main className="app-main">
        <SearchTab />
      </main>

      <footer className="app-footer">
        <p>{t('poweredBy')}</p>
      </footer>

      <DesignerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <DesignerProvider>
        <AppContent />
      </DesignerProvider>
    </LanguageProvider>
  );
}

export default App;
