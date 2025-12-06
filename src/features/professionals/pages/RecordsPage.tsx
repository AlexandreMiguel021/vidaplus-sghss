import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockPatients } from "@/mocks/patients";
import { Calendar, FileText, Search } from "lucide-react";
import { useState } from "react";

export function RecordsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [complaint, setComplaint] = useState("");
  const [examination, setExamination] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [notes, setNotes] = useState("");

  const filteredPatients = mockPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.cpf.includes(searchTerm)
  );

  const patient = mockPatients.find((p) => p.id === selectedPatient);

  const handleSave = () => {
    alert("Prontuário salvo com sucesso!");
    setComplaint("");
    setExamination("");
    setDiagnosis("");
    setPrescription("");
    setNotes("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-granite-900">Prontuários</h1>
        <p className="text-granite-600 mt-1">
          Gerencie os prontuários dos pacientes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Buscar Paciente</CardTitle>
            <CardDescription>Pesquise por nome ou CPF</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-granite-400" />
              <Input
                placeholder="Nome ou CPF"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition ${
                    selectedPatient === patient.id
                      ? "border-jungle-teal-500 bg-jungle-teal-50"
                      : "border-granite-200 hover:border-jungle-teal-300"
                  }`}
                >
                  <p className="font-medium text-granite-900">{patient.name}</p>
                  <p className="text-sm text-granite-600">{patient.cpf}</p>
                  {patient.medicalHistory &&
                    patient.medicalHistory.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {patient.medicalHistory.map((condition, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {!selectedPatient ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-granite-400 mx-auto mb-4" />
                <p className="text-granite-600">
                  Selecione um paciente para visualizar ou criar prontuário
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Prontuário - {patient?.name}</CardTitle>
                    <CardDescription>CPF: {patient?.cpf}</CardDescription>
                  </div>
                  <Badge variant="default">Ativo</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="novo">
                  <TabsList>
                    <TabsTrigger value="novo">Nova Consulta</TabsTrigger>
                    <TabsTrigger value="historico">Histórico</TabsTrigger>
                  </TabsList>

                  <TabsContent value="novo" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Queixa Principal</Label>
                      <textarea
                        value={complaint}
                        onChange={(e) => setComplaint(e.target.value)}
                        className="w-full min-h-[80px] px-3 py-2 border border-granite-300 rounded-md focus:outline-none focus:ring-2 focus:ring-jungle-teal-500"
                        placeholder="Descreva a queixa do paciente..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Exame Físico</Label>
                      <textarea
                        value={examination}
                        onChange={(e) => setExamination(e.target.value)}
                        className="w-full min-h-[80px] px-3 py-2 border border-granite-300 rounded-md focus:outline-none focus:ring-2 focus:ring-jungle-teal-500"
                        placeholder="Resultados do exame físico..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Diagnóstico</Label>
                      <textarea
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        className="w-full min-h-[80px] px-3 py-2 border border-granite-300 rounded-md focus:outline-none focus:ring-2 focus:ring-jungle-teal-500"
                        placeholder="Diagnóstico médico..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Prescrição</Label>
                      <textarea
                        value={prescription}
                        onChange={(e) => setPrescription(e.target.value)}
                        className="w-full min-h-[80px] px-3 py-2 border border-granite-300 rounded-md focus:outline-none focus:ring-2 focus:ring-jungle-teal-500"
                        placeholder="Medicamentos prescritos..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Observações</Label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full min-h-[60px] px-3 py-2 border border-granite-300 rounded-md focus:outline-none focus:ring-2 focus:ring-jungle-teal-500"
                        placeholder="Observações adicionais..."
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleSave} className="flex-1">
                        Salvar Prontuário
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedPatient(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="historico" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      {patient?.medicalHistory &&
                      patient.medicalHistory.length > 0 ? (
                        patient.medicalHistory.map((condition, idx) => (
                          <div
                            key={idx}
                            className="p-4 border border-granite-200 rounded-lg"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-granite-600" />
                              <span className="text-sm text-granite-600">
                                Histórico Médico
                              </span>
                            </div>
                            <p className="font-medium">{condition}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-granite-600">
                          Sem histórico médico registrado
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
