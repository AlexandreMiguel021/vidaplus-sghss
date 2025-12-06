import type { Appointment, Professional, Specialty, TimeSlot } from '@/types';

export interface CreateAppointmentData {
  patientId: string;
  professionalId: string;
  date: string;
  time: string;
  type: 'in-person' | 'telemedicine';
  notes?: string;
}

export interface IAppointmentRepository {
  getAllAppointments(): Promise<Appointment[]>;
  getAppointmentsByPatient(patientId: string): Promise<Appointment[]>;
  getAppointmentsByProfessional(professionalId: string): Promise<Appointment[]>;
  getAppointmentById(id: string): Promise<Appointment | null>;
  createAppointment(data: CreateAppointmentData): Promise<Appointment>;
  cancelAppointment(id: string): Promise<void>;
  getSpecialties(): Promise<Specialty[]>;
  getProfessionalsBySpecialty(specialtyId: string): Promise<Professional[]>;
  getAvailableSlots(professionalId: string, date: string): Promise<TimeSlot[]>;
}
