import type { IAuthRepository } from "./interfaces/IAuthRepository";
import type { IAppointmentRepository } from "./interfaces/IAppointmentRepository";
import { LocalAuthRepository } from "./implementations/LocalAuthRepository";
import { LocalAppointmentRepository } from "./implementations/LocalAppointmentRepository";

class RepositoryFactory {
  private static authRepository: IAuthRepository | null = null;
  private static appointmentRepository: IAppointmentRepository | null = null;

  static getAuthRepository(): IAuthRepository {
    if (!this.authRepository) {
      this.authRepository = new LocalAuthRepository();
    }
    return this.authRepository;
  }

  static getAppointmentRepository(): IAppointmentRepository {
    if (!this.appointmentRepository) {
      this.appointmentRepository = new LocalAppointmentRepository();
    }
    return this.appointmentRepository;
  }
}

export default RepositoryFactory;
