import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useExamStore } from "@/stores/examStore";
import type { Exam, ExamStatus } from "@/types";
import {
  FileText,
  Eye,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

export function ExamsPage() {
  const { user } = useAuth();
  const { exams, isLoading, loadExamsByPatient } = useExamStore();
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadExamsByPatient(user.id);
    }
  }, [user]);

  const handleViewExam = (exam: Exam) => {
    setSelectedExam(exam);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedExam(null);
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

  const getStatusIcon = (status: ExamStatus) => {
    switch (status) {
      case "requested":
        return <AlertCircle className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-granite-900">Meus Exames</h1>
        <p className="text-granite-600 mt-1">
          Visualize seus exames solicitados e resultados
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Exames</CardTitle>
          <CardDescription>{exams.length} exame(s) registrado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jungle-teal-600 mx-auto"></div>
              <p className="mt-4 text-granite-600">Carregando exames...</p>
            </div>
          ) : exams.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-granite-400 mx-auto mb-4" />
              <p className="text-granite-600">Nenhum exame encontrado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo de Exame</TableHead>
                  <TableHead>Profissional</TableHead>
                  <TableHead>Data Solicitação</TableHead>
                  <TableHead>Data Agendada</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.type}</TableCell>
                    <TableCell>{exam.professionalName}</TableCell>
                    <TableCell>
                      {new Date(exam.requestDate).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      {exam.scheduledDate ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-granite-600" />
                          {new Date(exam.scheduledDate).toLocaleDateString(
                            "pt-BR"
                          )}
                        </div>
                      ) : (
                        <span className="text-granite-400">Não agendado</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(exam.status)}
                        className="flex items-center gap-1 w-fit"
                      >
                        {getStatusIcon(exam.status)}
                        {getStatusLabel(exam.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewExam(exam)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Exame</DialogTitle>
            <DialogDescription>
              Informações completas sobre o exame
            </DialogDescription>
          </DialogHeader>
          {selectedExam && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-granite-600">Tipo de Exame</p>
                  <p className="font-medium text-lg">{selectedExam.type}</p>
                </div>
                <div>
                  <p className="text-sm text-granite-600">Status</p>
                  <Badge
                    variant={getStatusBadgeVariant(selectedExam.status)}
                    className="flex items-center gap-1 w-fit mt-1"
                  >
                    {getStatusIcon(selectedExam.status)}
                    {getStatusLabel(selectedExam.status)}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-granite-600">Descrição</p>
                <p className="mt-1">{selectedExam.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-granite-600">
                    Profissional Solicitante
                  </p>
                  <p className="font-medium">
                    {selectedExam.professionalName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-granite-600">Data de Solicitação</p>
                  <p className="font-medium">
                    {new Date(selectedExam.requestDate).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                </div>
              </div>

              {selectedExam.scheduledDate && (
                <div>
                  <p className="text-sm text-granite-600">Data Agendada</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-5 w-5 text-jungle-teal-600" />
                    <p className="font-medium">
                      {new Date(selectedExam.scheduledDate).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  </div>
                </div>
              )}

              {selectedExam.completedDate && (
                <div>
                  <p className="text-sm text-granite-600">Data de Conclusão</p>
                  <p className="font-medium">
                    {new Date(selectedExam.completedDate).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                </div>
              )}

              {selectedExam.results && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="font-semibold text-green-900">Resultado</p>
                  </div>
                  <p className="text-sm text-green-800">
                    {selectedExam.results}
                  </p>
                </div>
              )}

              {selectedExam.notes && (
                <div>
                  <p className="text-sm text-granite-600">Observações</p>
                  <p className="mt-1 text-sm">{selectedExam.notes}</p>
                </div>
              )}

              {selectedExam.status === "requested" && (
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium">Aguardando Agendamento</p>
                    <p className="text-blue-700">
                      Você será notificado quando o exame for agendado.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
