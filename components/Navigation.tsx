
import React from 'react';

interface NavigationProps {
    activeTab: 'dashboard' | 'calendar' | 'notes' | 'list';
    setActiveTab: (tab: 'dashboard' | 'calendar' | 'notes' | 'list') => void;
    openNewTask: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, openNewTask }) => {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-md glass rounded-full px-2 py-3 flex items-center justify-between z-50 shadow-2xl">
      <button onClick={() => setActiveTab('dashboard')} className={`p-3 rounded-full transition-all flex-1 flex justify-center ${activeTab === 'dashboard' ? 'bg-white text-black' : 'text-white/60'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
      </button>
      <button onClick={() => setActiveTab('calendar')} className={`p-3 rounded-full transition-all flex-1 flex justify-center ${activeTab === 'calendar' ? 'bg-white text-black' : 'text-white/60'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </button>
      
      <button onClick={openNewTask} className="bg-white text-black p-4 rounded-full -mt-10 shadow-lg active:scale-95 transition-transform border-4 border-[#0f1115] mx-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
      </button>

      <button onClick={() => setActiveTab('notes')} className={`p-3 rounded-full transition-all flex-1 flex justify-center ${activeTab === 'notes' ? 'bg-white text-black' : 'text-white/60'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
      </button>
      <button onClick={() => setActiveTab('list')} className={`p-3 rounded-full transition-all flex-1 flex justify-center ${activeTab === 'list' ? 'bg-white text-black' : 'text-white/60'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
      </button>
    </nav>
  );
};

export default Navigation;
