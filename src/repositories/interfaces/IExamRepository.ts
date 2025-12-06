import type { Exam, ExamType } from "@/types";

export interface CreateExamData {
  patientId: string;
  professionalId: string;
  type: string;
  description: string;
  scheduledDate?: string;
  notes?: string;
}

export interface IExamRepository {
  getAllExams(): Promise<Exam[]>;
  getExamsByPatient(patientId: string): Promise<Exam[]>;
  getExamsByProfessional(professionalId: string): Promise<Exam[]>;
  getExamById(id: string): Promise<Exam | null>;
  createExam(data: CreateExamData): Promise<Exam>;
  updateExamStatus(
    id: string,
    status: string,
    results?: string,
    completedDate?: string
  ): Promise<Exam>;
  cancelExam(id: string): Promise<void>;
  getExamTypes(): Promise<ExamType[]>;
}
