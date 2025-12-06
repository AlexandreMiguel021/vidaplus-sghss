import { create } from "zustand";
import type { Exam, ExamType } from "@/types";
import { LocalExamRepository } from "@/repositories/implementations/LocalExamRepository";
import type { CreateExamData } from "@/repositories/interfaces/IExamRepository";

const examRepository = new LocalExamRepository();

interface ExamState {
  exams: Exam[];
  examTypes: ExamType[];
  isLoading: boolean;
  error: string | null;
  loadExams: () => Promise<void>;
  loadExamsByPatient: (patientId: string) => Promise<void>;
  loadExamsByProfessional: (professionalId: string) => Promise<void>;
  loadExamTypes: () => Promise<void>;
  createExam: (data: CreateExamData) => Promise<void>;
  updateExamStatus: (
    id: string,
    status: string,
    results?: string,
    completedDate?: string
  ) => Promise<void>;
  cancelExam: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useExamStore = create<ExamState>((set) => ({
  exams: [],
  examTypes: [],
  isLoading: false,
  error: null,

  loadExams: async () => {
    set({ isLoading: true, error: null });
    try {
      const exams = await examRepository.getAllExams();
      set({ exams, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao carregar exames",
        isLoading: false,
      });
    }
  },

  loadExamsByPatient: async (patientId: string) => {
    set({ isLoading: true, error: null });
    try {
      const exams = await examRepository.getExamsByPatient(patientId);
      set({ exams, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao carregar exames",
        isLoading: false,
      });
    }
  },

  loadExamsByProfessional: async (professionalId: string) => {
    set({ isLoading: true, error: null });
    try {
      const exams = await examRepository.getExamsByProfessional(professionalId);
      set({ exams, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao carregar exames",
        isLoading: false,
      });
    }
  },

  loadExamTypes: async () => {
    set({ isLoading: true, error: null });
    try {
      const examTypes = await examRepository.getExamTypes();
      set({ examTypes, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Erro ao carregar tipos de exame",
        isLoading: false,
      });
    }
  },

  createExam: async (data: CreateExamData) => {
    set({ isLoading: true, error: null });
    try {
      await examRepository.createExam(data);
      const exams = await examRepository.getAllExams();
      set({ exams, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao solicitar exame",
        isLoading: false,
      });
      throw error;
    }
  },

  updateExamStatus: async (
    id: string,
    status: string,
    results?: string,
    completedDate?: string
  ) => {
    set({ isLoading: true, error: null });
    try {
      await examRepository.updateExamStatus(id, status, results, completedDate);
      const exams = await examRepository.getAllExams();
      set({ exams, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao atualizar exame",
        isLoading: false,
      });
      throw error;
    }
  },

  cancelExam: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await examRepository.cancelExam(id);
      const exams = await examRepository.getAllExams();
      set({ exams, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao cancelar exame",
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
