import { useState } from 'react';

import { Send, Users, MessageSquare, Zap, BarChart3, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TEMPLATES = [
  { label: 'Renewal Reminder', text: `Hi {name}! 🏋️ Your gym membership expires on {date}. Renew today to keep your momentum going! Reply RENEW or visit us at the front desk.` },
  { label: 'Holiday Offer',    text: `Hi {name}! 🎉 Special offer this week — upgrade to our 12-month plan and save 20%! Limited slots available. Call us now!` },
  { label: 'Welcome Back',     text: `Hi {name}! 👋 We miss you at the gym! Come back this week and get a complimentary protein shake on us. See you soon!` },
];

export function Campaigns() {
  const [targetAudience, setTargetAudience] = useState<'all' | 'expiring'>('all');
  const [messageBody, setMessageBody] = useState(TEMPLATES[0].text);
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{ dispatched: number } | null>(null);
  const { token: jwtToken } = useAuth();

  const handleTemplate = (text: string) => setMessageBody(text);

  const handleDispatch = async () => {
    setIsSending(true);
    setResult(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/whatsapp/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwtToken}` },
        body: JSON.stringify({ target: targetAudience, message: messageBody })
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ dispatched: data.dispatched || 0 });
      } else {
        alert(data.message || 'Failed to dispatch broadcast.');
      }
    } catch {
      alert('Failed to dispatch. Is the backend running?');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="anim-fade-in">
      {/* ── Header ── */}
      <header style={{ marginBottom: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="volt-dot" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-accent-volt)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Meta Cloud API v17.0
          </span>
        </div>
        <h1 className="u-display-title">Broadcast</h1>
        <p style={{ color: 'var(--color-text-sub)', marginTop: '6px', fontSize: '0.9rem' }}>Send WhatsApp messages to your entire member base or targeted segments</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--space-lg)' }}>

        {/* ── Message Composer ── */}
        <div className="card" style={{ borderRadius: 'var(--radius-xl)', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={16} color="var(--color-accent-volt)" />
              Message Composer
            </h3>
          </div>

          <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

            {/* Target Audience */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-sub)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Target Audience
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                {(['all', 'expiring'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTargetAudience(t)}
                    className={targetAudience === t ? 'btn btn--primary' : 'btn btn--ghost'}
                    style={{ flex: 1 }}
                  >
                    {t === 'all' ? <><Users size={14} /> All Members</> : <><Clock size={14} /> Expiring (7 days)</>}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Templates */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-sub)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Quick Templates
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {TEMPLATES.map(t => (
                  <button
                    key={t.label}
                    onClick={() => handleTemplate(t.text)}
                    className="btn btn--ghost btn--sm"
                    style={{ borderRadius: '999px' }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Variables hint */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['{name}', '{date}'].map(v => (
                <span
                  key={v}
                  onClick={() => setMessageBody(prev => prev + ' ' + v)}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', padding: '3px 10px', border: '1px solid var(--color-border)', borderRadius: '999px', color: 'var(--color-accent-volt)', cursor: 'pointer', transition: 'background var(--transition-fast)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-accent-volt-dim)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {v}
                </span>
              ))}
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', alignSelf: 'center' }}>Click to insert variable</span>
            </div>

            {/* Message body */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-sub)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Message Content
              </label>
              <textarea
                className="raw-input"
                rows={6}
                value={messageBody}
                onChange={e => setMessageBody(e.target.value)}
                style={{ resize: 'vertical', fontSize: '0.95rem', lineHeight: 1.6 }}
                placeholder="Type your message here..."
              />
              <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                {messageBody.length} / 1024 chars
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: 'var(--space-lg)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {result && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ✓ Dispatched to {result.dispatched} members
              </span>
            )}
            {!result && <span />}
            <button
              className="btn btn--primary"
              onClick={handleDispatch}
              disabled={isSending || !messageBody.trim()}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.65rem 2rem' }}
            >
              {isSending ? (
                <><svg className="spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>Sending...</>
              ) : (
                <><Send size={15} />Send Broadcast</>
              )}
            </button>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>

          {/* Impact Radius */}
          <div className="card" style={{ borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', marginBottom: 'var(--space-md)' }}>
              <BarChart3 size={14} style={{ display: 'inline', marginRight: '6px' }} />
              Impact Radius
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
              <Users size={28} color="var(--color-accent-volt)" />
              <div>
                <div className="u-metric" style={{ fontSize: '2rem' }}>{targetAudience === 'all' ? 'All' : '~7d'}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  {targetAudience === 'all' ? 'All active members' : 'Members expiring within 7 days'}
                </div>
              </div>
            </div>
            <div style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)', padding: '10px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              <Zap size={11} style={{ display: 'inline', marginRight: '4px', color: 'var(--color-accent-volt)' }} />
              Message will use your configured Meta WhatsApp number
            </div>
          </div>

          {/* Previous Dispatches */}
          <div className="card" style={{ borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', marginBottom: 'var(--space-md)' }}>Previous Broadcasts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {[
                { name: 'Diwali Special Offer',  date: 'Nov 1', recipients: '1,150', rate: '99%' },
                { name: 'October Renewal Push',  date: 'Oct 15', recipients: '342',   rate: '98%' },
                { name: 'New Batch Announcement', date: 'Oct 1', recipients: '800',   rate: '100%' },
              ].map((log, i) => (
                <div key={i} style={{ padding: 'var(--space-sm) 0', borderBottom: i < 2 ? '1px solid var(--color-border)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{log.name}</span>
                    <span className="badge badge--success">{log.rate}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {log.date} · {log.recipients} recipients
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
