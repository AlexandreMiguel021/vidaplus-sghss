export type UserRole = 'patient' | 'professional' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cpf: string;
  phone: string;
  createdAt: string;
  avatar?: string;
}

export interface Patient extends User {
  role: 'patient';
  dateOfBirth?: string;
  address?: string;
  medicalHistory?: string[];
}

export interface Professional extends User {
  role: 'professional';
  specialty?: string;
  license?: string;
  availability?: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName?: string;
  professionalId: string;
  professionalName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'in-person' | 'telemedicine';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Specialty {
  id: string;
  name: string;
  description: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface MedicalRecord {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  professionalId: string;
  date: string;
  complaint: string;
  examination: string;
  diagnosis: string;
  prescription?: string;
  notes: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  professionalId: string;
  professionalName: string;
  date: string;
  medications: Medication[];
  notes?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export type BedStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';

export interface Bed {
  id: string;
  number: string;
  ward: string;
  floor: number;
  status: BedStatus;
  patientId?: string;
  patientName?: string;
  admissionDate?: string;
  expectedDischargeDate?: string;
  notes?: string;
}

export type ExamStatus = 'requested' | 'in_progress' | 'completed' | 'cancelled';

export interface Exam {
  id: string;
  patientId: string;
  patientName: string;
  professionalId: string;
  professionalName: string;
  type: string;
  description: string;
  requestDate: string;
  scheduledDate?: string;
  completedDate?: string;
  status: ExamStatus;
  results?: string;
  notes?: string;
}

export interface ExamType {
  id: string;
  name: string;
  category: string;
  description: string;
  preparationInstructions?: string;
}

export type TransactionType = 'revenue' | 'expense';
export type TransactionCategory =
  | 'consultation'
  | 'exam'
  | 'procedure'
  | 'medication'
  | 'salary'
  | 'supplies'
  | 'maintenance'
  | 'utilities'
  | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  amount: number;
  date: string;
  patientId?: string;
  patientName?: string;
  professionalId?: string;
  professionalName?: string;
  notes?: string;
}
