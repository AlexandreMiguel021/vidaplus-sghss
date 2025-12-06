import type { User } from "@/types";
import type {
  IAuthRepository,
  LoginCredentials,
  RegisterData,
} from "../interfaces/IAuthRepository";

const STORAGE_KEY = "sghss_current_user";
const USERS_KEY = "sghss_users";

const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Dr. Carlos Silva",
    email: "carlos.silva@vidaplus.com",
    role: "professional",
    cpf: "123.456.789-00",
    phone: "(11) 98765-4321",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    role: "patient",
    cpf: "987.654.321-00",
    phone: "(11) 91234-5678",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Admin VidaPlus",
    email: "admin@vidaplus.com",
    role: "admin",
    cpf: "111.222.333-44",
    phone: "(11) 99999-9999",
    createdAt: "2024-01-01",
  },
];

const MOCK_PASSWORDS: Record<string, string> = {
  "carlos.silva@vidaplus.com": "123456",
  "maria.santos@email.com": "123456",
  "admin@vidaplus.com": "admin123",
};

export class LocalAuthRepository implements IAuthRepository {
  private initializeStorage(): void {
    const users = localStorage.getItem(USERS_KEY);
    if (!users) {
      localStorage.setItem(USERS_KEY, JSON.stringify(MOCK_USERS));
    }
  }

  private getUsers(): User[] {
    this.initializeStorage();
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : MOCK_USERS;
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  async login(credentials: LoginCredentials): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = this.getUsers();
    const user = users.find((u) => u.email === credentials.email);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const expectedPassword = MOCK_PASSWORDS[credentials.email];
    if (credentials.password !== expectedPassword) {
      throw new Error("Senha incorreta");
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

    return user;
  }

  async register(data: RegisterData): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = this.getUsers();

    if (users.find((u) => u.email === data.email)) {
      throw new Error("Email já cadastrado");
    }

    if (users.find((u) => u.cpf === data.cpf)) {
      throw new Error("CPF já cadastrado");
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      role: "patient",
      cpf: data.cpf,
      phone: data.phone,
      createdAt: new Date().toISOString().split("T")[0],
    };

    MOCK_PASSWORDS[data.email] = data.password;

    users.push(newUser);
    this.saveUsers(users);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));

    return newUser;
  }

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    localStorage.removeItem(STORAGE_KEY);
  }

  async getCurrentUser(): Promise<User | null> {
    const user = localStorage.getItem(STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  }

  async updateUser(user: User): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === user.id);

    if (index === -1) {
      throw new Error("Usuário não encontrado");
    }

    users[index] = user;
    this.saveUsers(users);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

    return user;
  }
}
