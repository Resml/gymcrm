import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export function Members() {
  const [showAdd, setShowAdd] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const { token } = useAuth();

  // Form state
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [planMonths, setPlanMonths] = useState('1');

  // Messaging state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, [token]);

  const fetchMembers = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:3000/api/members', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (e) {
      console.error('Failed to fetch members');
    }
  };

  // --- Selection Logic ---
  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === members.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(members.map(m => m.id));
    }
  };

  // --- Manual WhatsApp Send ---
  const handleSendMessage = async () => {
    if (!messageText.trim() || selectedIds.length === 0) return;
    setIsSending(true);
    try {
      const res = await fetch('http://localhost:3000/api/whatsapp/send-manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ memberIds: selectedIds, message: messageText })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`✅ Sent: ${data.sent} | ❌ Failed: ${data.failed}`);
        setSelectedIds([]);
        setMessageText('');
        setShowMessageBox(false);
      } else {
        alert(`Error: ${data.message || 'Message limit exceeded or network error.'}`);
      }
    } catch (e) {
      alert('Network error. Is the backend running?');
    } finally {
      setIsSending(false);
    }
  };

  // --- CSV Bulk Upload ---
  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const parsedMembers = lines.slice(1).map(line => {
          const [name, phone, date] = line.split(',');
          return { name: name?.trim() || 'Imported User', phone: phone?.trim() || '', date: date?.trim() || '' };
        }).filter(m => m.phone !== '');

        if (parsedMembers.length === 0) {
          alert('No valid members parsed. Format must be: Name,Phone,Date');
          return;
        }
        const res = await fetch('http://localhost:3000/api/members/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ members: parsedMembers })
        });
        if (res.ok) {
          alert(`✅ Successfully imported ${parsedMembers.length} members!`);
          fetchMembers();
        } else {
          alert('Backend rejected import. Ensure data is clean.');
        }
      } catch {
        alert('Fatal error parsing CSV.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // --- Add Single Member ---
  const handleRenew = async (memberId: string) => {
    const months = prompt('Renew for how many months? (1, 3, or 12)', '1');
    if (!months) return;
    try {
      const res = await fetch(`http://localhost:3000/api/members/${memberId}/renew`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ planMonths: months })
      });
      if (res.ok) {
        alert('Membership renewed successfully!');
        fetchMembers();
      } else {
        alert('Renewal failed. Try again.');
      }
    } catch {
      alert('Network error during renewal.');
    }
  };

  const getMemberStatus = (endDate: string | undefined) => {
    if (!endDate) return { label: 'No Plan', color: 'var(--color-text-muted)' };
    const end = new Date(endDate);
    const now = new Date();
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0)  return { label: 'Expired',       color: 'var(--color-danger)' };
    if (diffDays <= 7) return { label: `Exp. in ${diffDays}d`, color: 'var(--color-warning)' };
    return { label: 'Active', color: 'var(--color-success)' };
  };

  const handleAddMember = async () => {
    try {
      await fetch('http://localhost:3000/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, phoneNumber, planMonths })
      });
      setShowAdd(false);
      setName(''); setPhoneNumber(''); setPlanMonths('1');
      fetchMembers();
    } catch {
      alert('Failed to add member');
    }
  };

  const allSelected = members.length > 0 && selectedIds.length === members.length;

  return (
    <div>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-xl)' }}>
        <div>
          <h1 className="u-display-title">Members</h1>
          <p className="u-metric-label">Manage client database</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {selectedIds.length > 0 && (
            <button
              className="btn-raw btn-raw--solid"
              style={{ background: 'var(--color-accent-volt)', color: '#000' }}
              onClick={() => setShowMessageBox(!showMessageBox)}
            >
              💬 Message {selectedIds.length} Selected
            </button>
          )}
          <label className="btn-raw btn-raw--solid" style={{ cursor: 'pointer', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}>
            📂 Upload CSV
            <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleBulkUpload} />
          </label>
          <button onClick={() => setShowAdd(!showAdd)} className="btn-raw btn-raw--solid">
            {showAdd ? 'Cancel' : '+ Add Member'}
          </button>
        </div>
      </div>

      {/* WhatsApp Message Panel */}
      {showMessageBox && (
        <div style={{
          background: 'var(--color-surface-2)',
          border: '1px solid var(--color-accent-volt)',
          borderLeft: '4px solid var(--color-accent-volt)',
          padding: 'var(--space-lg)',
          marginBottom: 'var(--space-xl)',
          borderRadius: '4px'
        }}>
          <h3 style={{ marginBottom: 'var(--space-md)', fontFamily: 'var(--font-display)', color: 'var(--color-accent-volt)' }}>
            📱 WhatsApp Message — {selectedIds.length} Recipient{selectedIds.length > 1 ? 's' : ''}
          </h3>
          <textarea
            className="raw-input"
            placeholder="Type your message here... (e.g. 'Your membership expires in 3 days. Renew today!')"
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            rows={4}
            style={{ width: '100%', resize: 'vertical', marginBottom: 'var(--space-md)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}
          />
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button
              className="btn-raw btn-raw--solid"
              style={{ background: isSending ? 'var(--color-surface-3)' : 'var(--color-accent-volt)', color: '#000', minWidth: '140px' }}
              onClick={handleSendMessage}
              disabled={isSending || !messageText.trim()}
            >
              {isSending ? 'Sending...' : '⚡ Send Now'}
            </button>
            <button
              className="btn-raw btn-raw--solid"
              style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
              onClick={() => { setShowMessageBox(false); setMessageText(''); }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Member Form */}
      {showAdd && (
        <div style={{ background: 'var(--color-surface-2)', padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)', borderLeft: '4px solid var(--color-accent-volt)' }}>
          <h3 style={{ marginBottom: 'var(--space-md)' }}>New Member Profile</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <input type="text" className="raw-input" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
            <input type="text" className="raw-input" placeholder="Phone (e.g. 919876543210)" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
            <select className="raw-input" value={planMonths} onChange={e => setPlanMonths(e.target.value)}>
              <option value="1">1 Month - Premium</option>
              <option value="3">3 Months - Pro</option>
              <option value="12">12 Months - Elite</option>
            </select>
            <button className="btn-raw btn-raw--solid" onClick={handleAddMember}>Save Member</button>
          </div>
        </div>
      )}

      {/* Members Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--color-border)', backgroundColor: 'var(--color-surface-1)' }}>
            <th style={{ padding: 'var(--space-md)', width: '40px' }}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                title="Select All"
                style={{ cursor: 'pointer', accentColor: 'var(--color-accent-volt)', width: '16px', height: '16px' }}
              />
            </th>
            <th style={{ padding: 'var(--space-md)', fontFamily: 'var(--font-display)' }}>Name</th>
            <th style={{ padding: 'var(--space-md)', fontFamily: 'var(--font-display)' }}>Phone</th>
            <th style={{ padding: 'var(--space-md)', fontFamily: 'var(--font-display)' }}>Status</th>
            <th style={{ padding: 'var(--space-md)', fontFamily: 'var(--font-display)' }}>Active Until</th>
            <th style={{ padding: 'var(--space-md)', fontFamily: 'var(--font-display)' }}>Actions</th>
          </tr>
        </thead>
        <tbody style={{ fontFamily: 'var(--font-mono)' }}>
          {members.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: 'var(--space-md)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                No members found. Add your first member or upload a CSV roster.
              </td>
            </tr>
          )}
          {members.map(member => {
            const isSelected = selectedIds.includes(member.id);
            const endDate = member.memberships?.[0]?.endDate;
            const status = getMemberStatus(endDate);
            return (
              <tr
                key={member.id}
                style={{ borderBottom: '1px solid var(--color-border)', background: isSelected ? 'rgba(204,255,0,0.05)' : 'transparent', transition: 'background 0.15s ease' }}
              >
                <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                  <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(member.id)} style={{ cursor: 'pointer', accentColor: 'var(--color-accent-volt)', width: '16px', height: '16px' }} />
                </td>
                <td style={{ padding: 'var(--space-sm) var(--space-md)', fontWeight: 600 }}>{member.name}</td>
                <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{member.phoneNumber}</td>
                <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 600, background: `${status.color}18`, color: status.color }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: status.color, display: 'inline-block' }} />
                    {status.label}
                  </span>
                </td>
                <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                  {endDate ? new Date(endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                </td>
                <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                  <button
                    onClick={() => handleRenew(member.id)}
                    className="btn btn--ghost btn--sm"
                    style={{ cursor: 'pointer' }}
                  >
                    Renew
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
