import React, { useState } from 'react';
import { Student, Batch, AttendanceRecord, ProgressNote, RevisionMaterials, ChatMessage, CommunityNotice, NCERTGrade } from '../types';
import { 
  Users, BookOpen, Calendar, IndianRupee, MessageSquare, Sparkles, 
  Send, UserCheck, ShieldAlert, ChevronRight, AlertCircle, FileText, ArrowRight, HelpCircle
} from 'lucide-react';

interface ParentDashboardProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  batches: Batch[];
  progressNotes: ProgressNote[];
  revisionMaterials: RevisionMaterials[];
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  communityNotices: CommunityNotice[];
  setCommunityNotices: React.Dispatch<React.SetStateAction<CommunityNotice[]>>;
  curriculum: { [grade: string]: NCERTGrade };
  toast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export default function ParentDashboard({
  students,
  setStudents,
  batches,
  progressNotes,
  revisionMaterials,
  chatMessages,
  setChatMessages,
  communityNotices,
  setCommunityNotices,
  curriculum,
  toast,
}: ParentDashboardProps) {
  // Switcher state to handle Soumya Pathak's two children
  const [selectedStudentId, setSelectedStudentId] = useState<string>('s1'); // s1 = Aarav, s2 = Ananya
  const [activeTab, setActiveTab] = useState<'academics' | 'financials' | 'chat' | 'circle'>('academics');

  // Interactive self-serve revision viewer states
  const [activeRevisionId, setActiveRevisionId] = useState<string | null>('rev-pre-1');
  const [activeFlashcardIndex, setActiveFlashcardIndex] = useState<number>(0);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState<boolean>(false);
  const [quizScores, setQuizScores] = useState<{ [qIdx: number]: string }>({});

  // Direct chat input state
  const [newChatText, setNewChatText] = useState<string>('');

  // Community notices input state
  const [newNoticeText, setNewNoticeText] = useState<string>('');

  // Retrieve current student details
  const activeStudent = students.find(s => s.id === selectedStudentId);
  if (!activeStudent) return null;

  // Find private feedback logs for active student
  const activeFeedback = progressNotes.filter(n => n.studentId === activeStudent.id);

  // Identify student's batch and educator
  const activeBatch = batches.find(b => b.id === activeStudent.batchId);
  const teacherName = activeBatch?.teacherId === 't1' ? 'Rajesh Kumar' : 'Sneha Patel';

  // Outstanding fee invoice structure
  const totalDeductions = (activeStudent.baseFee * activeStudent.feeDiscountPercent) / 100;
  const netTuition = activeStudent.baseFee - totalDeductions;

  // Filter messages exchanged with specific batch teacher
  const filteredChats = chatMessages.filter(
    (msg) => 
      (msg.senderId === 'p1' && msg.receiverId === 't1') || 
      (msg.senderId === 't1' && msg.receiverId === 'p1')
  );

  // Direct chat submit
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;

    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      senderId: 'p1',
      senderName: 'Soumya Pathak (Parent)',
      senderRole: 'PARENT',
      receiverId: 't1', // Rajesh Kumar
      content: newChatText,
      timestamp: new Date().toISOString(),
    };

    setChatMessages(prev => [...prev, userMsg]);
    setNewChatText('');
    toast('Message sent securely to Rajesh Kumar.', 'success');

    // Simulate smart teacher automated fast reply after 2 seconds
    setTimeout(() => {
      const teacherReply: ChatMessage = {
        id: `chat-${Date.now() + 1}`,
        senderId: 't1',
        senderName: 'Rajesh Kumar (Teacher)',
        senderRole: 'TEACHER',
        receiverId: 'p1',
        content: `Pranam Soumya ji. Received your message regarding ${activeStudent.name}. I am checking our NCERT schedule and will clarify in detail shortly!`,
        timestamp: new Date().toISOString(),
      };
      setChatMessages(prev => [...prev, teacherReply]);
      toast('New reply from Rajesh Kumar!', 'info');
    }, 2500);
  };

  // Community Notice Board submit
  const handleSendNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeText.trim()) return;

    const notice: CommunityNotice = {
      id: `notice-${Date.now()}`,
      senderName: 'Soumya Pathak (Parent of Aarav)',
      senderRole: 'PARENT',
      grade: activeStudent.grade,
      content: newNoticeText,
      timestamp: new Date().toISOString(),
    };

    setCommunityNotices(prev => [notice, ...prev]);
    setNewNoticeText('');
    toast('Notice broadcasts successfully to Gurukul Batch Forum!', 'success');
  };

  // Filter revision packages generated for student's exact grade level
  const filteredRevisions = revisionMaterials.filter(
    r => r.grade === activeStudent.grade
  );

  // Filter community posts matching the student's batch Class grade
  const filteredNotices = communityNotices.filter(
    n => n.grade === activeStudent.grade
  );

  // Simulated attendance calendar days (July 1st to July 7th, 2026)
  const calendarDays = [
    { date: '2026-07-01', label: '1 Jul' },
    { date: '2026-07-02', label: '2 Jul' },
    { date: '2026-07-03', label: '3 Jul' },
    { date: '2026-07-04', label: '4 Jul (Today)' },
    { date: '2026-07-05', label: '5 Jul' },
    { date: '2026-07-06', label: '6 Jul' },
    { date: '2026-07-07', label: '7 Jul' },
  ];

  // Grade curriculum tracker for syllabus (Completed vs Pending)
  const activeGradeData = curriculum[activeStudent.grade];
  const activeSubjectName = activeBatch?.subject || 'Mathematics';
  const activeSubjectData = activeGradeData?.subjects[activeSubjectName];

  return (
    <div className="bg-slate-50 rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 max-w-lg mx-auto flex flex-col h-[740px] text-slate-800">
      
      {/* Phone Header Block with Child Switcher Toggle */}
      <div className="bg-indigo-600 text-white pt-6 pb-4 px-5 shrink-0 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-300" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-200">
              Parent Portal (Private Connection)
            </span>
          </div>
          <span className="text-[10px] bg-indigo-700 text-white font-bold px-2 py-0.5 rounded-full">
            Soumya Pathak
          </span>
        </div>

        {/* Child Selector Tabs */}
        <div className="flex items-center gap-2 bg-indigo-700/60 p-1.5 rounded-xl">
          <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider pl-1 shrink-0">Reviewing:</span>
          {students.filter(s => s.parentId === 'p1').map(std => (
            <button
              key={std.id}
              onClick={() => {
                setSelectedStudentId(std.id);
                // default to first revision if switching child
                const revisionsForChild = revisionMaterials.filter(r => r.grade === std.grade);
                if (revisionsForChild.length > 0) {
                  setActiveRevisionId(revisionsForChild[0].id);
                } else {
                  setActiveRevisionId(null);
                }
                setActiveFlashcardIndex(0);
                setIsFlashcardFlipped(false);
                setQuizScores({});
              }}
              className={`flex-1 text-center py-1 px-2.5 rounded-lg text-xs font-bold transition-all ${
                selectedStudentId === std.id 
                  ? 'bg-white text-indigo-950 shadow-xs' 
                  : 'text-indigo-100 hover:bg-indigo-700/80'
              }`}
            >
              {std.name} ({std.grade})
            </button>
          ))}
        </div>
      </div>

      {/* Internal Navigation Tab Bar */}
      <div className="bg-white border-b border-slate-200 flex justify-around py-2.5 shrink-0">
        <button
          onClick={() => setActiveTab('academics')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium transition-all ${
            activeTab === 'academics' ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Tracker & AI</span>
        </button>
        <button
          onClick={() => setActiveTab('financials')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium transition-all ${
            activeTab === 'financials' ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Dues & Dates</span>
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium transition-all ${
            activeTab === 'chat' ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Direct Chat</span>
        </button>
        <button
          onClick={() => setActiveTab('circle')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium transition-all ${
            activeTab === 'circle' ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Class Forum</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* ACADEMICS TRACKER & SELF-SERVE AI LEARNING */}
        {activeTab === 'academics' && (
          <div className="space-y-4">
            
            {/* Visual syllabus completion progress meter */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">NCERT Syllabus Tracker</h3>
              
              {activeSubjectData ? (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{activeSubjectName} Core Content</span>
                    <span className="text-[10px] text-slate-400">Class {activeStudent.grade}</span>
                  </div>

                  <div className="space-y-2">
                    {activeSubjectData.chapters.map((ch) => {
                      const completedCount = ch.topics.filter(t => t.isCompleted).length;
                      const totalCount = ch.topics.length;
                      const pct = Math.round((completedCount / totalCount) * 100);

                      return (
                        <div key={ch.id} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1.5">
                          <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                            <span>Ch {ch.number}: {ch.title}</span>
                            <span className="text-indigo-600">{pct}% Complete</span>
                          </div>
                          
                          <div className="w-full bg-slate-100 h-1 rounded-full">
                            <div className="bg-indigo-600 h-1 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>

                          <div className="flex flex-wrap gap-1 mt-1">
                            {ch.topics.map(t => (
                              <span 
                                key={t.id} 
                                className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                                  t.isCompleted 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                    : 'bg-white text-slate-400 border border-slate-200'
                                }`}
                              >
                                {t.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">Syllabus indices details unseeded.</div>
              )}
            </div>

            {/* Academic Areas identified for improvement / Private notes */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-500" /> Focus & Improvement Areas
              </h3>

              <div className="space-y-2">
                {activeFeedback.map((fb) => (
                  <div key={fb.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-indigo-700">Educator: {fb.teacherName}</span>
                      <span className="text-[9px] text-slate-400 font-mono">{fb.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Progress Observation</span>
                      {fb.note}
                    </p>

                    {fb.gaps && (
                      <div className="bg-rose-50 border border-rose-100/60 p-2.5 rounded-lg text-xs text-rose-950 flex gap-2 items-start">
                        <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[10px] text-rose-800 block uppercase tracking-wider">Identified Academic Gap</strong>
                          {fb.gaps}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {activeFeedback.length === 0 && (
                  <div className="text-center py-4 text-slate-400 text-xs italic">
                    No academic improvement flags logged. Aarav & Ananya are performing up to pace!
                  </div>
                )}
              </div>
            </div>

            {/* SELF-SERVE STUDY MATERIALS REVISION PORTAL */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3.5">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-500" /> Self-Serve revision portal
                </h3>
                <p className="text-[10px] text-slate-400">Download & test worksheets auto-generated by Teacher Rajesh</p>
              </div>

              {/* Revision selection pills */}
              {filteredRevisions.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {filteredRevisions.map(rev => (
                      <button
                        key={rev.id}
                        onClick={() => {
                          setActiveRevisionId(rev.id);
                          setActiveFlashcardIndex(0);
                          setIsFlashcardFlipped(false);
                          setQuizScores({});
                        }}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border whitespace-nowrap shrink-0 transition-all ${
                          activeRevisionId === rev.id
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {rev.topicName}
                      </button>
                    ))}
                  </div>

                  {/* Active revision viewer */}
                  {(() => {
                    const activeRevision = filteredRevisions.find(r => r.id === activeRevisionId);
                    if (!activeRevision) return null;

                    return (
                      <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 space-y-3.5">
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pb-2 border-b border-slate-100">
                          <span>Chapter: {activeRevision.chapterTitle}</span>
                          <span>Unit Study</span>
                        </div>

                        {/* Interactive Flashcard widget */}
                        {activeRevision.flashcards && activeRevision.flashcards.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Revision Flashcard ({activeFlashcardIndex + 1}/{activeRevision.flashcards.length})</span>
                            
                            {/* Flashcard Frame */}
                            <div 
                              onClick={() => setIsFlashcardFlipped(!isFlashcardFlipped)}
                              className={`h-24 bg-white border border-indigo-100/70 rounded-xl p-4 flex items-center justify-center text-center cursor-pointer select-none transition-all duration-300 relative ${
                                isFlashcardFlipped ? 'shadow-inner border-indigo-300 bg-indigo-50/20' : 'shadow-xs hover:border-indigo-300'
                              }`}
                            >
                              <div className="text-xs font-medium text-slate-700 px-2">
                                {isFlashcardFlipped 
                                  ? activeRevision.flashcards[activeFlashcardIndex].back 
                                  : activeRevision.flashcards[activeFlashcardIndex].front
                                }
                              </div>
                              <span className="absolute bottom-1.5 right-2 text-[8px] font-bold text-indigo-500 uppercase tracking-widest">
                                {isFlashcardFlipped ? 'Tap to view question' : 'Tap to flip answer'}
                              </span>
                            </div>

                            {/* Flashcard controls */}
                            <div className="flex justify-between items-center">
                              <button
                                disabled={activeFlashcardIndex === 0}
                                onClick={() => {
                                  setActiveFlashcardIndex(prev => prev - 1);
                                  setIsFlashcardFlipped(false);
                                }}
                                className="text-[10px] font-bold text-indigo-600 disabled:opacity-40"
                              >
                                Previous
                              </button>
                              <button
                                disabled={activeFlashcardIndex === activeRevision.flashcards.length - 1}
                                onClick={() => {
                                  setActiveFlashcardIndex(prev => prev + 1);
                                  setIsFlashcardFlipped(false);
                                }}
                                className="text-[10px] font-bold text-indigo-600 disabled:opacity-40"
                              >
                                Next Card
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Interactive Worksheet Questions */}
                        {activeRevision.questions && activeRevision.questions.length > 0 && (
                          <div className="space-y-3 pt-2 border-t border-slate-100">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Interactive Worksheet Quiz</span>
                            
                            <div className="space-y-3">
                              {activeRevision.questions.map((q, qIdx) => {
                                const selectedOpt = quizScores[qIdx];
                                const isCorrect = selectedOpt === q.answer;

                                return (
                                  <div key={qIdx} className="bg-white p-3 rounded-xl border border-slate-100 space-y-2">
                                    <div className="text-xs font-semibold text-slate-800">{qIdx + 1}. {q.question}</div>
                                    
                                    <div className="grid grid-cols-2 gap-1.5">
                                      {q.options?.map((opt, oIdx) => (
                                        <button
                                          key={oIdx}
                                          onClick={() => setQuizScores(prev => ({ ...prev, [qIdx]: opt }))}
                                          className={`p-2 text-[10px] rounded-lg border text-left transition-all ${
                                            selectedOpt === opt 
                                              ? opt === q.answer 
                                                ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold'
                                                : 'bg-rose-50 border-rose-300 text-rose-800'
                                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                          }`}
                                        >
                                          {opt}
                                        </button>
                                      ))}
                                    </div>

                                    {selectedOpt && (
                                      <div className={`text-[9px] font-bold ${isCorrect ? 'text-emerald-600' : 'text-slate-400'}`}>
                                        {isCorrect ? '✓ Correct Answer!' : `Incorrect choice. Try another.`}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                  No revision packets published yet by Teacher for Class {activeStudent.grade}.
                </div>
              )}
            </div>

          </div>
        )}

        {/* ATTENDANCE CALENDAR & FEES INVOICE */}
        {activeTab === 'financials' && (
          <div className="space-y-4">
            
            {/* Outstanding balance breakdown card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Official Tuition Ledger Invoice</span>
              
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-base font-extrabold text-slate-800">Gurukul Outstanding Fees</h4>
                  <p className="text-[10px] text-slate-400">Class {activeStudent.grade} Annual Tuition</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-rose-600">₹{activeStudent.outstandingFees}</div>
                  <span className="text-[8px] bg-rose-50 border border-rose-100 font-extrabold text-rose-700 px-2 py-0.5 rounded-full uppercase tracking-wider block mt-1">
                    Deficit Pending
                  </span>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-500">
                  <span>Base Tuition Fee:</span>
                  <span>₹{activeStudent.baseFee}</span>
                </div>
                {activeStudent.feeDiscountPercent > 0 && (
                  <div className="flex justify-between text-indigo-600 font-semibold">
                    <span>Merit Scholarship ({activeStudent.feeDiscountPercent}%):</span>
                    <span>- ₹{totalDeductions}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500 border-t border-slate-100 pt-1.5">
                  <span>Net Fee Assessed:</span>
                  <span>₹{netTuition}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Paid Offline Receipts:</span>
                  <span>- ₹{netTuition - activeStudent.outstandingFees}</span>
                </div>
                <div className="flex justify-between text-rose-600 font-extrabold border-t border-slate-100 pt-1.5">
                  <span>Outstanding Deficit:</span>
                  <span>₹{activeStudent.outstandingFees}</span>
                </div>
              </div>
            </div>

            {/* Attendance Calendar Grid */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance Log Calendar</h3>
                <p className="text-[10px] text-slate-400">Green represents Present, Red shows Absentee days</p>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day) => {
                  const status = activeStudent.attendanceHistory[day.date];
                  let bgClass = 'bg-slate-50 text-slate-400';
                  let borderClass = 'border-slate-100';

                  if (status === 'Present') {
                    bgClass = 'bg-emerald-500 text-white font-bold';
                    borderClass = 'border-emerald-600';
                  } else if (status === 'Absent') {
                    bgClass = 'bg-rose-500 text-white font-bold';
                    borderClass = 'border-rose-600';
                  } else if (status === 'Late') {
                    bgClass = 'bg-amber-400 text-slate-900 font-bold';
                    borderClass = 'border-amber-500';
                  }

                  return (
                    <div 
                      key={day.date} 
                      className={`p-1.5 border rounded-xl text-center flex flex-col justify-between h-14 ${bgClass} ${borderClass}`}
                    >
                      <span className="text-[9px] block uppercase opacity-80">{day.label.split(' ')[0]}</span>
                      <span className="text-xs font-black">{day.label.split(' ')[1] || 'T'}</span>
                      <span className="text-[8px] block opacity-90">{status || 'No Log'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* PRIVATE TEACHER DIRECT CHAT */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[480px]">
            {/* Educator profile header */}
            <div className="p-3 border-b border-slate-100 bg-slate-50 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  RK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{teacherName}</h4>
                  <span className="text-[9px] text-slate-400">Batch Teacher &bull; CBSE Coordinator</span>
                </div>
              </div>
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            </div>

            {/* Chat Stream Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
              {filteredChats.map((msg) => {
                const isMe = msg.senderId === 'p1';
                return (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-[85%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                  >
                    <span className="text-[9px] text-slate-400 font-semibold mb-0.5">{msg.senderName.split(' ')[0]}</span>
                    <div className={`p-2.5 rounded-2xl text-xs ${
                      isMe ? 'bg-indigo-600 text-white rounded-tr-none shadow-xs' : 'bg-slate-100 text-slate-800 rounded-tl-none border'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message input form */}
            <form onSubmit={handleSendChatMessage} className="p-2 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                placeholder={`Type private reply to Rajesh Sir...`}
                value={newChatText}
                onChange={(e) => setNewChatText(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* COMMUNITY NOTICE BOARD & CIRCLE */}
        {activeTab === 'circle' && (
          <div className="space-y-4">
            
            {/* Informational banner reminding users that contact details are isolated/hidden for privacy */}
            <div className="bg-amber-50 border border-amber-100 p-3 rounded-2xl text-xs text-amber-900 flex gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Encrypted Community Circle Active</strong>
                Gurukul shields phone numbers & emails. Connect safely with parents in the same batch class without exposing contact coordinates.
              </div>
            </div>

            {/* Notice Board stream */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gurukul Notice & Parent Circle Board</h3>

              <div className="space-y-3.5">
                {filteredNotices.map((not) => {
                  const isOfficial = not.senderRole === 'ADMIN' || not.senderRole === 'TEACHER';
                  return (
                    <div 
                      key={not.id} 
                      className={`p-3 rounded-xl border ${
                        isOfficial ? 'bg-indigo-50 border-indigo-100 text-indigo-950' : 'bg-slate-50 border-slate-100'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] font-bold ${isOfficial ? 'text-indigo-800' : 'text-slate-700'}`}>
                          {not.senderName}
                        </span>
                        <span className="text-[8px] text-slate-400">{not.grade} Batch</span>
                      </div>
                      <p className="text-xs">{not.content}</p>
                    </div>
                  );
                })}

                {filteredNotices.length === 0 && (
                  <div className="text-center py-6 text-slate-400 text-xs">No notices shared in this batch.</div>
                )}
              </div>

              {/* Notice form */}
              <form onSubmit={handleSendNotice} className="border-t border-slate-100 pt-3 flex gap-2">
                <input
                  type="text"
                  placeholder={`Post community query inside ${activeStudent.grade} circle...`}
                  value={newNoticeText}
                  onChange={(e) => setNewNoticeText(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all"
                >
                  Post
                </button>
              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
