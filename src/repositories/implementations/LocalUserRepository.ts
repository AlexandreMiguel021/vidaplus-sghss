import type { User, Patient, Professional } from "@/types";
import type { IUserRepository } from "../interfaces/IUserRepository";
import { mockPatients } from "@/mocks/patients";
import { mockProfessionals } from "@/mocks/professionals";

const STORAGE_KEY = "sghss_users";

export class LocalUserRepository implements IUserRepository {
  private getUsers(): User[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    const initialUsers: User[] = [
      ...mockPatients,
      ...mockProfessionals,
      {
        id: "admin-1",
        name: "Admin Sistema",
        email: "admin@vidaplus.com",
        role: "admin",
        cpf: "000.000.000-00",
        phone: "(11) 0000-0000",
        createdAt: "2024-01-01T00:00:00.000Z",
      },
    ];
    this.saveUsers(initialUsers);
    return initialUsers;
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  async getAllUsers(): Promise<User[]> {
    return this.getUsers();
  }

  async getUserById(id: string): Promise<User | null> {
    const users = this.getUsers();
    return users.find((u) => u.id === id) || null;
  }

  async createUser(userData: Omit<User, "id" | "createdAt">): Promise<User> {
    const users = this.getUsers();
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error("Usuário não encontrado");
    }
    users[index] = { ...users[index], ...data };
    this.saveUsers(users);
    return users[index];
  }

  async deleteUser(id: string): Promise<void> {
    const users = this.getUsers();
    const filtered = users.filter((u) => u.id !== id);
    this.saveUsers(filtered);
  }

  async getAllPatients(): Promise<Patient[]> {
    const users = this.getUsers();
    return users.filter((u) => u.role === "patient") as Patient[];
  }

  async getAllProfessionals(): Promise<Professional[]> {
    const users = this.getUsers();
    return users.filter((u) => u.role === "professional") as Professional[];
  }
}
