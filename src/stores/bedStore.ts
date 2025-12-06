import { create } from "zustand";
import type { Bed, BedStatus } from "@/types";
import { LocalBedRepository } from "@/repositories/implementations/LocalBedRepository";

const bedRepository = new LocalBedRepository();

interface BedState {
  beds: Bed[];
  isLoading: boolean;
  error: string | null;
  loadBeds: () => Promise<void>;
  updateBedStatus: (id: string, status: BedStatus, data?: Partial<Bed>) => Promise<void>;
  getBedsByWard: (ward: string) => Promise<Bed[]>;
  getAvailableBeds: () => Promise<Bed[]>;
  clearError: () => void;
}

export const useBedStore = create<BedState>((set) => ({
  beds: [],
  isLoading: false,
  error: null,

  loadBeds: async () => {
    set({ isLoading: true, error: null });
    try {
      const beds = await bedRepository.getAllBeds();
      set({ beds, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erro ao carregar leitos",
        isLoading: false,
      });
    }
  },

  updateBedStatus: async (id, status, data) => {
    set({ isLoading: true, error: null });
    try {
      await bedRepository.updateBedStatus(id, status, data);
      const beds = await bedRepository.getAllBeds();
      set({ beds, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erro ao atualizar leito",
        isLoading: false,
      });
      throw error;
    }
  },

  getBedsByWard: async (ward) => {
    return await bedRepository.getBedsByWard(ward);
  },

  getAvailableBeds: async () => {
    return await bedRepository.getAvailableBeds();
  },

  clearError: () => set({ error: null }),
}));
