import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useAppointmentStore } from "@/stores/appointmentStore";
import type { Appointment } from "@/types";
import { MapPin, Video, Eye } from "lucide-react";

export function HistoryPage() {
  const { user } = useAuth();
  const {
    appointments,
    loadAppointmentsByPatient,
    cancelAppointment,
    isLoading,
  } = useAppointmentStore();

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    if (user) {
      loadAppointmentsByPatient(user.id);
    }
  }, [user, loadAppointmentsByPatient]);

  const filteredAppointments = appointments.filter((apt) => {
    if (filterStatus !== "all" && apt.status !== filterStatus) return false;
    if (filterType !== "all" && apt.type !== filterType) return false;
    if (filterDate && apt.date !== filterDate) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: "default" as const,
      completed: "success" as const,
      cancelled: "danger" as const,
    };
    const labels = {
      scheduled: "Agendada",
      completed: "Realizada",
      cancelled: "Cancelada",
    };
    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    return type === "in-person" ? (
      <div className="flex items-center gap-1 text-sm text-granite-600">
        <MapPin className="h-4 w-4" />
        Presencial
      </div>
    ) : (
      <div className="flex items-center gap-1 text-sm text-granite-600">
        <Video className="h-4 w-4" />
        Telemedicina
      </div>
    );
  };

  const handleCancelAppointment = async (id: string) => {
    if (confirm("Deseja realmente cancelar esta consulta?")) {
      await cancelAppointment(id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-granite-900">
          Histórico Clínico
        </h1>
        <p className="text-granite-600 mt-1">
          Visualize suas consultas passadas e agendadas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre suas consultas por status, tipo ou data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="scheduled">Agendadas</SelectItem>
                  <SelectItem value="completed">Realizadas</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="in-person">Presencial</SelectItem>
                  <SelectItem value="telemedicine">Telemedicina</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data</Label>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Consultas</CardTitle>
          <CardDescription>
            {filteredAppointments.length} consulta(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-jungle-teal-600 mx-auto"></div>
              <p className="mt-2 text-granite-600">Carregando...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-8 text-granite-600">
              Nenhuma consulta encontrada
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Profissional</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      {new Date(appointment.date).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.professionalName}</TableCell>
                    <TableCell>{appointment.specialty}</TableCell>
                    <TableCell>{getTypeBadge(appointment.type)}</TableCell>
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedAppointment(appointment)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {appointment.status === "scheduled" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleCancelAppointment(appointment.id)
                            }
                          >
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedAppointment}
        onOpenChange={() => setSelectedAppointment(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Consulta</DialogTitle>
            <DialogDescription>
              Informações completas sobre a consulta
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-granite-600">Data</p>
                  <p className="font-medium">
                    {new Date(selectedAppointment.date).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-granite-600">Horário</p>
                  <p className="font-medium">{selectedAppointment.time}</p>
                </div>
                <div>
                  <p className="text-sm text-granite-600">Profissional</p>
                  <p className="font-medium">
                    {selectedAppointment.professionalName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-granite-600">Especialidade</p>
                  <p className="font-medium">{selectedAppointment.specialty}</p>
                </div>
                <div>
                  <p className="text-sm text-granite-600">Tipo</p>
                  <p className="font-medium">
                    {selectedAppointment.type === "in-person"
                      ? "Presencial"
                      : "Telemedicina"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-granite-600">Status</p>
                  <div className="mt-1">
                    {getStatusBadge(selectedAppointment.status)}
                  </div>
                </div>
              </div>
              {selectedAppointment.notes && (
                <div>
                  <p className="text-sm text-granite-600">Observações</p>
                  <p className="mt-1">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
