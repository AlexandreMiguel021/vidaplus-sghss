import type { Exam, ExamType, ExamStatus } from "@/types";
import type {
  IExamRepository,
  CreateExamData,
} from "../interfaces/IExamRepository";
import { mockExams, mockExamTypes } from "@/mocks/exams";
import { mockProfessionals } from "@/mocks/professionals";
import { mockPatients } from "@/mocks/patients";

const STORAGE_KEY = "sghss_exams";

export class LocalExamRepository implements IExamRepository {
  private getExams(): Exam[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    this.saveExams(mockExams);
    return mockExams;
  }

  private saveExams(exams: Exam[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
  }

  async getAllExams(): Promise<Exam[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return this.getExams();
  }

  async getExamsByPatient(patientId: string): Promise<Exam[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const exams = this.getExams();
    return exams
      .filter((exam) => exam.patientId === patientId)
      .sort(
        (a, b) =>
          new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
      );
  }

  async getExamsByProfessional(professionalId: string): Promise<Exam[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const exams = this.getExams();
    return exams.filter((exam) => exam.professionalId === professionalId);
  }

  async getExamById(id: string): Promise<Exam | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const exams = this.getExams();
    return exams.find((exam) => exam.id === id) || null;
  }

  async createExam(data: CreateExamData): Promise<Exam> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const exams = this.getExams();
    const professional = mockProfessionals.find(
      (p) => p.id === data.professionalId
    );
    const patient = mockPatients.find((p) => p.id === data.patientId);

    if (!professional) {
      throw new Error("Profissional não encontrado");
    }

    if (!patient) {
      throw new Error("Paciente não encontrado");
    }

    const newExam: Exam = {
      id: `exam-${Date.now()}`,
      patientId: data.patientId,
      patientName: patient.name,
      professionalId: data.professionalId,
      professionalName: professional.name,
      type: data.type,
      description: data.description,
      requestDate: new Date().toISOString().split("T")[0],
      scheduledDate: data.scheduledDate,
      status: "requested",
      notes: data.notes,
    };

    exams.push(newExam);
    this.saveExams(exams);

    return newExam;
  }

  async updateExamStatus(
    id: string,
    status: string,
    results?: string,
    completedDate?: string
  ): Promise<Exam> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const exams = this.getExams();
    const index = exams.findIndex((exam) => exam.id === id);

    if (index === -1) {
      throw new Error("Exame não encontrado");
    }

    exams[index] = {
      ...exams[index],
      status: status as ExamStatus,
      results,
      completedDate,
    };

    this.saveExams(exams);
    return exams[index];
  }

  async cancelExam(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const exams = this.getExams();
    const index = exams.findIndex((exam) => exam.id === id);

    if (index === -1) {
      throw new Error("Exame não encontrado");
    }

    exams[index].status = "cancelled";
    this.saveExams(exams);
  }

  async getExamTypes(): Promise<ExamType[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockExamTypes;
  }
}
