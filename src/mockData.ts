import { Student, Batch, FeeTransaction, LeaveRequest, ChatMessage, CommunityNotice, RevisionMaterials } from './types';

// Default initial students representing Indian coaching classes
export const initialStudents: Student[] = [
  {
    id: 's1',
    name: 'Aarav Pathak',
    grade: 'Class 5',
    parentId: 'p1', // Soumya Pathak
    batchId: 'b-c5-ms',
    invitationToken: 'GURUKUL-5-AARAV',
    baseFee: 12000,
    outstandingFees: 4500,
    feeDiscountPercent: 10, // 10% scholarship discount applied
    attendanceHistory: {
      '2026-07-01': 'Present',
      '2026-07-02': 'Present',
      '2026-07-03': 'Absent',
    },
  },
  {
    id: 's2',
    name: 'Ananya Pathak',
    grade: 'Class 8',
    parentId: 'p1', // Soumya Pathak
    batchId: 'b-c8-ms',
    invitationToken: 'GURUKUL-8-ANANYA',
    baseFee: 18000,
    outstandingFees: 18000,
    feeDiscountPercent: 0,
    attendanceHistory: {
      '2026-07-01': 'Present',
      '2026-07-02': 'Present',
      '2026-07-03': 'Present',
    },
  },
  {
    id: 's3',
    name: 'Kabir Mehta',
    grade: 'Class 8',
    parentId: 'p2',
    batchId: 'b-c8-ms',
    invitationToken: 'GURUKUL-8-KABIR',
    baseFee: 18000,
    outstandingFees: 8000,
    feeDiscountPercent: 15, // 15% flat discount applied
    attendanceHistory: {
      '2026-07-01': 'Present',
      '2026-07-02': 'Late',
      '2026-07-03': 'Present',
    },
  },
  {
    id: 's4',
    name: 'Riya Sen',
    grade: 'Class 6',
    parentId: 'p3',
    batchId: 'b-c6-eng',
    invitationToken: 'GURUKUL-6-RIYA',
    baseFee: 14000,
    outstandingFees: 0,
    feeDiscountPercent: 100, // 100% full scholarship
    attendanceHistory: {
      '2026-07-01': 'Present',
      '2026-07-02': 'Present',
      '2026-07-03': 'Present',
    },
  },
  {
    id: 's5',
    name: 'Devansh Joshi',
    grade: 'Class 5',
    parentId: 'p4',
    batchId: 'b-c5-ms',
    invitationToken: 'GURUKUL-5-DEVANSH',
    baseFee: 12000,
    outstandingFees: 9500,
    feeDiscountPercent: 0,
    attendanceHistory: {
      '2026-07-01': 'Absent',
      '2026-07-02': 'Absent',
      '2026-07-03': 'Absent', // Highlight chronic absenteeism
    },
  },
];

// Master batches
export const initialBatches: Batch[] = [
  {
    id: 'b-c5-ms',
    name: 'Class 5 - Math & Science Focus',
    grade: 'Class 5',
    subject: 'Mathematics',
    teacherId: 't1', // Rajesh Kumar
  },
  {
    id: 'b-c8-ms',
    name: 'Class 8 - Apex Batch',
    grade: 'Class 8',
    subject: 'Mathematics',
    teacherId: 't1', // Rajesh Kumar
  },
  {
    id: 'b-c6-eng',
    name: 'Class 6 - English Grammar Mastery',
    grade: 'Class 6',
    subject: 'English',
    teacherId: 't2', // Sneha Patel
  },
];

// Initial Transactions for the Admin Financial Ledger
export const initialTransactions: FeeTransaction[] = [
  {
    id: 'tx-101',
    studentId: 's1',
    studentName: 'Aarav Pathak',
    amount: 6300,
    date: '2026-06-15',
    type: 'Payment',
    description: 'Term 1 Fee Instalment Paid (Cash)',
    appliedBy: 'Anjali Sharma (Admin)',
  },
  {
    id: 'tx-102',
    studentId: 's1',
    studentName: 'Aarav Pathak',
    amount: 1200,
    date: '2026-06-15',
    type: 'Scholarship',
    description: '10% Meritorious Scholarship Benefit Applied',
    appliedBy: 'Anjali Sharma (Admin)',
  },
  {
    id: 'tx-103',
    studentId: 's3',
    studentName: 'Kabir Mehta',
    amount: 7300,
    date: '2026-06-20',
    type: 'Payment',
    description: 'UPI transaction recvd. ID: UPI998271',
    appliedBy: 'Anjali Sharma (Admin)',
  },
  {
    id: 'tx-104',
    studentId: 's3',
    studentName: 'Kabir Mehta',
    amount: 2700,
    date: '2026-06-20',
    type: 'Discount',
    description: '15% Flat Sibling Discount Recalculation',
    appliedBy: 'Anjali Sharma (Admin)',
  },
  {
    id: 'tx-105',
    studentId: 's4',
    studentName: 'Riya Sen',
    amount: 14000,
    date: '2026-06-10',
    type: 'Scholarship',
    description: '100% EWS Uplift Scholarship Granted',
    appliedBy: 'Anjali Sharma (Admin)',
  },
];

