import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useAppointmentStore } from "@/stores/appointmentStore";
import type { Appointment } from "@/types";
import { Clock, MapPin, User, Video } from "lucide-react";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useMemo, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import type { View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("pt-br");
const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Appointment;
}

export function SchedulePage() {
  const { user } = useAuth();
  const { appointments, isLoading } = useAppointmentStore();
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    if (user) {
      useAppointmentStore.getState().loadAppointmentsByPatient(user.id);
    }
  }, [user]);

  const professionalAppointments = useMemo(() => {
    if (!user) return [];
    return appointments.filter(
      (apt) => apt.professionalId === user.id || apt.professionalId === "prof-1"
    );
  }, [appointments, user]);

  const events: CalendarEvent[] = useMemo(() => {
    return professionalAppointments.map((apt) => {
      const [hours, minutes] = apt.time.split(":");
      const start = new Date(apt.date);
      start.setHours(parseInt(hours), parseInt(minutes));

      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 30);

      return {
        id: apt.id,
        title: `${apt.patientName || "Paciente"} - ${apt.time}`,
        start,
        end,
        resource: apt,
      };
    });
  }, [professionalAppointments]);

  const eventStyleGetter = (event: CalendarEvent) => {
    const apt = event.resource;
    let backgroundColor = "#6a956d";

    if (apt.status === "cancelled") backgroundColor = "#ef4444";
    if (apt.status === "completed") backgroundColor = "#22c55e";
    if (apt.type === "telemedicine") backgroundColor = "#3b82f6";

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: apt.status === "cancelled" ? 0.6 : 1,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  const messages = {
    allDay: "Dia todo",
    previous: "Anterior",
    next: "Próximo",
    today: "Hoje",
    month: "Mês",
    week: "Semana",
    day: "Dia",
    agenda: "Agenda",
    date: "Data",
    time: "Hora",
    event: "Evento",
    noEventsInRange: "Não há consultas neste período",
    showMore: (total: number) => `+ ${total} mais`,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-granite-900">Minha Agenda</h1>
        <p className="text-granite-600 mt-1">
          Visualize e gerencie suas consultas
        </p>
      </div>

      <div className="flex gap-2">
        <Badge
          variant={view === "month" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setView("month")}
        >
          Mês
        </Badge>
        <Badge
          variant={view === "week" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setView("week")}
        >
          Semana
        </Badge>
        <Badge
          variant={view === "day" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setView("day")}
        >
          Dia
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendário de Consultas</CardTitle>
          <CardDescription>
            {professionalAppointments.length} consulta(s) cadastrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jungle-teal-600 mx-auto"></div>
              <p className="mt-4 text-granite-600">Carregando agenda...</p>
            </div>
          ) : (
            <div style={{ height: 600 }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                view={view}
                onView={setView}
                date={date}
                onNavigate={setDate}
                onSelectEvent={(event) =>
                  setSelectedAppointment(event.resource)
                }
                eventPropGetter={eventStyleGetter}
                messages={messages}
                style={{ height: "100%" }}
              />
            </div>
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
              Informações sobre o atendimento
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-granite-50 rounded-lg">
                <User className="h-5 w-5 text-jungle-teal-600" />
                <div>
                  <p className="text-sm text-granite-600">Paciente</p>
                  <p className="font-medium">
                    {selectedAppointment.patientName}
                  </p>
                </div>
              </div>

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
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <p className="font-medium">{selectedAppointment.time}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-granite-600">Tipo de Consulta</p>
                <div className="flex items-center gap-2 mt-1">
                  {selectedAppointment.type === "in-person" ? (
                    <>
                      <MapPin className="h-4 w-4 text-jungle-teal-600" />
                      <span>Presencial</span>
                    </>
                  ) : (
                    <>
                      <Video className="h-4 w-4 text-blue-600" />
                      <span>Telemedicina</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-granite-600">Status</p>
                <div className="mt-1">
                  <Badge
                    variant={
                      selectedAppointment.status === "scheduled"
                        ? "default"
                        : selectedAppointment.status === "completed"
                        ? "success"
                        : "danger"
                    }
                  >
                    {selectedAppointment.status === "scheduled"
                      ? "Agendada"
                      : selectedAppointment.status === "completed"
                      ? "Realizada"
                      : "Cancelada"}
                  </Badge>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <p className="text-sm text-granite-600">Observações</p>
                  <p className="mt-1 text-sm">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
