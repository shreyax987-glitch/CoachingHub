import React, { useState } from 'react';
import { 
  preSeededNCERTData, 
  NCERT_CLASSES, 
  NCERT_SUBJECTS 
} from './utils/ncertSeeder';
import { 
  initialStudents, 
  initialBatches, 
  initialTransactions, 
  initialLeaveRequests, 
  initialChatMessages, 
  initialCommunityNotices, 
  initialRevisionMaterials 
} from './mockData';
import { NCERTGrade, Student, Batch, FeeTransaction, LeaveRequest, ChatMessage, CommunityNotice, RevisionMaterials } from './types';
import NCERTDirectoryViewer from './components/NCERTDirectoryViewer';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';
import ParentDashboard from './components/ParentDashboard';
import OfflineSyncBanner from './components/OfflineSyncBanner';
import { 
  Users, BookOpen, ShieldCheck, Cpu, Smartphone, Monitor, Info, Sparkles, CheckCircle2, AlertCircle 
} from 'lucide-react';

export default function App() {
  // Roles list
  const roles = [
    { id: 'TEACHER', label: 'Teacher', sub: 'Rajesh Kumar' },
    { id: 'ADMIN', label: 'Administrator', sub: 'Anjali Sharma' },
    { id: 'PARENT', label: 'Parent Portal', sub: 'Soumya Pathak' }
  ] as const;

  const [activeRole, setActiveRole] = useState<'TEACHER' | 'ADMIN' | 'PARENT'>('TEACHER');

  // Global Core State Machines
  const [curriculum, setCurriculum] = useState<{ [grade: string]: NCERTGrade }>(preSeededNCERTData);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [batches] = useState<Batch[]>(initialBatches);
  const [transactions, setTransactions] = useState<FeeTransaction[]>(initialTransactions);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [communityNotices, setCommunityNotices] = useState<CommunityNotice[]>(initialCommunityNotices);
  const [revisionMaterials, setRevisionMaterials] = useState<RevisionMaterials[]>(initialRevisionMaterials);
  const [progressNotes, setProgressNotes] = useState<any[]>([
    {
      id: 'note-init-1',
      studentId: 's1',
      studentName: 'Aarav Pathak',
      teacherId: 't1',
      teacherName: 'Rajesh Kumar',
      note: 'Aarav is showing great focus in Place Value topics. Very fast with arithmetic calculations.',
      gaps: 'Tends to skip step-by-step verification of large subtraction exercises. Needs to practice written word sums.',
      timestamp: '2026-07-03 14:10:00',
      isSynced: true
    }
  ]);

  // Offline Caching & Synchronization Queue
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [offlineQueue, setOfflineQueue] = useState<{ type: string; payload: any }[]>([]);

  // Simple Notification Toast State
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);

  const triggerToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const addOfflineAction = (action: { type: string; payload: any }) => {
    setOfflineQueue(prev => [...prev, action]);
  };

  const clearOfflineQueue = () => {
    setOfflineQueue([]);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 antialiased selection:bg-indigo-100">
      
      {/* Toast Alert Banner */}
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-xl border shadow-xl bg-white animate-bounce">
          {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          {notification.type === 'info' && <Sparkles className="w-5 h-5 text-indigo-500" />}
          {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500" />}
          <span className="text-xs font-bold text-slate-800">{notification.msg}</span>
        </div>
      )}

      {/* Main Top Navigation / Branding Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-600/20">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900">
                Gurukul Tuition Hub
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Syllabus & Tuition Admin System for India Classes 1–8
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-bold mr-1">Role-Based Access Simulation:</span>
            <div className="bg-slate-100 p-1 rounded-xl border flex gap-1">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    setActiveRole(role.id);
                    triggerToast(`Switched workspace to: ${role.label} (${role.sub})`, 'info');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeRole === role.id 
                      ? 'bg-white text-slate-900 shadow-xs border-b border-slate-200' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* Offline Simulation Control Panel */}
        <section>
          <OfflineSyncBanner
            isOffline={isOffline}
            setIsOffline={setIsOffline}
            offlineQueue={offlineQueue}
            clearOfflineQueue={clearOfflineQueue}
            toast={triggerToast}
          />
        </section>

        {/* Dual-Pane View Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Simulated Smartphone Mockup Container */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full text-center mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Smartphone className="w-4 h-4 text-slate-400" /> Simulated Mobile App Viewport
              </span>
              <p className="text-[10px] text-slate-400 mt-1">
                Interact below as a typical user would on their phone.
              </p>
            </div>

            {/* Smart Phone Case Frame */}
            <div className="relative w-full max-w-[430px] bg-slate-900 rounded-[50px] p-3 shadow-2xl border-4 border-slate-800">
              {/* Camera Notch Accent */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-950 rounded-full z-10 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800/60" />
              </div>

              {/* Screen Canvas Container */}
              <div className="bg-slate-50 rounded-[40px] overflow-hidden min-h-[740px] relative border border-slate-950">
                {activeRole === 'TEACHER' && (
                  <TeacherDashboard
                    curriculum={curriculum}
                    setCurriculum={setCurriculum}
                    students={students}
                    setStudents={setStudents}
                    batches={batches}
                    progressNotes={progressNotes}
                    setProgressNotes={setProgressNotes}
                    revisionMaterials={revisionMaterials}
                    setRevisionMaterials={setRevisionMaterials}
                    isOffline={isOffline}
                    addOfflineAction={addOfflineAction}
                    toast={triggerToast}
                  />
                )}

                {activeRole === 'ADMIN' && (
                  <AdminDashboard
                    students={students}
                    setStudents={setStudents}
                    transactions={transactions}
                    setTransactions={setTransactions}
                    leaveRequests={leaveRequests}
                    setLeaveRequests={setLeaveRequests}
                    curriculum={curriculum}
                    batches={batches}
                    toast={triggerToast}
                  />
                )}

                {activeRole === 'PARENT' && (
                  <ParentDashboard
                    students={students}
                    setStudents={setStudents}
                    batches={batches}
                    progressNotes={progressNotes}
                    revisionMaterials={revisionMaterials}
                    chatMessages={chatMessages}
                    setChatMessages={setChatMessages}
                    communityNotices={communityNotices}
                    setCommunityNotices={setCommunityNotices}
                    curriculum={curriculum}
                    toast={triggerToast}
                  />
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Desktop NCERT Curriculum index & Developer Insights */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* NCERT Syllabus Panel */}
            <NCERTDirectoryViewer
              curriculum={curriculum}
              setCurriculum={setCurriculum}
            />

            {/* Educational / Architectural Context Info Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-500" /> Evaluation Architectural Insights
              </h3>
              
              <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
                <p>
                  This system combines <strong>Real NCERT textbook syllabus indexing</strong> with a local cache 
                  database simulation (`localStorage` caching mechanism) representing SQLite or Hive on client mobile apps.
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-1.5 font-medium text-slate-700">
                  <li>
                    <strong className="text-slate-800">Syllabus Completion triggers AI:</strong> Checking off topics 
                    in the teacher profile prompts action shortcuts requesting specialized server-side 
                    <strong className="text-indigo-600"> Gemini 3.5 Flash content-generation</strong> to produce revision flashcards and multiple-choice quizzes.
                  </li>
                  <li>
                    <strong className="text-slate-800">Dynamic Outstanding Recalculation:</strong> Applying discount flat or 
                    merit scholarship percentages inside the Admin Dashboard instantly updates student due indices on parent invoices.
                  </li>
                  <li>
                    <strong className="text-slate-800">Privacy Safeguards:</strong> Parents see isolated educational and 
                    financial ledgers belonging solely to their registered children, keeping data secure and isolated.
                  </li>
                </ul>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Simple Footer */}
      <footer className="border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-400 bg-white">
        <p>&copy; 2026 Gurukul Coaching Systems. Formulated on official NCERT academic directories.</p>
      </footer>

    </div>
  );
}
