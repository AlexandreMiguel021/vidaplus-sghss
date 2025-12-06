import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-jungle-teal-50 to-muted-teal-50 flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="flex items-center justify-center gap-3">
          <Heart className="w-16 h-16 text-jungle-teal-700" />
          <h1 className="text-6xl font-bold text-granite-900">VidaPlus</h1>
        </div>

        <h2 className="text-3xl font-semibold text-granite-800">
          Sistema de Gestão Hospitalar e de Serviços de Saúde
        </h2>

        <p className="text-xl text-granite-700 max-w-2xl mx-auto">
          Centralize a gestão de pacientes, profissionais de saúde,
          administração hospitalar e telemedicina em uma única plataforma.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" variant="default" onClick={() => navigate('/login')}>
            Entrar no Sistema
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/register')}>
            Criar Conta
          </Button>
        </div>

        <div className="mt-12 p-6 bg-white/80 rounded-lg backdrop-blur-sm shadow-sm">
          <h3 className="text-lg font-semibold text-jungle-teal-700 mb-4">
            Funcionalidades Principais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-granite-700">
            <div className="p-4 bg-jungle-teal-50 rounded-md">
              <strong>Cadastro e Atendimento</strong>
              <p className="mt-2">Consultas, exames, prontuários e telemedicina</p>
            </div>
            <div className="p-4 bg-muted-teal-50 rounded-md">
              <strong>Gestão de Profissionais</strong>
              <p className="mt-2">Agendas, prescrições e históricos</p>
            </div>
            <div className="p-4 bg-granite-100 rounded-md">
              <strong>Administração</strong>
              <p className="mt-2">Leitos, relatórios e suprimentos</p>
            </div>
          </div>
        </div>

        <div className="text-sm text-granite-700 mt-8">
          <p className="font-mono">Fase 2: Autenticação e Layout - Completo ✅</p>
          <p className="mt-2">
            Repository Pattern • Zustand • React Hook Form • Zod
          </p>
        </div>
      </div>
    </div>
  );
}
