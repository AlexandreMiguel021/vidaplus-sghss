import type { Bed, BedStatus } from "@/types";
import type { IBedRepository } from "../interfaces/IBedRepository";
import { mockBeds } from "@/mocks/beds";

const STORAGE_KEY = "sghss_beds";

export class LocalBedRepository implements IBedRepository {
  private getBeds(): Bed[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    this.saveBeds(mockBeds);
    return mockBeds;
  }

  private saveBeds(beds: Bed[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(beds));
  }

  async getAllBeds(): Promise<Bed[]> {
    return this.getBeds();
  }

  async getBedById(id: string): Promise<Bed | null> {
    const beds = this.getBeds();
    return beds.find((b) => b.id === id) || null;
  }

  async updateBedStatus(
    id: string,
    status: BedStatus,
    data?: Partial<Bed>
  ): Promise<Bed> {
    const beds = this.getBeds();
    const index = beds.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error("Leito não encontrado");
    }
    beds[index] = { ...beds[index], status, ...data };
    this.saveBeds(beds);
    return beds[index];
  }

  async getBedsByWard(ward: string): Promise<Bed[]> {
    const beds = this.getBeds();
    return beds.filter((b) => b.ward === ward);
  }

  async getAvailableBeds(): Promise<Bed[]> {
    const beds = this.getBeds();
    return beds.filter((b) => b.status === "available");
  }
}
