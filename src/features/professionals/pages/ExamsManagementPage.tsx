import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useExamStore } from "@/stores/examStore";
import { useUserStore } from "@/stores/userStore";
import type { Exam, ExamStatus } from "@/types";
import { Plus, FileText, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const examSchema = z.object({
  patientId: z.string().min(1, "Selecione um paciente"),
  type: z.string().min(1, "Selecione o tipo de exame"),
  description: z.string().min(5, "Descrição deve ter pelo menos 5 caracteres"),
  scheduledDate: z.string().optional(),
  notes: z.string().optional(),
});

type ExamFormData = z.infer<typeof examSchema>;

const resultsSchema = z.object({
  results: z.string().min(10, "Resultado deve ter pelo menos 10 caracteres"),
  completedDate: z.string().min(1, "Data de conclusão é obrigatória"),
});

type ResultsFormData = z.infer<typeof resultsSchema>;

export function ExamsManagementPage() {
  const { user } = useAuth();
  const {
    exams,
    examTypes,
    isLoading,
    loadExams,
    loadExamTypes,
    createExam,
    updateExamStatus,
  } = useExamStore();
  const { getAllPatients } = useUserStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isResultsDialogOpen, setIsResultsDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [patients, setPatients] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
  });

  const {
    register: registerResults,
    handleSubmit: handleSubmitResults,
    formState: { errors: errorsResults },
    reset: resetResults,
  } = useForm<ResultsFormData>({
    resolver: zodResolver(resultsSchema),
  });

  useEffect(() => {
    loadExams();
    loadExamTypes();
    loadPatients();
  }, []);

  const loadPatients = async () => {
    const allPatients = await getAllPatients();
    setPatients(allPatients);
  };

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || exam.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const onSubmit = async (data: ExamFormData) => {
    try {
      await createExam({
        patientId: data.patientId,
        professionalId: user!.id,
        type: data.type,
        description: data.description,
        scheduledDate: data.scheduledDate,
        notes: data.notes,
      });
      handleCloseCreateDialog();
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitResults = async (data: ResultsFormData) => {
    if (!selectedExam) return;
    try {
      await updateExamStatus(
        selectedExam.id,
        "completed",
        data.results,
        data.completedDate
      );
      handleCloseResultsDialog();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
    reset();
  };

  const handleCloseResultsDialog = () => {
    setIsResultsDialogOpen(false);
    setSelectedExam(null);
    resetResults();
  };

  const handleAddResults = (exam: Exam) => {
    setSelectedExam(exam);
    setIsResultsDialogOpen(true);
  };

  const handleStartExam = async (id: string) => {
    await updateExamStatus(id, "in_progress");
  };

  const getStatusBadgeVariant = (status: ExamStatus) => {
    switch (status) {
      case "requested":
        return "secondary";
      case "in_progress":
        return "default";
      case "completed":
        return "success";
      case "cancelled":
        return "danger";
    }
  };

  const getStatusLabel = (status: ExamStatus) => {
    switch (status) {
      case "requested":
        return "Solicitado";
      case "in_progress":
        return "Em Andamento";
      case "completed":
        return "Concluído";
      case "cancelled":
        return "Cancelado";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-granite-900">
            Gestão de Exames
          </h1>
          <p className="text-granite-600 mt-1">
            Solicite e gerencie exames laboratoriais
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Solicitar Exame
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exames Solicitados</CardTitle>
          <CardDescription>{exams.length} exame(s) no sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-granite-400" />
              <Input
                placeholder="Buscar por paciente ou tipo de exame"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="requested">Solicitados</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluídos</SelectItem>
                <SelectItem value="cancelled">Cancelados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jungle-teal-600 mx-auto"></div>
              <p className="mt-4 text-granite-600">Carregando exames...</p>
            </div>
          ) : filteredExams.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-granite-400 mx-auto mb-4" />
              <p className="text-granite-600">Nenhum exame encontrado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredExams.map((exam) => (
                <Card key={exam.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold text-lg">{exam.type}</p>
                          <Badge variant={getStatusBadgeVariant(exam.status)}>
                            {getStatusLabel(exam.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-granite-600 mb-1">
                          <span className="font-medium">Paciente:</span>{" "}
                          {exam.patientName}
                        </p>
                        <p className="text-sm text-granite-600 mb-1">
                          <span className="font-medium">Solicitado em:</span>{" "}
                          {new Date(exam.requestDate).toLocaleDateString(
                            "pt-BR"
                          )}
                        </p>
                        {exam.scheduledDate && (
                          <p className="text-sm text-granite-600 mb-1">
                            <span className="font-medium">Agendado para:</span>{" "}
                            {new Date(exam.scheduledDate).toLocaleDateString(
                              "pt-BR"
                            )}
                          </p>
                        )}
                        <p className="text-sm text-granite-600 mt-2">
                          {exam.description}
                        </p>
                        {exam.results && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                            <p className="text-sm font-medium text-green-900 mb-1">
                              Resultado:
                            </p>
                            <p className="text-sm text-green-800">
                              {exam.results}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        {exam.status === "requested" && (
                          <Button
                            size="sm"
                            onClick={() => handleStartExam(exam.id)}
                          >
                            Iniciar
                          </Button>
                        )}
                        {exam.status === "in_progress" && !exam.results && (
                          <Button
                            size="sm"
                            onClick={() => handleAddResults(exam)}
                          >
                            Adicionar Resultado
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={handleCloseCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar Novo Exame</DialogTitle>
            <DialogDescription>
              Preencha os dados para solicitar um exame
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientId">Paciente</Label>
              <Select onValueChange={(value) => setValue("patientId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.patientId && (
                <p className="text-sm text-red-600">
                  {errors.patientId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Exame</Label>
              <Select onValueChange={(value) => setValue("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de exame" />
                </SelectTrigger>
                <SelectContent>
                  {examTypes.map((type) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name} - {type.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <textarea
                id="description"
                {...register("description")}
                className="w-full min-h-[80px] px-3 py-2 border border-granite-300 rounded-md focus:outline-none focus:ring-2 focus:ring-jungle-teal-500"
                placeholder="Motivo da solicitação..."
              />
              {errors.description && (
                <p className="text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Data Agendada (opcional)</Label>
              <Input id="scheduledDate" type="date" {...register("scheduledDate")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <textarea
                id="notes"
                {...register("notes")}
                className="w-full min-h-[60px] px-3 py-2 border border-granite-300 rounded-md focus:outline-none focus:ring-2 focus:ring-jungle-teal-500"
                placeholder="Observações adicionais..."
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Solicitar Exame
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseCreateDialog}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isResultsDialogOpen}
        onOpenChange={handleCloseResultsDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Resultado do Exame</DialogTitle>
            <DialogDescription>
              {selectedExam?.type} - {selectedExam?.patientName}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitResults(onSubmitResults)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="results">Resultado</Label>
              <textarea
                id="results"
                {...registerResults("results")}
                className="w-full min-h-[120px] px-3 py-2 border border-granite-300 rounded-md focus:outline-none focus:ring-2 focus:ring-jungle-teal-500"
                placeholder="Descreva o resultado do exame..."
              />
              {errorsResults.results && (
                <p className="text-sm text-red-600">
                  {errorsResults.results.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="completedDate">Data de Conclusão</Label>
              <Input
                id="completedDate"
                type="date"
                {...registerResults("completedDate")}
              />
              {errorsResults.completedDate && (
                <p className="text-sm text-red-600">
                  {errorsResults.completedDate.message}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Salvar Resultado
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseResultsDialog}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
