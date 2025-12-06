import { create } from "zustand";
import type { Appointment, Professional, Specialty, TimeSlot } from "@/types";
import RepositoryFactory from "@/repositories";
import type { CreateAppointmentData } from "@/repositories/interfaces/IAppointmentRepository";

interface AppointmentState {
  appointments: Appointment[];
  specialties: Specialty[];
  professionals: Professional[];
  availableSlots: TimeSlot[];
  isLoading: boolean;
  error: string | null;

  loadAppointments: () => Promise<void>;
  loadAppointmentsByPatient: (patientId: string) => Promise<void>;
  loadSpecialties: () => Promise<void>;
  loadProfessionalsBySpecialty: (specialtyName: string) => Promise<void>;
  loadAvailableSlots: (professionalId: string, date: string) => Promise<void>;
  createAppointment: (data: CreateAppointmentData) => Promise<Appointment>;
  cancelAppointment: (id: string) => Promise<void>;
  clearError: () => void;
}

const appointmentRepository = RepositoryFactory.getAppointmentRepository();

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [],
  specialties: [],
  professionals: [],
  availableSlots: [],
  isLoading: false,
  error: null,

  loadAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
      const appointments = await appointmentRepository.getAllAppointments();
      set({ appointments, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao carregar consultas",
        isLoading: false,
      });
    }
  },

  loadAppointmentsByPatient: async (patientId: string) => {
    set({ isLoading: true, error: null });
    try {
      const appointments = await appointmentRepository.getAppointmentsByPatient(
        patientId
      );
      set({ appointments, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao carregar consultas",
        isLoading: false,
      });
    }
  },

  loadSpecialties: async () => {
    set({ isLoading: true, error: null });
    try {
      const specialties = await appointmentRepository.getSpecialties();
      set({ specialties, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Erro ao carregar especialidades",
        isLoading: false,
      });
    }
  },

  loadProfessionalsBySpecialty: async (specialtyName: string) => {
    set({ isLoading: true, error: null });
    try {
      const professionals =
        await appointmentRepository.getProfessionalsBySpecialty(specialtyName);
      set({ professionals, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Erro ao carregar profissionais",
        isLoading: false,
      });
    }
  },

  loadAvailableSlots: async (professionalId: string, date: string) => {
    set({ isLoading: true, error: null });
    try {
      const availableSlots = await appointmentRepository.getAvailableSlots(
        professionalId,
        date
      );
      set({ availableSlots, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao carregar horários",
        isLoading: false,
      });
    }
  },

  createAppointment: async (data: CreateAppointmentData) => {
    set({ isLoading: true, error: null });
    try {
      const appointment = await appointmentRepository.createAppointment(data);
      set((state) => ({
        appointments: [appointment, ...state.appointments],
        isLoading: false,
      }));
      return appointment;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao agendar consulta",
        isLoading: false,
      });
      throw error;
    }
  },

  cancelAppointment: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await appointmentRepository.cancelAppointment(id);
      set((state) => ({
        appointments: state.appointments.map((apt) =>
          apt.id === id ? { ...apt, status: "cancelled" as const } : apt
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao cancelar consulta",
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
