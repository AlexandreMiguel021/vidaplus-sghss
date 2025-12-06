import { create } from "zustand";
import type { User, Patient, Professional } from "@/types";
import { LocalUserRepository } from "@/repositories/implementations/LocalUserRepository";

const userRepository = new LocalUserRepository();

interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  loadUsers: () => Promise<void>;
  createUser: (userData: Omit<User, "id" | "createdAt">) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  getAllPatients: () => Promise<Patient[]>;
  getAllProfessionals: () => Promise<Professional[]>;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  isLoading: false,
  error: null,

  loadUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await userRepository.getAllUsers();
      set({ users, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao carregar usuários",
        isLoading: false,
      });
    }
  },

  createUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      await userRepository.createUser(userData);
      const users = await userRepository.getAllUsers();
      set({ users, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erro ao criar usuário",
        isLoading: false,
      });
      throw error;
    }
  },

  updateUser: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await userRepository.updateUser(id, data);
      const users = await userRepository.getAllUsers();
      set({ users, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao atualizar usuário",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await userRepository.deleteUser(id);
      const users = await userRepository.getAllUsers();
      set({ users, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao excluir usuário",
        isLoading: false,
      });
      throw error;
    }
  },

  getAllPatients: async () => {
    return await userRepository.getAllPatients();
  },

  getAllProfessionals: async () => {
    return await userRepository.getAllProfessionals();
  },

  clearError: () => set({ error: null }),
}));
