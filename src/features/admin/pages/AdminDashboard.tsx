import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Bed, Calendar } from 'lucide-react';

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-granite-900">Dashboard Administrativo</h1>
        <p className="text-granite-600 mt-1">Visão geral do sistema</p>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
            <Users className="h-4 w-4 text-jungle-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-granite-600 mt-1">+12% em relação ao mês passado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profissionais</CardTitle>
            <Users className="h-4 w-4 text-jungle-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-granite-600 mt-1">Médicos, enfermeiros e técnicos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-jungle-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-granite-600 mt-1">45 realizadas, 111 pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ocupação de Leitos</CardTitle>
            <Bed className="h-4 w-4 text-jungle-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-granite-600 mt-1">125 de 160 leitos ocupados</p>
          </CardContent>
        </Card>
      </div>

      {/* Atividades Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-granite-200">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Novo paciente cadastrado</p>
                <p className="text-xs text-granite-500">João da Silva - há 5 minutos</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pb-4 border-b border-granite-200">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Consulta agendada</p>
                <p className="text-xs text-granite-500">Maria Santos com Dr. Carlos - há 12 minutos</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Leito liberado</p>
                <p className="text-xs text-granite-500">Leito 304 - Enfermaria 3 - há 30 minutos</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
