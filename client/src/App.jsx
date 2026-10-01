import { Routes, Route, NavLink } from 'react-router-dom';
import OverviewPage from './pages/OverviewPage.jsx';
import EntryPage from './pages/EntryPage.jsx';
import BrowsePage from './pages/BrowsePage.jsx';
import RemindersPage from './pages/RemindersPage.jsx';
import BackupPage from './pages/BackupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <nav className="topnav" aria-label="Main navigation">
          <NavLink to="/">Overview</NavLink>
          <NavLink to="/entry/2026-10-12">Entry</NavLink>
          <NavLink to="/browse">Browse</NavLink>
          <NavLink to="/reminders">Reminders</NavLink>
          <NavLink to="/backup">Backup</NavLink>
          <NavLink to="/login">Login</NavLink>
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/entry/:date" element={<EntryPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/reminders" element={<RemindersPage />} />
          <Route path="/backup" element={<BackupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
