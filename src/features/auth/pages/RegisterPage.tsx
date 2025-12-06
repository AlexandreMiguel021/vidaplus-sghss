import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RegisterForm } from '../components/RegisterForm';
import { Logo } from '@/components/ui/logo';

export function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-jungle-teal-50 to-muted-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
            <CardTitle>Criar conta</CardTitle>
            <CardDescription>
              Preencha seus dados para criar uma conta de paciente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
