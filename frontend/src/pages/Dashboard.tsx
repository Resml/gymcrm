import { useState, useEffect } from 'react';
import { Users, AlertTriangle, Send, Activity, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ total: 0, active: 0, expired: 0, expiringInWeek: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/members/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const RECENT_ACTIVITY = [
    { name: 'Arjun Sharma',  action: 'Membership Expired',        time: '15 mins ago', status: 'danger' },
    { name: 'Priya Patel',   action: 'New 12-Month Signup',       time: '32 mins ago', status: 'success' },
    { name: 'Rahul Gupta',   action: 'Renewal Payment Received',  time: '1 hr ago',    status: 'success' },
    { name: 'Meera Singh',   action: 'Expiring in 3 Days',        time: '2 hrs ago',   status: 'warning' },
    { name: 'Vikram Rao',    action: 'WhatsApp Reminder Sent',    time: '3 hrs ago',   status: 'volt' },
  ];

  const Skeleton = () => (
    <span style={{ display: 'inline-block', width: '80px', height: '2.8rem', background: 'var(--color-surface-3)', borderRadius: '6px', animation: 'pulse 1.5s ease-in-out infinite' }} />
  );

  return (
    <div className="anim-fade-in">
      {/* ── Page Header ── */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-xl)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="volt-dot" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-accent-volt)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Live · All systems connected
            </span>
          </div>
          <h1 className="u-display-title">Overview</h1>
        </div>
        <button className="btn btn--outline" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Activity size={15} />
          Force Sync
        </button>
      </header>

      {/* ── Bento Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>

        <div className="card" style={{ borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
            <div style={{ background: 'rgba(204,255,0,0.1)', borderRadius: 'var(--radius-md)', padding: '10px' }}>
              <Users size={18} color="var(--color-accent-volt)" />
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', color: 'var(--color-success)', fontFamily: 'var(--font-mono)' }}>
              <TrendingUp size={11} /> Live
            </span>
          </div>
          {loading ? <Skeleton /> : <div className="u-metric">{stats.total.toLocaleString()}</div>}
          <div className="u-metric-label" style={{ marginTop: '6px' }}>Total Members</div>
        </div>

        <div className="card" style={{ borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
            <div style={{ background: 'rgba(34,197,94,0.1)', borderRadius: 'var(--radius-md)', padding: '10px' }}>
              <CheckCircle size={18} color="var(--color-success)" />
            </div>
            <span className="badge badge--success">Active</span>
          </div>
          {loading ? <Skeleton /> : <div className="u-metric" style={{ color: 'var(--color-success)' }}>{stats.active.toLocaleString()}</div>}
          <div className="u-metric-label" style={{ marginTop: '6px' }}>Active Members</div>
        </div>

        <div className="card card--danger" style={{ borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
            <div style={{ background: 'rgba(239,68,68,0.1)', borderRadius: 'var(--radius-md)', padding: '10px' }}>
              <AlertTriangle size={18} color="var(--color-danger)" />
            </div>
            <span className="badge badge--danger">Action</span>
          </div>
          {loading ? <Skeleton /> : <div className="u-metric" style={{ color: 'var(--color-danger)' }}>{stats.expired}</div>}
          <div className="u-metric-label" style={{ marginTop: '6px' }}>Expired</div>
        </div>

        <div className="card card--volt" style={{ borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
            <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-md)', padding: '10px' }}>
              <Send size={18} color="#000" />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(0,0,0,0.55)', background: 'rgba(0,0,0,0.1)', borderRadius: '999px', padding: '2px 8px' }}>7 days</span>
          </div>
          {loading ? <div style={{ height: '2.8rem', background: 'rgba(0,0,0,0.15)', borderRadius: '6px' }} /> : <div className="u-metric" style={{ color: '#000' }}>{stats.expiringInWeek}</div>}
          <div className="u-metric-label" style={{ color: 'rgba(0,0,0,0.65)', marginTop: '6px' }}>Expiring Soon</div>
        </div>
      </div>

      {/* ── Bottom Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-lg)' }}>

        {/* Activity Feed */}
        <div className="card" style={{ borderRadius: 'var(--radius-xl)', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700 }}>Recent Activity</h3>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Today</span>
          </div>
          {RECENT_ACTIVITY.map((item, i) => (
            <div key={i}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-md) var(--space-lg)', borderBottom: i < RECENT_ACTIVITY.length - 1 ? '1px solid var(--color-border)' : 'none', cursor: 'default', transition: 'background var(--transition-fast)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, background: item.status === 'danger' ? 'var(--color-danger)' : item.status === 'success' ? 'var(--color-success)' : item.status === 'warning' ? 'var(--color-warning)' : 'var(--color-accent-volt)' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{item.action}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                <Clock size={10} />{item.time}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className="card" style={{ borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', marginBottom: 'var(--space-sm)' }}>Quick Action</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-sub)', marginBottom: 'var(--space-md)', lineHeight: 1.6 }}>
              {stats.expired > 0 ? `${stats.expired} memberships expired. Send WhatsApp reminders now.` : 'No urgent expirations. All members are active!'}
            </p>
            <button className="btn btn--danger btn--full" disabled={stats.expired === 0}>
              <AlertTriangle size={14} />
              Send {stats.expired} Reminders
            </button>
          </div>

          <div className="card" style={{ borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', marginBottom: 'var(--space-md)' }}>WhatsApp Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'API Connection', value: 'Online' },
                { label: 'Daily Limit',    value: '100K / day' },
                { label: 'Expiring (7d)',  value: String(stats.expiringInWeek) },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{row.label}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--color-success)' }}>
                    <CheckCircle size={10} />{row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
