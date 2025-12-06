import type { Appointment, Professional, Specialty, TimeSlot } from '@/types';
import type { IAppointmentRepository, CreateAppointmentData } from '../interfaces/IAppointmentRepository';
import { mockAppointments, mockSpecialties } from '@/mocks/appointments';
import { mockProfessionals } from '@/mocks/professionals';

const STORAGE_KEY = 'sghss_appointments';

export class LocalAppointmentRepository implements IAppointmentRepository {
  private initializeStorage(): void {
    const appointments = localStorage.getItem(STORAGE_KEY);
    if (!appointments) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockAppointments));
    }
  }

  private getAppointments(): Appointment[] {
    this.initializeStorage();
    const appointments = localStorage.getItem(STORAGE_KEY);
    return appointments ? JSON.parse(appointments) : mockAppointments;
  }

  private saveAppointments(appointments: Appointment[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  }

  async getAllAppointments(): Promise<Appointment[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return this.getAppointments();
  }

  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const appointments = this.getAppointments();
    return appointments
      .filter((apt) => apt.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getAppointmentsByProfessional(professionalId: string): Promise<Appointment[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const appointments = this.getAppointments();
    return appointments.filter((apt) => apt.professionalId === professionalId);
  }

  async getAppointmentById(id: string): Promise<Appointment | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const appointments = this.getAppointments();
    return appointments.find((apt) => apt.id === id) || null;
  }

  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const appointments = this.getAppointments();
    const professional = mockProfessionals.find((p) => p.id === data.professionalId);

    if (!professional) {
      throw new Error('Profissional não encontrado');
    }

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: data.patientId,
      professionalId: data.professionalId,
      professionalName: professional.name,
      specialty: professional.specialty || 'Geral',
      date: data.date,
      time: data.time,
      type: data.type,
      status: 'scheduled',
      notes: data.notes,
    };

    appointments.push(newAppointment);
    this.saveAppointments(appointments);

    return newAppointment;
  }

  async cancelAppointment(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const appointments = this.getAppointments();
    const index = appointments.findIndex((apt) => apt.id === id);

    if (index === -1) {
      throw new Error('Consulta não encontrada');
    }

    appointments[index].status = 'cancelled';
    this.saveAppointments(appointments);
  }

  async getSpecialties(): Promise<Specialty[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockSpecialties;
  }

  async getProfessionalsBySpecialty(specialtyName: string): Promise<Professional[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockProfessionals.filter((prof) => prof.specialty === specialtyName);
  }

  async getAvailableSlots(professionalId: string, date: string): Promise<TimeSlot[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const appointments = this.getAppointments();
    const bookedSlots = appointments
      .filter((apt) => apt.professionalId === professionalId && apt.date === date && apt.status === 'scheduled')
      .map((apt) => apt.time);

    const allSlots: TimeSlot[] = [
      { time: '08:00', available: true },
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: true },
      { time: '14:00', available: true },
      { time: '15:00', available: true },
      { time: '16:00', available: true },
      { time: '17:00', available: true },
    ];

    return allSlots.map((slot) => ({
      ...slot,
      available: !bookedSlots.includes(slot.time),
    }));
  }
}
