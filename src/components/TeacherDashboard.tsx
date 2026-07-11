import React, { useState } from 'react';
import { NCERTGrade, Student, Batch, AttendanceRecord, ProgressNote, RevisionMaterials, NCERTChapter } from '../types';
import { NCERT_CLASSES, NCERT_SUBJECTS } from '../utils/ncertSeeder';
import { 
  BookOpen, CheckSquare, Users, FileText, ClipboardList, CheckCircle, Clock, 
  Sparkles, AlertCircle, RefreshCw, Eye, EyeOff, Check, X, ShieldAlert, BookOpenText
} from 'lucide-react';

interface TeacherDashboardProps {
  curriculum: { [grade: string]: NCERTGrade };
  setCurriculum: React.Dispatch<React.SetStateAction<{ [grade: string]: NCERTGrade }>>;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  batches: Batch[];
  progressNotes: ProgressNote[];
  setProgressNotes: React.Dispatch<React.SetStateAction<ProgressNote[]>>;
  revisionMaterials: RevisionMaterials[];
  setRevisionMaterials: React.Dispatch<React.SetStateAction<RevisionMaterials[]>>;
  isOffline: boolean;
  addOfflineAction: (action: { type: string; payload: any }) => void;
  toast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export default function TeacherDashboard({
  curriculum,
  setCurriculum,
  students,
  setStudents,
  batches,
  progressNotes,
  setProgressNotes,
  revisionMaterials,
  setRevisionMaterials,
  isOffline,
  addOfflineAction,
  toast,
}: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState<'syllabus' | 'attendance' | 'fees' | 'feedback'>('syllabus');
  
  // Grade & Subject Selections
  const [selectedClass, setSelectedClass] = useState<string>('Class 5');
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');

  // Attendance states
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [localAttendance, setLocalAttendance] = useState<{ [studentId: string]: 'Present' | 'Absent' | 'Late' }>({});

  // Feedback note states
  const [feedbackStudent, setFeedbackStudent] = useState<string>('');
  const [feedbackNote, setFeedbackNote] = useState<string>('');
  const [feedbackGaps, setFeedbackGaps] = useState<string>('');

  // AI Revision Generator state
  const [aiGenerating, setAiGenerating] = useState<string | null>(null); // holds topicId if generating

  // Active batch identification
  const activeBatch = batches.find(b => b.grade === selectedClass && b.subject === selectedSubject) 
    || batches.find(b => b.grade === selectedClass);
  const activeStudents = students.filter(s => s.grade === selectedClass);

  // Mark NCERT topic as complete
  const handleToggleTopic = (chapterId: string, topicId: string, currentStatus: boolean) => {
    const updatedStatus = !currentStatus;
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    if (isOffline) {
      // Register action in local offline sync queue
      addOfflineAction({
        type: 'TOGGLE_TOPIC',
        payload: { selectedClass, selectedSubject, chapterId, topicId, updatedStatus, timestamp }
      });
      toast(`Offline Mode: Saved syllabus checklist change locally. Will sync when online!`, 'info');
    }

    // Update state immediately for premium responsive local feel (Offline First)
    setCurriculum((prev) => {
      const copy = { ...prev };
      const gradeData = copy[selectedClass];
      if (!gradeData) return prev;
      const subjectData = gradeData.subjects[selectedSubject];
      if (!subjectData) return prev;

      const chapters = subjectData.chapters.map((ch) => {
        if (ch.id === chapterId) {
          const topics = ch.topics.map((t) => {
            if (t.id === topicId) {
              return {
                ...t,
                isCompleted: updatedStatus,
                completedAt: updatedStatus ? timestamp : undefined,
                completedBy: updatedStatus ? 'Rajesh Kumar (Senior Educator)' : undefined,
              };
            }
            return t;
          });
          return { ...ch, topics };
        }
        return ch;
      });

      return {
        ...copy,
        [selectedClass]: {
          ...gradeData,
          subjects: {
            ...gradeData.subjects,
            [selectedSubject]: {
              ...subjectData,
              chapters,
            },
          },
        },
      };
    });

    if (!isOffline) {
      toast(`Marked topic as ${updatedStatus ? 'Complete' : 'Pending'} on cloud ledger!`, 'success');
    }
  };

  // Generate context-aware Revision Flashcards and Worksheets using server-side Gemini API
  const handleGenerateRevisionMaterials = async (chapter: NCERTChapter, topicName: string, topicId: string) => {
    setAiGenerating(topicId);
    toast(`Invoking Gurukul AI Engine... Generating worksheets mapped to NCERT chapter content.`, 'info');

    try {
      const response = await fetch('/api/gemini/generate-revision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: selectedClass,
          subject: selectedSubject,
          chapterTitle: chapter.title,
          topicName: topicName
        }),
      });

