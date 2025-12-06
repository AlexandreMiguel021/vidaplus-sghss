import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, ClipboardCheck } from 'lucide-react';

export function ProfessionalDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-granite-900">Dashboard do Profissional</h1>
        <p className="text-granite-600 mt-1">Gerencie seus atendimentos e agenda</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-jungle-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-granite-600 mt-1">3 realizadas, 5 pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pacientes</CardTitle>
            <Users className="h-4 w-4 text-jungle-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-granite-600 mt-1">Total de pacientes ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Atendimentos</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-jungle-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-granite-600 mt-1">Esta semana</p>
          </CardContent>
        </Card>
      </div>

      {/* Próximos Atendimentos */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Atendimentos</CardTitle>
          <CardDescription>Agenda do dia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border-l-4 border-jungle-teal-500 bg-jungle-teal-50 rounded">
              <div>
                <p className="font-medium text-granite-900">Maria Santos</p>
                <p className="text-sm text-granite-600">Consulta de rotina</p>
                <p className="text-xs text-granite-500 mt-1">14:00 - 14:30</p>
              </div>
            </div>
            <div className="text-center py-4 text-sm text-granite-500">
              Nenhum outro atendimento hoje
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
