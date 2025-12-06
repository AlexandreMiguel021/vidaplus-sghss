import type { User, Patient, Professional } from "@/types";

export interface IUserRepository {
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  createUser(user: Omit<User, "id" | "createdAt">): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
  getAllPatients(): Promise<Patient[]>;
  getAllProfessionals(): Promise<Professional[]>;
}
