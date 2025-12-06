import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "../components/LoginForm";
import { Logo } from "@/components/ui/logo";

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-jungle-teal-50 to-muted-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <Logo />
          </div>
          <p className="text-granite-600">
            Sistema de Gestão Hospitalar e de Serviços de Saúde
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>Acesse sua conta para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-granite-600">
          <p className="mb-2">Usuários de teste:</p>
          <div className="space-y-1 text-xs">
            <p>
              <strong>Paciente:</strong> maria.santos@email.com / 123456
            </p>
            <p>
              <strong>Médico:</strong> carlos.silva@vidaplus.com / 123456
            </p>
            <p>
              <strong>Admin:</strong> admin@vidaplus.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
