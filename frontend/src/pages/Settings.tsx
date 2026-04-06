import { useState, useEffect } from 'react';
import { ShieldCheck, Activity, Zap, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface QuotaInfo {
  plan: string;
  used: number;
  limit: number;
  remaining: number;
  percentUsed: number;
}

export function Settings() {
  const [quota, setQuota] = useState<QuotaInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchQuota() {
      try {
        const res = await fetch('http://localhost:3000/api/whatsapp/quota', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setQuota(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch quota', err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuota();
  }, [token]);

  return (
    <div className="anim-fade-in">
      <header style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 className="u-display-title">Billing & Usage</h1>
        <p style={{ color: 'var(--color-text-sub)', marginTop: '6px', fontSize: '0.9rem' }}>
          Manage your subscription and track WhatsApp message limits
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: 'var(--space-lg)', alignItems: 'start' }}>
        
        {/* Usage Card */}
        <div className="card" style={{ borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-lg)' }}>
            <div style={{ background: 'var(--color-accent-volt-dim)', borderRadius: '8px', padding: '8px', display: 'flex' }}>
              <Activity size={18} color="var(--color-accent-volt)" />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', marginBottom: '2px' }}>Current Month Usage</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Resets automatically at the start of the next billing cycle</p>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              Loading usage...
            </div>
          ) : quota ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)', alignItems: 'flex-end' }}>
                <div>
                  <span style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: 700, lineHeight: 1 }}>{quota.used}</span>
                  <span style={{ color: 'var(--color-text-sub)', marginLeft: '8px', fontSize: '0.9rem' }}>/ {quota.limit} msgs</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge--volt" style={{ fontSize: '0.7rem' }}>{quota.remaining} Remaining</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '8px', background: 'var(--color-surface-2)', borderRadius: '999px', overflow: 'hidden', marginBottom: 'var(--space-sm)' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    background: quota.percentUsed > 90 ? 'var(--color-danger)' : 'var(--color-accent-volt)', 
                    width: `${Math.min(100, quota.percentUsed)}%`,
                    transition: 'width 0.5s ease-out'
                  }} 
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>
                {quota.percentUsed}% of monthly limit used
              </p>
              
              {quota.percentUsed >= 100 && (
                <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-sm)' }}>
                  <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', fontWeight: 600 }}>Message limit reached!</p>
                  <p style={{ color: 'var(--color-text-sub)', fontSize: '0.8rem', marginTop: '4px' }}>You cannot send more WhatsApp messages until you upgrade your plan or wait for the next month.</p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: 'var(--space-md)', color: 'var(--color-danger)' }}>Error loading quota.</div>
          )}
        </div>

        {/* Plan Upgrade Card */}
        <div className="card" style={{ borderRadius: 'var(--radius-xl)', background: 'linear-gradient(135deg, #1a1a2e 0%, #0d1222 100%)', border: '1px solid rgba(204,255,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: '#fff' }}>Your Plan</h3>
            <span className="badge badge--volt" style={{ textTransform: 'uppercase' }}>
              {quota?.plan || 'Loading...'}
            </span>
          </div>
          
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-sub)', marginBottom: 'var(--space-lg)', lineHeight: 1.5 }}>
            You are currently on the {quota?.plan === 'free' ? 'Free tier' : `${quota?.plan} plan`}. Upgrade to increase your monthly limit and access advanced automation.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: 'var(--space-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>WhatsApp Automation</span>
              <span style={{ color: '#fff', fontWeight: 500 }}>Included</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Dedicated Number</span>
              <span style={{ color: '#fff', fontWeight: 500 }}>Included</span>
            </div>
          </div>

          <button 
            className="btn-raw btn-raw--solid" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px', background: 'var(--color-accent-volt)', color: '#000' }}
            onClick={() => alert("Payment gateway (e.g. Razorpay) would launch here!")}
          >
            <Zap size={16} /> Upgrade Plan
          </button>
        </div>

        {/* Security / Account Info spanning full width */}
        <div style={{ gridColumn: '1 / -1', marginTop: 'var(--space-md)' }} className="card">
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-lg)' }}>
            <div style={{ background: 'var(--color-surface-2)', borderRadius: '8px', padding: '8px', display: 'flex' }}>
              <ShieldCheck size={18} color="var(--color-text-main)" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>Account Information</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div style={{ padding: 'var(--space-md)', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Platform Status</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)' }}></span>
                All Systems Operational
              </div>
            </div>
            <div style={{ padding: 'var(--space-md)', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Automated Reminders</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
                <span style={{ color: 'var(--color-text-main)' }}>Runs Daily at 9:00 AM</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
