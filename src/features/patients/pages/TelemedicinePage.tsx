import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Video,
  Calendar,
  Clock,
  Phone,
  Mic,
  MicOff,
  VideoOff,
} from "lucide-react";

export function TelemedicinePage() {
  const { user } = useAuth();
  const { appointments, loadAppointmentsByPatient, isLoading } =
    useAppointmentStore();
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [inCall, setInCall] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  useEffect(() => {
    if (user) {
      loadAppointmentsByPatient(user.id);
    }
  }, [user, loadAppointmentsByPatient]);

  const telemedicineAppointments = appointments.filter(
    (apt) => apt.type === "telemedicine" && apt.status === "scheduled"
  );

  const handleStartCall = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setInCall(true);
  };

  const handleEndCall = () => {
    setInCall(false);
    setSelectedAppointment(null);
    setMicEnabled(true);
    setVideoEnabled(true);
  };

  const isAppointmentToday = (date: string) => {
    const today = new Date().toISOString().split("T")[0];
    return date === today;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-granite-900">Telemedicina</h1>
        <p className="text-granite-600 mt-1">Consultas online agendadas</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jungle-teal-600 mx-auto"></div>
          <p className="mt-4 text-granite-600">Carregando...</p>
        </div>
      ) : telemedicineAppointments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Video className="h-12 w-12 text-granite-400 mx-auto mb-4" />
            <p className="text-granite-600">
              Você não possui consultas de telemedicina agendadas
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {telemedicineAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {appointment.professionalName}
                    </CardTitle>
                    <CardDescription>{appointment.specialty}</CardDescription>
                  </div>
                  {isAppointmentToday(appointment.date) && (
                    <Badge variant="success">Hoje</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-granite-600">
                    <Calendar className="h-4 w-4" />
                    {new Date(appointment.date).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-granite-600">
                    <Clock className="h-4 w-4" />
                    {appointment.time}
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => handleStartCall(appointment)}
                  disabled={!isAppointmentToday(appointment.date)}
                >
                  <Video className="h-4 w-4 mr-2" />
                  {isAppointmentToday(appointment.date)
                    ? "Iniciar Consulta"
                    : "Aguardar Data"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={inCall} onOpenChange={() => handleEndCall()}>
        <DialogContent className="max-w-4xl h-[600px]">
          <DialogHeader>
            <DialogTitle>Consulta Online</DialogTitle>
            <DialogDescription>
              {selectedAppointment?.professionalName} -{" "}
              {selectedAppointment?.specialty}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 bg-gradient-to-br from-granite-900 to-granite-800 rounded-lg flex items-center justify-center relative">
            <div className="text-center text-white">
              <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Consulta de Telemedicina</p>
              <p className="text-sm opacity-75 mt-2">
                Em um ambiente real, aqui seria exibido o stream de vídeo
              </p>
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
              <Button
                variant={micEnabled ? "default" : "secondary"}
                size="lg"
                onClick={() => setMicEnabled(!micEnabled)}
                className="rounded-full h-14 w-14"
              >
                {micEnabled ? (
                  <Mic className="h-5 w-5" />
                ) : (
                  <MicOff className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant={videoEnabled ? "default" : "secondary"}
                size="lg"
                onClick={() => setVideoEnabled(!videoEnabled)}
                className="rounded-full h-14 w-14"
              >
                {videoEnabled ? (
                  <Video className="h-5 w-5" />
                ) : (
                  <VideoOff className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="default"
                size="lg"
                onClick={handleEndCall}
                className="rounded-full h-14 w-14 bg-red-600 hover:bg-red-700"
              >
                <Phone className="h-5 w-5 transform rotate-135" />
              </Button>
            </div>
          </div>

          <div className="text-sm text-granite-600 text-center">
            Consulta com {selectedAppointment?.professionalName} às{" "}
            {selectedAppointment?.time}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
