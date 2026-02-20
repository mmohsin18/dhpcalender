
import React, { useState, useEffect, useMemo } from 'react';
import Navigation from './components/Navigation';
import StatusBadge from './components/StatusBadge';
import { ContentItem, PostStatus, Priority, Note } from './types';
import { INITIAL_DATA } from './constants';
import { generateCaption } from './services/geminiService';

const App: React.FC = () => {
  const [data, setData] = useState<ContentItem[]>(() => {
    try {
      const saved = localStorage.getItem('nsu_content_calendar_v2');
      return saved ? JSON.parse(saved) : INITIAL_DATA;
    } catch (e) {
      console.error("Failed to load calendar data", e);
      return INITIAL_DATA;
    }
  });
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem('nsu_content_notes');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load notes", e);
      return [];
    }
  });
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'notes' | 'list'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [noteSearchQuery, setNoteSearchQuery] = useState('');

  // Calendar State
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    localStorage.setItem('nsu_content_calendar_v2', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('nsu_content_notes', JSON.stringify(notes));
  }, [notes]);

  const weekTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return data.filter(item => {
      const itemDate = new Date(item.postDate);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate >= today;
    }).sort((a, b) => {
      const dateTimeA = new Date(`${a.postDate}T${a.time || '00:00'}`).getTime();
      const dateTimeB = new Date(`${b.postDate}T${b.time || '00:00'}`).getTime();
      return dateTimeA - dateTimeB;
    });
  }, [data]);

  // Calendar Logic
  const calendarDays = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Padding for start of week
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }, [calendarDate]);

  const tasksForSelectedDate = useMemo(() => {
    if (!selectedCalendarDate) return [];
    return data
      .filter(item => item.postDate === selectedCalendarDate)
      .sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));
  }, [data, selectedCalendarDate]);

  const filteredNotes = useMemo(() => {
    if (!noteSearchQuery.trim()) return notes;
    const query = noteSearchQuery.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(query) || 
      note.content.toLowerCase().includes(query)
    );
  }, [notes, noteSearchQuery]);

  const saveItem = (item: ContentItem) => {
    if (editingItem) {
      setData(data.map(i => i.id === editingItem.id ? { ...item, id: editingItem.id } : i));
    } else {
      setData([...data, { ...item, id: Math.random().toString(36).substr(2, 9) }]);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const saveNote = (note: Note) => {
    if (editingNote) {
      setNotes(notes.map(n => n.id === editingNote.id ? { ...note, id: editingNote.id } : n));
    } else {
      setNotes([...notes, { ...note, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() }]);
    }
    setIsNoteModalOpen(false);
    setEditingNote(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`Uploading: ${file.name} to Cloud Storage...`);
    }
  };

  const changeMonth = (offset: number) => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + offset, 1));
  };

  const getCardStatusStyles = (status: PostStatus) => {
    switch (status) {
      case PostStatus.Posted:
        return 'bg-green-500/10 border-green-500/20 text-white';
      case PostStatus.Ongoing:
        return 'bg-amber-500/10 border-amber-500/20 text-white';
      case PostStatus.Done:
        return 'bg-blue-500/10 border-blue-500/20 text-white';
      case PostStatus.NotStarted:
        return 'bg-slate-500/10 border-slate-500/20 text-white/90';
      default:
        return 'bg-[#1c1f26] border-white/5 text-white/90';
    }
  };

  return (
    <div className="pb-32 min-h-screen bg-[#0f1115] text-white">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        openNewTask={() => { 
            if (activeTab === 'notes') {
                setEditingNote(null);
                setIsNoteModalOpen(true);
            } else {
                setEditingItem(null);
                setIsModalOpen(true);
            }
        }} 
      />

      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex justify-between items-center">
        <h1 className="text-4xl font-light">Manage<br /><span className="font-bold">your tasks ✏️</span></h1>
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=NsuDhp" alt="User" />
        </div>
      </header>

      <main className="px-6 space-y-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Upcoming Tasks</h2>
              <button onClick={() => setActiveTab('list')} className="text-white/40 text-sm">View all</button>
            </div>
            
            {weekTasks.length === 0 ? (
              <div className="glass rounded-[2.5rem] p-12 text-center text-white/40">
                No upcoming tasks.
              </div>
            ) : (
              weekTasks.slice(0, 5).map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                  className={`relative p-8 rounded-[2.5rem] transition-all active:scale-95 cursor-pointer shadow-xl border ${getCardStatusStyles(item.status)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase opacity-60 tracking-widest">{item.project || 'General'}</span>
                    <StatusBadge status={item.status} compact />
                  </div>
                  <h3 className="text-2xl font-bold leading-tight mb-6">{item.title}</h3>
                  <div className="flex items-center space-x-6 opacity-80 text-sm font-medium">
                    <span className="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span>{new Date(item.postDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                    </span>
                    {item.time && (
                      <span className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{item.time}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold">{calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
              <div className="flex space-x-2">
                <button onClick={() => changeMonth(-1)} className="p-3 bg-white/5 rounded-2xl active:bg-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={() => changeMonth(1)} className="p-3 bg-white/5 rounded-2xl active:bg-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-[10px] font-bold text-white/30 uppercase tracking-widest py-2">
                  {day}
                </div>
              ))}
              {calendarDays.map((date, i) => {
                if (!date) return <div key={`empty-${i}`} className="aspect-square" />;
                
                const dateISO = date.toISOString().split('T')[0];
                const isSelected = selectedCalendarDate === dateISO;
                const dailyTasks = data.filter(d => d.postDate === dateISO);
                const isToday = new Date().toISOString().split('T')[0] === dateISO;

                return (
                  <button 
                    key={dateISO} 
                    onClick={() => setSelectedCalendarDate(dateISO)}
                    className={`aspect-square rounded-2xl relative flex flex-col items-center justify-center transition-all ${
                      isSelected ? 'bg-white text-black scale-105 shadow-xl' : 'bg-white/5 text-white/80 hover:bg-white/10'
                    } ${isToday && !isSelected ? 'ring-2 ring-white/20' : ''}`}
                  >
                    <span className="text-sm font-bold">{date.getDate()}</span>
                    {dailyTasks.length > 0 && (
                      <div className="absolute bottom-2 flex space-x-0.5">
                        {dailyTasks.slice(0, 3).map((t, idx) => (
                           <div key={idx} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-black' : 
                             t.status === PostStatus.Posted ? 'bg-green-400' : 
                             t.status === PostStatus.Ongoing ? 'bg-amber-400' : 'bg-blue-400'}`} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedCalendarDate && (
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="font-bold text-lg">
                  {new Date(selectedCalendarDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
                </h3>
                {tasksForSelectedDate.length === 0 ? (
                  <p className="text-white/30 text-sm">No tasks planned for this day.</p>
                ) : (
                  tasksForSelectedDate.map(item => (
                    <div key={item.id} onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="flex items-center space-x-4 bg-white/5 p-5 rounded-[2rem] border border-white/5 active:bg-white/10 transition-colors">
                      <StatusBadge status={item.status} compact />
                      <div className="flex-1">
                        <p className="font-bold text-base">{item.title}</p>
                        <p className="text-xs text-white/40 font-medium">{item.time || 'Anytime'} • {item.project || 'General'}</p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                  ))
                )}
                <button 
                  onClick={() => { setEditingItem(null); setIsModalOpen(true); }} 
                  className="w-full py-4 border-2 border-dashed border-white/10 rounded-[2rem] text-white/40 text-sm font-bold hover:bg-white/5 transition-all"
                >
                  + Add Post for this Date
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Meeting Notes</h2>
                    <button onClick={() => { setEditingNote(null); setIsNoteModalOpen(true); }} className="text-blue-400 text-sm font-bold">New Note</button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Search notes..." 
                    value={noteSearchQuery}
                    onChange={(e) => setNoteSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-4 pl-12 pr-6 text-sm outline-none focus:border-white/20 transition-all placeholder:text-white/20"
                  />
                </div>

                {filteredNotes.length === 0 ? (
                    <div className="glass rounded-[2.5rem] p-12 text-center text-white/40">
                        {noteSearchQuery ? 'No notes matching your search.' : 'Capture quick notes for the department here.'}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredNotes.map(note => (
                            <div key={note.id} onClick={() => { setEditingNote(note); setIsNoteModalOpen(true); }} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] active:scale-95 transition-transform">
                                <h3 className="font-bold text-lg mb-2">{note.title}</h3>
                                <p className="text-sm text-white/50 line-clamp-2 mb-4 leading-relaxed">{note.content}</p>
                                <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {activeTab === 'list' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">All Content</h2>
            <div className="space-y-3">
              {data.sort((a,b) => {
                const dateTimeA = new Date(`${a.postDate}T${a.time || '00:00'}`).getTime();
                const dateTimeB = new Date(`${b.postDate}T${b.time || '00:00'}`).getTime();
                return dateTimeA - dateTimeB;
              }).map(item => (
                <div key={item.id} onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="flex items-center space-x-4 bg-white/5 p-5 rounded-[2rem] border border-white/5 active:bg-white/10 transition-colors">
                  <StatusBadge status={item.status} compact />
                  <div className="flex-1">
                    <p className="font-bold text-base">{item.title}</p>
                    <p className="text-xs text-white/40 font-medium">{item.postDate} {item.time} • {item.project || 'General'}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* TASK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-[#0f1115] p-6 overflow-y-auto animate-in slide-in-from-bottom duration-300">
          <header className="flex justify-between items-center mb-10">
            <button onClick={() => setIsModalOpen(false)} className="text-white/40 font-medium">Cancel</button>
            <h2 className="text-lg font-bold">{editingItem ? 'Edit Task' : 'New Task'}</h2>
            <button form="task-form" type="submit" className="text-blue-400 font-bold px-4 py-2 bg-blue-400/10 rounded-xl">Done</button>
          </header>

          <form id="task-form" className="space-y-8" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              saveItem({
                id: editingItem?.id || '',
                project: formData.get('project') as string,
                title: formData.get('title') as string,
                caption: formData.get('caption') as string,
                postDate: formData.get('postDate') as string,
                time: formData.get('time') as string,
                status: formData.get('status') as PostStatus,
                priority: formData.get('priority') as Priority,
              });
          }}>
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Post Title</label>
              <input name="title" defaultValue={editingItem?.title} required placeholder="Title as you want it" className="w-full bg-white/10 border border-white/10 rounded-2xl p-6 text-xl font-bold text-white outline-none focus:border-white/20 transition-all placeholder:text-white/20" />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Project Category</label>
                </div>
                <input name="project" defaultValue={editingItem?.project} placeholder="e.g. TA recruitment" className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none placeholder:text-white/20" />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Caption / Details</label>
                    <button type="button" onClick={async () => {
                            const titleInput = document.getElementsByName('title')[0] as HTMLInputElement;
                            if(!titleInput.value) return alert('Enter title first');
                            setIsGenerating(true);
                            const text = await generateCaption(titleInput.value, 'History & Philosophy');
                            (document.getElementsByName('caption')[0] as HTMLTextAreaElement).value = text;
                            setIsGenerating(false);
                        }} className="text-blue-400 text-xs font-bold">✨ Gemini Magic</button>
                </div>
                <textarea name="caption" defaultValue={editingItem?.caption} rows={5} placeholder="What goes in the post?" className="w-full bg-white/10 border border-white/10 rounded-2xl p-6 text-sm text-white outline-none resize-none leading-relaxed placeholder:text-white/20" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Due Date</label>
                <input type="date" name="postDate" defaultValue={editingItem?.postDate || selectedCalendarDate} required className="w-full bg-white/10 border border-white/10 rounded-2xl p-5 text-sm text-white outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Due Time</label>
                <input type="time" name="time" defaultValue={editingItem?.time} className="w-full bg-white/10 border border-white/10 rounded-2xl p-5 text-sm text-white outline-none" />
              </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Status & Priority</label>
                <div className="grid grid-cols-2 gap-3">
                    <select name="status" defaultValue={editingItem?.status || PostStatus.NotStarted} className="bg-[#1c1f26] text-white border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-white/30 transition-all appearance-none cursor-pointer">
                        {Object.values(PostStatus).map(s => <option key={s} value={s} className="bg-[#1c1f26] text-white">{s}</option>)}
                    </select>
                    <select name="priority" defaultValue={editingItem?.priority || Priority.Medium} className="bg-[#1c1f26] text-white border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-white/30 transition-all appearance-none cursor-pointer">
                        {Object.values(Priority).map(p => <option key={p} value={p} className="bg-[#1c1f26] text-white">{p}</option>)}
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Drive Attachments</label>
                <label className="w-full h-24 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer active:bg-white/10 transition-colors">
                    <input type="file" className="hidden" onChange={handleFileUpload} />
                    <span className="text-3xl text-white/20 mb-1">+</span>
                    <span className="text-[10px] text-white/20 font-bold uppercase">Upload File</span>
                </label>
            </div>
            
            {editingItem && (
                <button type="button" onClick={() => { if(confirm('Delete?')) { setData(data.filter(i => i.id !== editingItem.id)); setIsModalOpen(false); }}} className="w-full py-5 text-red-500 font-bold text-sm bg-red-500/10 rounded-2xl">Delete Content</button>
            )}
          </form>
        </div>
      )}

      {/* NOTE MODAL */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-[100] bg-[#0f1115] p-6 overflow-y-auto animate-in slide-in-from-bottom duration-300">
          <header className="flex justify-between items-center mb-10">
            <button onClick={() => setIsNoteModalOpen(false)} className="text-white/40 font-medium">Cancel</button>
            <h2 className="text-lg font-bold">{editingNote ? 'Edit Note' : 'New Note'}</h2>
            <button form="note-form" type="submit" className="text-blue-400 font-bold px-4 py-2 bg-blue-400/10 rounded-xl">Save</button>
          </header>

          <form id="note-form" className="space-y-8" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              saveNote({
                id: editingNote?.id || '',
                title: formData.get('title') as string,
                content: formData.get('content') as string,
                createdAt: editingNote?.createdAt || new Date().toISOString()
              });
          }}>
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Note Title</label>
              <input name="title" defaultValue={editingNote?.title} required placeholder="Meeting / Idea Title" className="w-full bg-white/10 border border-white/10 rounded-2xl p-6 text-xl font-bold text-white outline-none placeholder:text-white/20" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Notes</label>
              <textarea name="content" defaultValue={editingNote?.content} rows={12} placeholder="Write your thoughts..." className="w-full bg-white/10 border border-white/10 rounded-2xl p-6 text-sm text-white outline-none resize-none leading-relaxed placeholder:text-white/20" />
            </div>

            {editingNote && (
                <button type="button" onClick={() => { if(confirm('Delete?')) { setNotes(notes.filter(n => n.id !== editingNote.id)); setIsNoteModalOpen(false); }}} className="w-full py-5 text-red-500 font-bold text-sm bg-red-500/10 rounded-2xl">Delete Note</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
