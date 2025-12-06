import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Video, FileText, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PatientDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-granite-900">Dashboard do Paciente</h1>
        <p className="text-granite-600 mt-1">Bem-vindo ao seu painel de saúde</p>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant="outline"
          className="h-24 flex flex-col gap-2"
          onClick={() => navigate('/patient/appointments')}
        >
          <Calendar className="h-6 w-6 text-jungle-teal-600" />
          <span>Agendar Consulta</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col gap-2"
          onClick={() => navigate('/patient/telemedicine')}
        >
          <Video className="h-6 w-6 text-jungle-teal-600" />
          <span>Telemedicina</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col gap-2"
          onClick={() => navigate('/patient/history')}
        >
          <FileText className="h-6 w-6 text-jungle-teal-600" />
          <span>Histórico Clínico</span>
        </Button>
      </div>

      {/* Próximas Consultas */}
      <Card>
        <CardHeader>
          <CardTitle>Próximas Consultas</CardTitle>
          <CardDescription>Suas consultas agendadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-granite-200 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-jungle-teal-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-jungle-teal-700" />
                </div>
                <div>
                  <p className="font-medium text-granite-900">Dr. Carlos Silva</p>
                  <p className="text-sm text-granite-600">Cardiologia</p>
                  <p className="text-xs text-granite-500 flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    25/11/2025 - 14:00
                  </p>
                </div>
              </div>
              <Badge variant="default">Confirmada</Badge>
            </div>

            <div className="text-center py-4 text-sm text-granite-500">
              Nenhuma outra consulta agendada
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
