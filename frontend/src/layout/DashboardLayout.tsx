import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Activity, Users, MessageSquare, Settings } from 'lucide-react';
import './DashboardLayout.css';

export function DashboardLayout() {
  return (
    <div className="layout-container">
      <nav className="sidebar">
        <div className="brand">
          <Activity color="var(--color-accent-volt)" size={32} />
          <span>GYM_CRM</span>
        </div>
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Activity size={20} />
            <span>Overview</span>
          </NavLink>
          <NavLink to="/members" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Users size={20} />
            <span>Members</span>
          </NavLink>
          <NavLink to="/campaigns" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <MessageSquare size={20} />
            <span>Campaigns</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