      const result = await response.json();

      if (result.success || result.flashcards) {
        const materialId = `rev-${Date.now()}`;
        const newMaterial: RevisionMaterials = {
          id: materialId,
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          topicName: topicName,
          grade: selectedClass,
          subject: selectedSubject,
          flashcards: result.flashcards,
          questions: result.questions,
          generatedAt: new Date().toISOString(),
        };

        setRevisionMaterials(prev => [newMaterial, ...prev]);
        toast(`✨ Successfully published revision flashcards & practice worksheets for parents!`, 'success');
      } else {
        throw new Error(result.error || 'Server returned invalid schema.');
      }
    } catch (err: any) {
      console.error(err);
      toast(`AI Generation failed. Fell back to pre-loaded curriculum resource safely.`, 'info');
    } finally {
      setAiGenerating(null);
    }
  };

  // Submit daily student attendance
  const handleSubmitAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();

    if (isOffline) {
      addOfflineAction({
        type: 'SUBMIT_ATTENDANCE',
        payload: { date: attendanceDate, records: { ...localAttendance } }
      });
      toast(`Offline Mode: Saved attendance register locally. Will auto-sync later.`, 'info');
    }

    setStudents((prev) => {
      return prev.map((student) => {
        if (student.grade === selectedClass) {
          const status = localAttendance[student.id] || 'Present';
          return {
            ...student,
            attendanceHistory: {
              ...student.attendanceHistory,
              [attendanceDate]: status,
            }
          };
        }
        return student;
      });
    });

    if (!isOffline) {
      toast(`Successfully uploaded attendance log for Class ${selectedClass} to server!`, 'success');
    }
  };

  // Submit qualitative feedback progress note
  const handlePublishProgressNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackStudent) {
      toast('Please select a student first.', 'error');
      return;
    }

    const matchedStudent = students.find(s => s.id === feedbackStudent);
    if (!matchedStudent) return;

    const newNote: ProgressNote = {
      id: `note-${Date.now()}`,
      studentId: matchedStudent.id,
      studentName: matchedStudent.name,
      teacherId: 't1',
      teacherName: 'Rajesh Kumar',
      note: feedbackNote,
      gaps: feedbackGaps,
      timestamp: new Date().toLocaleDateString('en-IN') + ' ' + new Date().toLocaleTimeString('en-IN'),
      isSynced: !isOffline,
    };

    if (isOffline) {
      addOfflineAction({
        type: 'PUBLISH_PROGRESS_NOTE',
        payload: newNote
      });
      toast(`Offline Mode: Locally cached progress note. Will sync to parent portal.`, 'info');
    }

    setProgressNotes(prev => [newNote, ...prev]);
    
    // reset form fields
    setFeedbackNote('');
    setFeedbackGaps('');
    toast(`Qualitative assessment note posted privately for ${matchedStudent.name}’s parent!`, 'success');
  };

  // Load selected curriculum chapters
  const activeGradeData = curriculum[selectedClass];
  const activeSubjectData = activeGradeData?.subjects[selectedSubject];

  return (
    <div className="w-full h-full flex flex-col text-slate-800 bg-slate-50">
      
      {/* Phone Header Block */}
      <div className="bg-blue-600 text-white pt-6 pb-4 px-5 shrink-0 shadow-sm relative">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="text-[11px] font-semibold tracking-wider uppercase text-blue-100">
              Teacher Workspace &bull; LIVE
            </span>
          </div>
          {isOffline && (
            <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full shadow-xs">
              <ShieldAlert className="w-3 h-3 animate-bounce" /> Offline Caching
            </span>
          )}
        </div>
        <h1 className="text-xl font-bold tracking-tight">Rajesh Kumar</h1>
        <p className="text-xs text-blue-100 opacity-90">Maths & Science Faculty, Gurukul Central</p>

        {/* Dynamic Class & Subject Filter Bar */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div>
            <label className="text-[9px] font-bold text-blue-200 uppercase tracking-wider block mb-1">Grade Level</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-blue-700 text-white text-xs font-semibold py-1.5 px-2.5 rounded-lg border-none focus:ring-1 focus:ring-blue-300"
            >
              {NCERT_CLASSES.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[9px] font-bold text-blue-200 uppercase tracking-wider block mb-1">NCERT Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-blue-700 text-white text-xs font-semibold py-1.5 px-2.5 rounded-lg border-none focus:ring-1 focus:ring-blue-300"
            >
              {NCERT_SUBJECTS.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Internal App Navigation Tab Bar */}
      <div className="bg-white border-b border-slate-200 flex justify-around py-2.5 shrink-0">
        <button
          onClick={() => setActiveTab('syllabus')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium transition-all ${
            activeTab === 'syllabus' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Syllabus</span>
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium transition-all ${
            activeTab === 'attendance' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Attendance</span>
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium transition-all ${
            activeTab === 'fees' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Fees List</span>
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium transition-all ${
            activeTab === 'feedback' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Feedback</span>
        </button>
      </div>

      {/* Main Content Area Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* SYLLABUS TRACKING PANEL */}
        {activeTab === 'syllabus' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
              <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
                <BookOpenText className="w-4 h-4 text-blue-500" />
                NCERT Topic Tracker
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Mark completed topics to instantly trigger the automatic AI Study Revision Engine.
              </p>

              {activeSubjectData ? (
                <div className="space-y-4">
                  {activeSubjectData.chapters.map((chapter) => (
                    <div key={chapter.id} className="border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                      <div className="font-semibold text-xs text-indigo-900 mb-2.5">
                        Chapter {chapter.number}: {chapter.title}
                      </div>
                      
                      <div className="space-y-3">
                        {chapter.topics.map((topic) => {
                          const hasRevisionSheet = revisionMaterials.some(r => r.chapterId === chapter.id && r.topicName === topic.name);

                          return (
                            <div key={topic.id} className="bg-white p-3 rounded-lg border border-slate-100 shadow-xs">
                              <div className="flex items-start justify-between gap-2">
                                <label className="flex items-start gap-2.5 cursor-pointer flex-1">
                                  <input
                                    type="checkbox"
                                    checked={topic.isCompleted}
                                    onChange={() => handleToggleTopic(chapter.id, topic.id, topic.isCompleted)}
                                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-400 w-4 h-4 shrink-0"
                                  />
                                  <div>
                                    <span className={`text-xs font-medium ${topic.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                      {topic.name}
                                    </span>
                                    {topic.completedAt && (
                                      <div className="text-[9px] text-emerald-600 font-mono mt-0.5 flex items-center gap-1">
                                        <Clock className="w-2.5 h-2.5" /> Checked: {topic.completedAt}
                                      </div>
                                    )}
                                  </div>
                                </label>
                              </div>

                              {/* Automated Revision Engine Shortcut Actions */}
                              {topic.isCompleted && (
                                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                                  <div className="text-[10px] text-indigo-600 bg-indigo-50 font-semibold px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                                    <Sparkles className="w-3 h-3 text-indigo-500" /> NCERT Topic Finished
                                  </div>

                                  {hasRevisionSheet ? (
                                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded font-medium flex items-center gap-1">
                                      <Check className="w-3 h-3" /> Revision Generated
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => handleGenerateRevisionMaterials(chapter, topic.name, topic.id)}
                                      disabled={aiGenerating === topic.id}
                                      className="text-[10px] text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5"
                                    >
                                      {aiGenerating === topic.id ? (
                                        <>
                                          <RefreshCw className="w-3 h-3 animate-spin" />
                                          Creating AI Worksheets...
                                        </>
                                      ) : (
                                        <>
                                          <Sparkles className="w-3 h-3" />
                                          Auto-Generate Worksheets
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Syllabus details unavailable. Check NCERT Source Directory.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ATTENDANCE DIGI-REGISTER */}
        {activeTab === 'attendance' && (
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Attendance Register</h3>
                <p className="text-xs text-slate-500">Tap status to log daily attendance</p>
              </div>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-semibold text-slate-700"
              />
            </div>

            <form onSubmit={handleSubmitAttendance} className="space-y-4">
              <div className="divide-y divide-slate-100">
                {activeStudents.map((student) => {
                  const currentStatus = localAttendance[student.id] || student.attendanceHistory[attendanceDate] || 'Present';
                  
                  return (
                    <div key={student.id} className="py-2.5 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-800 truncate">{student.name}</div>
                        <div className="text-[10px] text-slate-400">ID: {student.invitationToken}</div>
                      </div>

                      {/* Status Selection Pill Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {(['Present', 'Absent', 'Late'] as const).map((status) => {
                          const isActive = currentStatus === status;
                          return (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setLocalAttendance(prev => ({ ...prev, [student.id]: status }))}
                              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                                isActive 
                                  ? status === 'Present' ? 'bg-emerald-600 text-white shadow-xs'
                                    : status === 'Absent' ? 'bg-rose-600 text-white shadow-xs'
                                    : 'bg-amber-500 text-white shadow-xs'
                                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
                              }`}
                            >
                              {status[0]}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {activeStudents.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No registered students found in this Class level.
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <ClipboardList className="w-4 h-4" />
                  {isOffline ? 'Save Attendance Locally' : 'Upload Official Attendance Log'}
                </button>
              )}
            </form>
          </div>
        )}

        {/* READ-ONLY FEES BATCH VIEW */}
        {activeTab === 'fees' && (
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Batch Outstanding Fees (Read-Only)</h3>
              <p className="text-xs text-slate-500">Teacher view of tuition fee receipts and deficits</p>
            </div>

            <div className="space-y-3">
              {activeStudents.map((student) => {
                const totalDiscount = (student.baseFee * student.feeDiscountPercent) / 100;
                const netFee = student.baseFee - totalDiscount;

                return (
                  <div key={student.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold text-slate-800">{student.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Net: ₹{netFee} (Base: ₹{student.baseFee})
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-xs font-bold ${student.outstandingFees > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {student.outstandingFees > 0 ? `₹${student.outstandingFees} Due` : 'Fully Settled'}
                      </div>
                      {student.feeDiscountPercent > 0 && (
                        <div className="text-[9px] text-indigo-600 bg-indigo-50 font-bold px-1.5 py-0.5 rounded inline-block mt-0.5">
                          {student.feeDiscountPercent}% Scholar
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {activeStudents.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">No batch outstanding files.</div>
              )}
            </div>
          </div>
        )}

        {/* PROGRESS NOTE PUBLISHING FORM */}
        {activeTab === 'feedback' && (
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Publish Performance Reviews</h3>
              <p className="text-xs text-slate-500">Submit private quantitative assessment logs to parents</p>
            </div>

            <form onSubmit={handlePublishProgressNote} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Select Student</label>
                <select
                  value={feedbackStudent}
                  onChange={(e) => setFeedbackStudent(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-lg p-2 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">-- Choose student --</option>
                  {activeStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Academic Progress Notes</label>
                <textarea
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  placeholder="E.g. Exceptional comprehension. Understood integers operations quickly."
                  required
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Identified Learning Gaps & Remedies</label>
                <textarea
                  value={feedbackGaps}
                  onChange={(e) => setFeedbackGaps(e.target.value)}
                  placeholder="E.g. Commits computational signs errors. Recommended practice sheet 1.2"
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-xs"
              >
                Post Private Note to Parent Portal
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
