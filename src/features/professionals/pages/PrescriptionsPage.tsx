import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, Plus, Trash2, FileText, Printer } from "lucide-react";
import { mockPatients } from "@/mocks/patients";
import type { Medication } from "@/types";

export function PrescriptionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [notes, setNotes] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const filteredPatients = mockPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.cpf.includes(searchTerm)
  );

  const patient = mockPatients.find((p) => p.id === selectedPatient);

  const addMedication = () => {
    setMedications([
      ...medications,
      { name: "", dosage: "", frequency: "", duration: "" },
    ]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (
    index: number,
    field: keyof Medication,
    value: string
  ) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const handlePreview = () => {
    if (!patient || medications.length === 0) {
      alert("Selecione um paciente e adicione medicamentos");
      return;
    }
    setShowPreview(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const clearForm = () => {
    setSelectedPatient(null);
    setMedications([]);
    setNotes("");
    setShowPreview(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-granite-900">Emitir Receita</h1>
        <p className="text-granite-600 mt-1">
          Prescreva medicamentos para seus pacientes
        </p>
      </div>

      {!showPreview ? (
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
                    <p className="font-medium text-granite-900">
                      {patient.name}
                    </p>
                    <p className="text-sm text-granite-600">{patient.cpf}</p>
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
                    Selecione um paciente para prescrever medicamentos
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Receita - {patient?.name}</CardTitle>
                  <CardDescription>CPF: {patient?.cpf}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-base">Medicamentos</Label>
                      <Button size="sm" onClick={addMedication}>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {medications.map((med, index) => (
                        <div
                          key={index}
                          className="p-4 border border-granite-200 rounded-lg space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-granite-700">
                              Medicamento {index + 1}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeMedication(index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-sm">
                                Nome do Medicamento
                              </Label>
                              <Input
                                placeholder="Ex: Dipirona"
                                value={med.name}
                                onChange={(e) =>
                                  updateMedication(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-sm">Dosagem</Label>
                              <Input
                                placeholder="Ex: 500mg"
                                value={med.dosage}
                                onChange={(e) =>
                                  updateMedication(
                                    index,
                                    "dosage",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-sm">Frequência</Label>
                              <Input
                                placeholder="Ex: 8 em 8 horas"
                                value={med.frequency}
                                onChange={(e) =>
                                  updateMedication(
                                    index,
                                    "frequency",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-sm">Duração</Label>
                              <Input
                                placeholder="Ex: 7 dias"
                                value={med.duration}
                                onChange={(e) =>
                                  updateMedication(
                                    index,
                                    "duration",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {medications.length === 0 && (
                        <div className="text-center py-8 text-granite-600">
                          Clique em "Adicionar" para incluir medicamentos
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Observações</Label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full min-h-[80px] px-3 py-2 border border-granite-300 rounded-md focus:outline-none focus:ring-2 focus:ring-jungle-teal-500"
                      placeholder="Orientações adicionais para o paciente..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handlePreview} className="flex-1">
                      Visualizar Receita
                    </Button>
                    <Button variant="outline" onClick={clearForm}>
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Preview da Receita</CardTitle>
                <CardDescription>Revise antes de imprimir</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Editar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-8 border border-granite-200 rounded-lg">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-jungle-teal-700">
                  RECEITA MÉDICA
                </h2>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <span className="text-sm font-semibold text-jungle-teal-700">Vida</span>
                  <span className="text-sm font-semibold text-muted-teal-600">Plus</span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-granite-600">Paciente</p>
                <p className="font-medium text-lg">{patient?.name}</p>
                <p className="text-sm text-granite-600">CPF: {patient?.cpf}</p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-granite-600 mb-3">
                  Data: {new Date().toLocaleDateString("pt-BR")}
                </p>
                <div className="space-y-4">
                  {medications.map((med, index) => (
                    <div
                      key={index}
                      className="border-b border-granite-200 pb-3"
                    >
                      <p className="font-medium">
                        {index + 1}. {med.name} - {med.dosage}
                      </p>
                      <p className="text-sm text-granite-600 mt-1">
                        Tomar {med.frequency} por {med.duration}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {notes && (
                <div className="mb-6">
                  <p className="text-sm text-granite-600">Observações</p>
                  <p className="text-sm mt-1">{notes}</p>
                </div>
              )}

              <div className="mt-12 pt-6 border-t border-granite-300">
                <p className="text-center text-sm text-granite-600">
                  Assinatura Digital - Dr. Carlos Mendes - CRM 12345-SP
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
