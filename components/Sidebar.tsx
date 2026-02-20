
import React from 'react';

interface SidebarProps {
    activeTab: 'dashboard' | 'calendar' | 'list';
    setActiveTab: (tab: 'dashboard' | 'calendar' | 'list') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const NavItem = ({ id, icon, label }: { id: typeof activeTab, icon: string, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
        activeTab === id 
        ? 'bg-[#002855] text-white shadow-lg' 
        : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <aside className="w-64 bg-white h-screen border-r border-slate-200 flex flex-col p-6 fixed left-0 top-0">
      <div className="mb-10 flex items-center space-x-3 px-2">
        <div className="w-10 h-10 bg-[#002855] rounded-lg flex items-center justify-center text-white font-bold text-xl italic">
            N
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[#002855] text-lg leading-tight">NSU DHP</span>
          <span className="text-xs text-slate-400 font-medium">Content Manager</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem id="dashboard" icon="📊" label="Dashboard" />
        <NavItem id="calendar" icon="📅" label="Calendar View" />
        <NavItem id="list" icon="📝" label="Content List" />
      </nav>

      <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-center space-x-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cloud Status</span>
        </div>
        <div className="flex flex-col space-y-1">
            <span className="text-xs text-slate-400">Synced to Google Sheets</span>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#EAAA00] w-[95%]"></div>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
