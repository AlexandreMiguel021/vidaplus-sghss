import type { Bed, BedStatus } from "@/types";

export interface IBedRepository {
  getAllBeds(): Promise<Bed[]>;
  getBedById(id: string): Promise<Bed | null>;
  updateBedStatus(id: string, status: BedStatus, data?: Partial<Bed>): Promise<Bed>;
  getBedsByWard(ward: string): Promise<Bed[]>;
  getAvailableBeds(): Promise<Bed[]>;
}