// Leave applications and help tickets submitted by Parents
export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'lv-201',
    studentId: 's1',
    studentName: 'Aarav Pathak',
    parentId: 'p1',
    parentName: 'Soumya Pathak',
    reason: 'Family event in Jaipur for maternal grandparents anniversary.',
    startDate: '2026-07-06',
    endDate: '2026-07-08',
    status: 'Pending',
    timestamp: '2026-07-03T18:30:00Z',
  },
  {
    id: 'lv-202',
    studentId: 's5',
    studentName: 'Devansh Joshi',
    parentId: 'p4',
    parentName: 'Sanjay Joshi',
    reason: 'Severe fever and viral flu doctor recommended 3 days bed rest.',
    startDate: '2026-06-28',
    endDate: '2026-06-30',
    status: 'Approved',
    reply: 'Approved. Get well soon Devansh, राजेश सर will share notes online.',
    timestamp: '2026-06-27T09:15:00Z',
  },
];

// Interactive chat logs (Encrypted private messaging simulator)
export const initialChatMessages: ChatMessage[] = [
  {
    id: 'ch-1',
    senderId: 't1',
    senderName: 'Rajesh Kumar (Teacher)',
    senderRole: 'TEACHER',
    receiverId: 'p1',
    content: 'Namaste Soumya ji, Aarav performed extremely well in today’s Mathematics oral test on speed and time. He just needs a bit of practice in written word problems.',
    timestamp: '2026-07-02T16:05:00Z',
  },
  {
    id: 'ch-2',
    senderId: 'p1',
    senderName: 'Soumya Pathak (Parent)',
    senderRole: 'PARENT',
    receiverId: 't1',
    content: 'Thank you so much Rajesh Sir! Yes, he is writing numbers in a hurry sometimes. I will sit with him tonight. Can you share a revision sheet or flashcard set for "The Fish Tale" chapter?',
    timestamp: '2026-07-02T16:15:00Z',
  },
  {
    id: 'ch-3',
    senderId: 't1',
    senderName: 'Rajesh Kumar (Teacher)',
    senderRole: 'TEACHER',
    receiverId: 'p1',
    content: 'Definitely! I will generate a custom revision packet using our NCERT AI Engine as soon as we finish the next topic tomorrow. You’ll be able to download it instantly from your portal.',
    timestamp: '2026-07-02T16:20:00Z',
  },
];

// Initial notice board entries
export const initialCommunityNotices: CommunityNotice[] = [
  {
    id: 'n-1',
    senderName: 'Anjali Sharma (Admin)',
    senderRole: 'ADMIN',
    grade: 'Class 5',
    content: '📢 Dear Parents, please note that Gurukul Tuition Center will hold a parent-teacher meeting (PTM) this Sunday, July 5th, from 10:00 AM to 1:00 PM. Individual slot schedules are shared on your WhatsApp registered numbers.',
    timestamp: '2026-07-03T09:00:00Z',
  },
  {
    id: 'n-2',
    senderName: 'Soumya Pathak (Parent)',
    senderRole: 'PARENT',
    grade: 'Class 5',
    content: 'Hello everyone! Are Aarav and Devansh in the same batch? If anyone has the Class 5 Maths textbook handy, could you confirm if exercise 1.2 requires drawing bar charts?',
    timestamp: '2026-07-03T11:45:00Z',
  },
  {
    id: 'n-3',
    senderName: 'Rajesh Kumar (Teacher)',
    senderRole: 'TEACHER',
    grade: 'Class 5',
    content: 'Soumya ji, exercise 1.2 is mostly logical reasoning and place values. Bar charts will be covered in chapter 3! Parents are encouraged to guide students to only write in simple pencil for diagrams.',
    timestamp: '2026-07-03T12:05:00Z',
  },
];

// Pre-generated Revision resources to provide a rich starting point for parents
export const initialRevisionMaterials: RevisionMaterials[] = [
  {
    id: 'rev-pre-1',
    chapterId: 'c5-m-ch1',
    chapterTitle: 'The Fish Tale',
    topicName: 'Place Value up to Crore',
    grade: 'Class 5',
    subject: 'Mathematics',
    flashcards: [
      {
        id: 'fc-1',
        front: 'What is 1 Lakh written in numbers?',
        back: '1,00,000 (It contains exactly five zeros).',
      },
      {
        id: 'fc-2',
        front: 'How many Lakhs make up 1 Crore?',
        back: '100 Lakhs make 1 Crore (1,00,00,000).',
      },
      {
        id: 'fc-3',
        front: 'Which place is immediately to the left of the Ten Lakhs place?',
        back: 'The Crores place.',
      }
    ],
    questions: [
      {
        question: 'Identify the number: Five Crore, Two Lakh and Seven.',
        options: [
          '5,02,00,007',
          '5,20,00,007',
          '5,00,02,007',
          '50,20,007'
        ],
        answer: '5,02,00,007'
      },
      {
        question: 'In the Indian Place Value System, what is the correct placement of commas for 78564302?',
        options: [
          '7,85,64,302',
          '78,56,43,02',
          '7,8,5,6,4,3,0,2',
          '785,643,02'
        ],
        answer: '7,85,64,302'
      }
    ],
    generatedAt: '2026-07-03T15:00:00Z',
  }
];
