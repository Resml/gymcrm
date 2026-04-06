import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Megaphone, Settings, LogOut, Zap } from 'lucide-react';
import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';
import { Campaigns } from './pages/Campaigns';
import { Settings as SettingsPage } from './pages/Settings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Landing } from './pages/Landing';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const NAV_ITEMS = [
  { to: '/dashboard',           label: 'Overview',   icon: LayoutDashboard, end: true },
  { to: '/dashboard/members',   label: 'Members',    icon: Users },
  { to: '/dashboard/campaigns', label: 'Broadcast',  icon: Megaphone },
  { to: '/dashboard/settings',  label: 'Settings',   icon: Settings },
];

function DashboardLayout() {
  const { gymName, logout } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: '240px',
        minWidth: '240px',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-surface-1)',
        padding: '0',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}>

        {/* Brand */}
        <div style={{ padding: 'var(--space-lg) var(--space-md)', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ background: 'var(--color-accent-volt)', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="#000" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-main)' }}>
              GymCRM
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', paddingLeft: '42px' }}>
            {gymName ?? 'Platform'}
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: 'var(--space-md) var(--space-sm)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.5rem 0.75rem 0.25rem', marginBottom: '4px' }}>
            Navigation
          </div>
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Status + Logout */}
        <div style={{ padding: 'var(--space-md)', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem', marginBottom: 'var(--space-sm)', borderRadius: 'var(--radius-sm)', background: 'rgba(204,255,0,0.05)' }}>
            <span className="volt-dot" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-accent-volt)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Connected
            </span>
          </div>
          <button
            onClick={logout}
            className="btn btn--ghost btn--full"
            style={{ justifyContent: 'flex-start', gap: '0.5rem', color: 'var(--color-danger)', borderColor: 'rgba(239,68,68,0.3)' }}
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, overflowY: 'auto', minHeight: '100vh' }}>
        <div style={{ padding: 'var(--space-xl)', maxWidth: '1200px' }} className="anim-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="members" element={<Members />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
