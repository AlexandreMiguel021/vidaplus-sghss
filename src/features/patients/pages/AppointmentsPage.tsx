import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useAppointmentStore } from "@/stores/appointmentStore";
import { ArrowLeft, ArrowRight, Check, Video, MapPin } from "lucide-react";
import { ROUTES } from "@/app/routes";

export function AppointmentsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    specialties,
    professionals,
    availableSlots,
    loadSpecialties,
    loadProfessionalsBySpecialty,
    loadAvailableSlots,
    createAppointment,
    isLoading,
  } = useAppointmentStore();

  const [step, setStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedProfessional, setSelectedProfessional] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentType, setAppointmentType] = useState<
    "in-person" | "telemedicine"
  >("in-person");

  useEffect(() => {
    loadSpecialties();
  }, [loadSpecialties]);

  const handleSpecialtyChange = async (specialty: string) => {
    setSelectedSpecialty(specialty);
    setSelectedProfessional("");
    setSelectedDate("");
    setSelectedTime("");
    await loadProfessionalsBySpecialty(specialty);
  };

  const handleProfessionalChange = (professionalId: string) => {
    setSelectedProfessional(professionalId);
    setSelectedDate("");
    setSelectedTime("");
  };

  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
    if (selectedProfessional && date) {
      await loadAvailableSlots(selectedProfessional, date);
    }
  };

  const handleConfirm = async () => {
    if (!user) return;

    try {
      await createAppointment({
        patientId: user.id,
        professionalId: selectedProfessional,
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
      });
      navigate(ROUTES.PATIENT_DASHBOARD);
    } catch (error) {
      console.error("Erro ao agendar:", error);
    }
  };

  const canProceed = () => {
    if (step === 1) return selectedSpecialty && selectedProfessional;
    if (step === 2) return selectedDate && selectedTime;
    if (step === 3) return appointmentType;
    return false;
  };

  const selectedProfessionalData = professionals.find(
    (p) => p.id === selectedProfessional
  );
  const selectedSpecialtyData = specialties.find(
    (s) => s.name === selectedSpecialty
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-granite-900">
          Agendar Consulta
        </h1>
        <p className="text-granite-600 mt-1">
          Siga os passos para agendar sua consulta
        </p>
      </div>

      <div className="flex items-center justify-center gap-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center font-medium ${
                s === step
                  ? "bg-jungle-teal-500 text-orange-500"
                  : s < step
                  ? "bg-jungle-teal-200 text-jungle-teal-700"
                  : "bg-granite-200 text-granite-500"
              }`}
            >
              {s < step ? <Check className="h-5 w-5" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`h-1 w-16 ${
                  s < step ? "bg-jungle-teal-200" : "bg-granite-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Escolha a Especialidade e Profissional"}
            {step === 2 && "Escolha Data e Horário"}
            {step === 3 && "Confirme os Dados"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Selecione a especialidade médica e o profissional"}
            {step === 2 && "Selecione a data e horário disponível"}
            {step === 3 && "Revise as informações e confirme o agendamento"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Especialidade</Label>
                <Select
                  value={selectedSpecialty}
                  onValueChange={handleSpecialtyChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty.id} value={specialty.name}>
                        {specialty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {professionals.length > 0 && (
                <div className="space-y-2">
                  <Label>Profissional</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {professionals.map((prof) => (
                      <div
                        key={prof.id}
                        onClick={() => handleProfessionalChange(prof.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition ${
                          selectedProfessional === prof.id
                            ? "border-jungle-teal-500 bg-jungle-teal-50"
                            : "border-granite-200 hover:border-jungle-teal-300"
                        }`}
                      >
                        <p className="font-medium text-granite-900">
                          {prof.name}
                        </p>
                        <p className="text-sm text-granite-600">
                          {prof.license}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Data</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {availableSlots.length > 0 && (
                <div className="space-y-2">
                  <Label>Horário Disponível</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={
                          selectedTime === slot.time ? "default" : "outline"
                        }
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className="w-full"
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-4 p-4 bg-granite-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-granite-600">Especialidade:</span>
                  <span className="font-medium">
                    {selectedSpecialtyData?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-granite-600">Profissional:</span>
                  <span className="font-medium">
                    {selectedProfessionalData?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-granite-600">Data:</span>
                  <span className="font-medium">
                    {new Date(selectedDate).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-granite-600">Horário:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipo de Consulta</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setAppointmentType("in-person")}
                    className={`p-4 border rounded-lg cursor-pointer transition ${
                      appointmentType === "in-person"
                        ? "border-jungle-teal-500 bg-jungle-teal-50"
                        : "border-granite-200 hover:border-jungle-teal-300"
                    }`}
                  >
                    <MapPin className="h-5 w-5 mb-2 text-jungle-teal-600" />
                    <p className="font-medium">Presencial</p>
                  </div>
                  <div
                    onClick={() => setAppointmentType("telemedicine")}
                    className={`p-4 border rounded-lg cursor-pointer transition ${
                      appointmentType === "telemedicine"
                        ? "border-jungle-teal-500 bg-jungle-teal-50"
                        : "border-granite-200 hover:border-jungle-teal-300"
                    }`}
                  >
                    <Video className="h-5 w-5 mb-2 text-jungle-teal-600" />
                    <p className="font-medium">Telemedicina</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() =>
                step === 1 ? navigate("/patient/dashboard") : setStep(step - 1)
              }
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {step === 1 ? "Cancelar" : "Voltar"}
            </Button>

            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed() || isLoading}
              >
                Próximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleConfirm}
                disabled={!canProceed() || isLoading}
              >
                {isLoading ? "Agendando..." : "Confirmar Agendamento"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
