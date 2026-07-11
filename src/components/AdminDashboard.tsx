import React, { useState } from 'react';
import { Student, Batch, FeeTransaction, LeaveRequest, NCERTGrade } from '../types';
import { NCERT_CLASSES } from '../utils/ncertSeeder';
import { 
  Building, IndianRupee, PieChart, Inbox, Users, Check, X, ShieldAlert, 
  Percent, FileSpreadsheet, Send, TrendingUp, AlertTriangle, CheckCircle2
} from 'lucide-react';

interface AdminDashboardProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  transactions: FeeTransaction[];
  setTransactions: React.Dispatch<React.SetStateAction<FeeTransaction[]>>;
  leaveRequests: LeaveRequest[];
  setLeaveRequests: React.Dispatch<React.SetStateAction<LeaveRequest[]>>;
  curriculum: { [grade: string]: NCERTGrade };
  batches: Batch[];
  toast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export default function AdminDashboard({
  students,
  setStudents,
  transactions,
  setTransactions,
  leaveRequests,
  setLeaveRequests,
  curriculum,
  batches,
  toast,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'financials' | 'analytics' | 'inbox'>('financials');

  // Inline adjustment state
  const [targetStudentId, setTargetStudentId] = useState<string>('');
  const [adjustmentType, setAdjustmentType] = useState<'Discount' | 'Scholarship'>('Discount');
  const [percentAmount, setPercentAmount] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('');

  // Ticket response state
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  // Calculate master analytics
  const totalDue = students.reduce((acc, curr) => acc + curr.outstandingFees, 0);
  const totalCollected = transactions
    .filter(tx => tx.type === 'Payment')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Apply discount or scholarship dynamically
  const handleApplyFeeAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStudentId) {
      toast('Please choose a student.', 'error');
      return;
    }

    const student = students.find(s => s.id === targetStudentId);
    if (!student) return;

    // Recalculate remaining balance
    // Deduct percentage from base tuition fee
    const currentDiscount = student.feeDiscountPercent + percentAmount;
    if (currentDiscount > 100) {
      toast('Aggregate scholarship/discount cap exceeded. Maximum is 100%.', 'error');
      return;
    }

    const calculatedDeduction = Math.round((student.baseFee * percentAmount) / 100);
    const newOutstanding = Math.max(0, student.outstandingFees - calculatedDeduction);

    // Update Student record
    setStudents(prev => {
      return prev.map(s => {
        if (s.id === targetStudentId) {
          return {
            ...s,
            feeDiscountPercent: currentDiscount,
            outstandingFees: newOutstanding,
          };
        }
        return s;
      });
    });

    // Log Transaction in Ledger
    const newTx: FeeTransaction = {
      id: `tx-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      amount: calculatedDeduction,
      date: new Date().toISOString().split('T')[0],
      type: adjustmentType,
      description: `${percentAmount}% ${adjustmentType} applied. ${adjustReason || 'Scholarship Grant'}`,
      appliedBy: 'Anjali Sharma (Admin)',
    };

    setTransactions(prev => [newTx, ...prev]);
    toast(`Successfully applied ${percentAmount}% ${adjustmentType} to ${student.name}. Saved to ledger!`, 'success');

    // Reset Form
    setTargetStudentId('');
    setAdjustReason('');
  };

  // Quick action replies for Parent requests
  const handleResolveTicket = (ticketId: string, actionStatus: 'Approved' | 'Rejected', customText?: string) => {
    const finalReply = customText || (actionStatus === 'Approved' ? 'Approved by Admin.' : 'Disallowed under current safety terms.');

    setLeaveRequests(prev => {
      return prev.map(req => {
        if (req.id === ticketId) {
          return {
            ...req,
            status: actionStatus,
            reply: finalReply,
          };
        }
        return req;
      });
    });

    toast(`Leave Request status finalized as: ${actionStatus}`, 'success');
    setSelectedTicketId(null);
    setReplyText('');
  };

  // Generate curriculum syllabus metrics: percentage completed per class/subject
  const syllabusCompletionReport = batches.map((batch) => {
    const gradeData = curriculum[batch.grade];
    const subjectData = gradeData?.subjects[batch.subject];
    
    let totalTopics = 0;
    let completedTopics = 0;

    if (subjectData) {
      subjectData.chapters.forEach((ch) => {
        ch.topics.forEach((t) => {
          totalTopics++;
          if (t.isCompleted) completedTopics++;
        });
      });
    }

    const percentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    return {
      batchName: batch.name,
      grade: batch.grade,
      subject: batch.subject,
      total: totalTopics,
      completed: completedTopics,
      percentage,
    };
  });

  return (
    <div className="bg-slate-50 rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 max-w-lg mx-auto flex flex-col h-[740px] text-slate-800">
      
      {/* Phone Header Block */}
      <div className="bg-slate-900 text-white pt-6 pb-4 px-5 shrink-0 shadow-sm">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400">
              Gurukul Tuition Admin Hub
            </span>
          </div>
          <span className="text-[9px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
            Manoj &bull; Dev Mode
          </span>
        </div>
        <h1 className="text-xl font-bold tracking-tight">Anjali Sharma</h1>
        <p className="text-xs text-slate-300 opacity-90">Managing Director & Central Administrator</p>

        {/* Master quick finances counter banner */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700/50 flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[9px] text-slate-400 uppercase tracking-wider">Fee Collections</div>
              <div className="text-xs font-bold text-slate-100">₹{totalCollected.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700/50 flex items-center gap-2">
            <div className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg shrink-0">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[9px] text-slate-400 uppercase tracking-wider">Total Deficit</div>
              <div className="text-xs font-bold text-slate-100">₹{totalDue.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Internal Navigation Tab Bar */}
      <div className="bg-white border-b border-slate-200 flex justify-around py-2.5 shrink-0">
        <button
          onClick={() => setActiveTab('financials')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium transition-all ${
            activeTab === 'financials' ? 'text-slate-950 border-b-2 border-slate-950 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <IndianRupee className="w-4 h-4" />
          <span>Ledger</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium transition-all ${
            activeTab === 'analytics' ? 'text-slate-950 border-b-2 border-slate-950 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>Analytics</span>
        </button>
        <button
          onClick={() => setActiveTab('inbox')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium transition-all relative ${
            activeTab === 'inbox' ? 'text-slate-950 border-b-2 border-slate-950 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Queries</span>
          {leaveRequests.some(r => r.status === 'Pending') && (
            <span className="absolute top-0 right-1 w-2 h-2 bg-rose-500 rounded-full animate-bounce" />
          )}
        </button>
      </div>

      {/* Main Scrollable Layout */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* FINANCIAL LEDGER */}
        {activeTab === 'financials' && (
          <div className="space-y-4">
            
            {/* Adjustment Form */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <Percent className="w-4 h-4 text-blue-600" /> Apply Scholarship / Discount
              </h3>

              <form onSubmit={handleApplyFeeAdjustment} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold block mb-1">Select Student</label>
                    <select
                      value={targetStudentId}
                      onChange={(e) => setTargetStudentId(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2 font-medium"
                    >
                      <option value="">-- Choose --</option>
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold block mb-1">Adjustment Type</label>
                    <select
                      value={adjustmentType}
                      onChange={(e) => setAdjustmentType(e.target.value as 'Discount' | 'Scholarship')}
                      className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2 font-medium"
                    >
                      <option value="Discount">Flat Discount</option>
                      <option value="Scholarship">Scholarship %</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold block mb-1">Deduction Percentage</label>
                    <select
                      value={percentAmount}
                      onChange={(e) => setPercentAmount(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2 font-medium"
                    >
                      <option value={5}>5% Off</option>
                      <option value={10}>10% Off</option>
                      <option value={15}>15% Off</option>
                      <option value={20}>20% Off</option>
                      <option value={50}>50% Half Scholarship</option>
                      <option value={100}>100% Free scholarship</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold block mb-1">Explanatory Remark</label>
                    <input
                      type="text"
                      placeholder="e.g. CBSE 1st rank bonus"
                      value={adjustReason}
                      onChange={(e) => setAdjustReason(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs"
                >
                  Recalculate Balance & Commit to Ledger
                </button>
              </form>
            </div>

            {/* Historical transaction ledger stream */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Master Audit Transactions</span>
                <span className="text-[10px] font-mono text-slate-400">Ledger Entry List</span>
              </h3>

              <div className="space-y-2.5 max-h-[220px] overflow-y-auto divide-y divide-slate-50">
                {transactions.map((tx) => (
                  <div key={tx.id} className="pt-2.5 first:pt-0 flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-slate-800">{tx.studentName}</div>
                      <div className="text-[10px] text-slate-400">{tx.description}</div>
                      <div className="text-[9px] text-slate-300 font-mono mt-0.5">{tx.date} &bull; {tx.appliedBy}</div>
                    </div>

                    <span className={`text-xs font-extrabold shrink-0 px-2 py-0.5 rounded ${
                      tx.type === 'Payment' ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'
                    }`}>
                      {tx.type === 'Payment' ? `+ ₹${tx.amount}` : `- ₹${tx.amount}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ANALYTICS & MONITORING OVERVIEW */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            
            {/* Real-time syllabus completion percent indicators per class/subject */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3.5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-500" /> Syllabus Execution Percentages
                </h3>
                <p className="text-[10px] text-slate-400">Class tracker progress against standard NCERT indices</p>
              </div>

              <div className="space-y-3">
                {syllabusCompletionReport.map((rep, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700">{rep.batchName}</span>
                      <span className="font-bold text-slate-900">{rep.percentage}%</span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          rep.percentage > 70 ? 'bg-emerald-500' : rep.percentage > 30 ? 'bg-blue-500' : 'bg-indigo-500'
                        }`} 
                        style={{ width: `${rep.percentage || 4}%` }} 
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                      <span>Topics Finished: {rep.completed}</span>
                      <span>Total: {rep.total} NCERT Units</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance absenteeism analysis */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500" /> Chronic Absenteeism Monitor
                </h3>
                <p className="text-[10px] text-slate-400">Students with attendance deficit alerts</p>
              </div>

              <div className="space-y-2">
                {students.map((student) => {
                  const history = Object.values(student.attendanceHistory);
                  const totalDays = history.length;
                  const absentCount = history.filter(h => h === 'Absent').length;
                  const isChronic = absentCount >= 2;

                  if (absentCount === 0) return null;

                  return (
                    <div 
                      key={student.id} 
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-4 ${
                        isChronic ? 'bg-rose-50/50 border-rose-100' : 'bg-slate-50 border-slate-100'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-800">{student.name}</div>
                        <div className="text-[10px] text-slate-400">{student.grade} &bull; Invite: {student.invitationToken}</div>
                      </div>

                      <div className="text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isChronic ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {absentCount} Days Absent
                        </span>
                        <div className="text-[9px] text-slate-400 mt-1">out of {totalDays} logged days</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* COMMUNICATION CENTER INBOX */}
        {activeTab === 'inbox' && (
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Parent Ticket Requests Inbox</h3>
              <p className="text-[10px] text-slate-400">Verify, reply, and process incoming leave approvals</p>
            </div>

            <div className="space-y-3">
              {leaveRequests.map((req) => (
                <div key={req.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50 space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-bold text-slate-800">{req.studentName} ({req.parentName})</div>
                      <div className="text-[9px] text-slate-400 font-mono mt-0.5">Applied: {new Date(req.timestamp).toLocaleDateString()}</div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : req.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 bg-white border border-slate-100 p-2.5 rounded-lg italic">
                    &quot;{req.reason}&quot;
                  </div>

                  {req.reply && (
                    <div className="text-[11px] text-slate-500 bg-indigo-50/50 p-2 rounded border border-indigo-100">
                      <span className="font-bold text-indigo-700">Official Reply: </span> {req.reply}
                    </div>
                  )}

                  {req.status === 'Pending' && (
                    <div className="space-y-2">
                      {selectedTicketId === req.id ? (
                        <div className="space-y-2 pt-2 border-t border-slate-200">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="E.g. Approved. Notes will be marked offline..."
                            className="w-full bg-white border border-slate-200 text-xs rounded p-2 focus:ring-1 focus:ring-blue-500"
                            rows={1.5}
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setSelectedTicketId(null)}
                              className="px-2.5 py-1 text-[10px] text-slate-500 hover:text-slate-700 bg-slate-200 rounded font-semibold"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleResolveTicket(req.id, 'Approved', replyText)}
                              className="px-3 py-1 text-[10px] text-white bg-emerald-600 hover:bg-emerald-700 rounded font-semibold flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" /> Approve Leave
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1.5 pt-1">
                          <button
                            onClick={() => handleResolveTicket(req.id, 'Rejected')}
                            className="px-3 py-1 text-[10px] text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg font-bold"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTicketId(req.id);
                              setReplyText('Approved. Rajesh Sir is informed, stay safe.');
                            }}
                            className="px-3 py-1 text-[10px] text-white bg-slate-900 hover:bg-black rounded-lg font-bold flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" /> Send Quick Approve
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {leaveRequests.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-xs">Inbox clean! No leave applications currently pending.</div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
