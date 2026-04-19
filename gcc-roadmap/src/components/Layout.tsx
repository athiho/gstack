import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, Rocket, Map, Users, ChevronRight } from 'lucide-react';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/initiatives', label: 'Initiatives', icon: Rocket },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
];

const BREADCRUMB_LABELS: Record<string, string> = {
  '': 'Dashboard',
  'goals': 'Goals',
  'initiatives': 'Initiatives',
  'roadmap': 'Roadmap',
};

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const segment = location.pathname.split('/').filter(Boolean)[0] ?? '';
  const label = BREADCRUMB_LABELS[segment] ?? segment;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-slate-900 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
              <Users size={16} className="text-white" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm leading-tight">GCC Roadmap</div>
              <div className="text-slate-400 text-xs">130 Headcount · 2026</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Team legend */}
        <div className="px-4 py-4 border-t border-slate-700/60">
          <div className="text-slate-500 text-xs font-medium mb-2 uppercase tracking-wider">Teams</div>
          {[
            { name: 'Engineering', count: 60, color: 'bg-blue-500' },
            { name: 'QA', count: 60, color: 'bg-purple-500' },
            { name: 'Product Support', count: 10, color: 'bg-emerald-500' },
          ].map(t => (
            <div key={t.name} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${t.color}`} />
                <span className="text-slate-400 text-xs">{t.name}</span>
              </div>
              <span className="text-slate-500 text-xs">{t.count}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="text-slate-400">GCC Roadmap</span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="font-medium text-slate-900">{label}</span>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
