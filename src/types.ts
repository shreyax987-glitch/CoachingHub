/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'ADMIN' | 'TEACHER' | 'PARENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string; // "Class 1" to "Class 8"
  parentId: string;
  batchId: string;
  invitationToken: string;
  outstandingFees: number;
  feeDiscountPercent: number; // For flat or scholarship discounts
  baseFee: number;
  attendanceHistory: { [date: string]: 'Present' | 'Absent' | 'Late' };
}

export interface Batch {
  id: string;
  name: string;
  grade: string;
  subject: string;
  teacherId: string;
}

export interface NCERTTopic {
  id: string;
  name: string;
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: string;
}

export interface NCERTChapter {
  id: string;
  number: number;
  title: string;
  topics: NCERTTopic[];
}

export interface NCERTSubject {
  id: string;
  name: string;
  chapters: NCERTChapter[];
}

export interface NCERTGrade {
  id: string; // "Class 1" to "Class 8"
  subjects: { [subjectName: string]: NCERTSubject };
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string; // YYYY-MM-DD
  status: 'Present' | 'Absent' | 'Late';
  timestamp: string;
  teacherId: string;
  isSynced: boolean;
}

export interface ProgressNote {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  note: string;
  gaps: string;
  timestamp: string;
  isSynced: boolean;
}

export interface FeeTransaction {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  type: 'Payment' | 'Discount' | 'Scholarship';
  description: string;
  appliedBy: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  parentId: string;
  parentName: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reply?: string;
  timestamp: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface WorksheetQuestion {
  question: string;
  options?: string[];
  answer: string;
}

export interface RevisionMaterials {
  id: string;
  chapterId: string;
  chapterTitle: string;
  topicName: string;
  grade: string;
  subject: string;
  flashcards: Flashcard[];
  questions: WorksheetQuestion[];
  generatedAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  content: string;
  timestamp: string;
}

export interface CommunityNotice {
  id: string;
  senderName: string;
  senderRole: UserRole;
  grade: string; // The relevant Class batch (e.g., "Class 6")
  content: string;
  timestamp: string;
}
