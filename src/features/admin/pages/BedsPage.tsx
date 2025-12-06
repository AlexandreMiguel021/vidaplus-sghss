import { useState, useEffect, useMemo } from "react";
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
import { useBedStore } from "@/stores/bedStore";
import type { Bed, BedStatus } from "@/types";
import { Bed as BedIcon, Edit, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const bedUpdateSchema = z.object({
  status: z.enum(["available", "occupied", "maintenance", "reserved"]),
  patientName: z.string().optional(),
  admissionDate: z.string().optional(),
  expectedDischargeDate: z.string().optional(),
  notes: z.string().optional(),
});

type BedUpdateFormData = z.infer<typeof bedUpdateSchema>;

export function BedsPage() {
  const { beds, isLoading, loadBeds, updateBedStatus } = useBedStore();
  const [selectedWard, setSelectedWard] = useState<string>("all");
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BedUpdateFormData>({
    resolver: zodResolver(bedUpdateSchema),
  });

  const statusValue = watch("status");

  useEffect(() => {
    loadBeds();
  }, []);

  const wards = useMemo(() => {
    const uniqueWards = Array.from(new Set(beds.map((b) => b.ward)));
    return uniqueWards.sort();
  }, [beds]);

  const filteredBeds = useMemo(() => {
    if (selectedWard === "all") return beds;
    return beds.filter((b) => b.ward === selectedWard);
  }, [beds, selectedWard]);

  const stats = useMemo(() => {
    const total = filteredBeds.length;
    const available = filteredBeds.filter((b) => b.status === "available").length;
    const occupied = filteredBeds.filter((b) => b.status === "occupied").length;
    const maintenance = filteredBeds.filter((b) => b.status === "maintenance").length;
    const reserved = filteredBeds.filter((b) => b.status === "reserved").length;
    const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;

    return { total, available, occupied, maintenance, reserved, occupancyRate };
  }, [filteredBeds]);

  const handleOpenDialog = (bed: Bed) => {
    setSelectedBed(bed);
    setValue("status", bed.status);
    setValue("patientName", bed.patientName || "");
    setValue("admissionDate", bed.admissionDate || "");
    setValue("expectedDischargeDate", bed.expectedDischargeDate || "");
    setValue("notes", bed.notes || "");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedBed(null);
    reset();
  };

  const onSubmit = async (data: BedUpdateFormData) => {
    if (!selectedBed) return;

    try {
      const updateData: Partial<Bed> = {
        notes: data.notes,
      };

      if (data.status === "occupied") {
        updateData.patientName = data.patientName;
        updateData.admissionDate = data.admissionDate;
        updateData.expectedDischargeDate = data.expectedDischargeDate;
      } else {
        updateData.patientName = undefined;
        updateData.admissionDate = undefined;
        updateData.expectedDischargeDate = undefined;
      }

      await updateBedStatus(selectedBed.id, data.status, updateData);
      handleCloseDialog();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusBadgeVariant = (status: BedStatus) => {
    switch (status) {
      case "available":
        return "success";
      case "occupied":
        return "danger";
      case "maintenance":
        return "secondary";
      case "reserved":
        return "default";
    }
  };

  const getStatusLabel = (status: BedStatus) => {
    switch (status) {
      case "available":
        return "Disponível";
      case "occupied":
        return "Ocupado";
      case "maintenance":
        return "Manutenção";
      case "reserved":
        return "Reservado";
    }
  };

  const groupedByFloor = useMemo(() => {
    const grouped = new Map<number, Bed[]>();
    filteredBeds.forEach((bed) => {
      const floor = bed.floor;
      if (!grouped.has(floor)) {
        grouped.set(floor, []);
      }
      grouped.get(floor)?.push(bed);
    });
    return Array.from(grouped.entries()).sort((a, b) => a[0] - b[0]);
  }, [filteredBeds]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-granite-900">
          Controle de Leitos
        </h1>
        <p className="text-granite-600 mt-1">
          Gerencie a ocupação dos leitos hospitalares
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Leitos</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Disponíveis</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {stats.available}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Ocupados</CardDescription>
            <CardTitle className="text-3xl text-red-600">
              {stats.occupied}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Manutenção</CardDescription>
            <CardTitle className="text-3xl text-granite-600">
              {stats.maintenance}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Taxa de Ocupação</CardDescription>
            <CardTitle className="text-3xl text-jungle-teal-600">
              {stats.occupancyRate}%
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Leitos por Setor</CardTitle>
              <CardDescription>Visualize e atualize o status dos leitos</CardDescription>
            </div>
            <Select value={selectedWard} onValueChange={setSelectedWard}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Todos os setores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os setores</SelectItem>
                {wards.map((ward) => (
                  <SelectItem key={ward} value={ward}>
                    {ward}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jungle-teal-600 mx-auto"></div>
              <p className="mt-4 text-granite-600">Carregando leitos...</p>
            </div>
          ) : (
            <Tabs defaultValue="grid">
              <TabsList>
                <TabsTrigger value="grid">Visualização em Grade</TabsTrigger>
                <TabsTrigger value="floor">Por Andar</TabsTrigger>
              </TabsList>

              <TabsContent value="grid" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredBeds.map((bed) => (
                    <Card
                      key={bed.id}
                      className={`cursor-pointer transition hover:shadow-md ${
                        bed.status === "available"
                          ? "border-green-300"
                          : bed.status === "occupied"
                          ? "border-red-300"
                          : "border-granite-300"
                      }`}
                      onClick={() => handleOpenDialog(bed)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <BedIcon
                            className={`h-6 w-6 ${
                              bed.status === "available"
                                ? "text-green-600"
                                : bed.status === "occupied"
                                ? "text-red-600"
                                : "text-granite-600"
                            }`}
                          />
                          <span className="font-bold text-lg">{bed.number}</span>
                        </div>
                        <p className="text-xs text-granite-600 mb-2">
                          {bed.ward}
                        </p>
                        <Badge
                          variant={getStatusBadgeVariant(bed.status)}
                          className="w-full justify-center text-xs"
                        >
                          {getStatusLabel(bed.status)}
                        </Badge>
                        {bed.patientName && (
                          <p className="text-xs text-granite-700 mt-2 truncate">
                            {bed.patientName}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="floor" className="space-y-6 mt-4">
                {groupedByFloor.map(([floor, floorBeds]) => (
                  <div key={floor}>
                    <h3 className="text-lg font-semibold text-granite-900 mb-3">
                      {floor}º Andar
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {floorBeds.map((bed) => (
                        <Card
                          key={bed.id}
                          className={`cursor-pointer transition hover:shadow-md ${
                            bed.status === "available"
                              ? "border-green-300"
                              : bed.status === "occupied"
                              ? "border-red-300"
                              : "border-granite-300"
                          }`}
                          onClick={() => handleOpenDialog(bed)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <BedIcon
                                className={`h-6 w-6 ${
                                  bed.status === "available"
                                    ? "text-green-600"
                                    : bed.status === "occupied"
                                    ? "text-red-600"
                                    : "text-granite-600"
                                }`}
                              />
                              <span className="font-bold text-lg">
                                {bed.number}
                              </span>
                            </div>
                            <p className="text-xs text-granite-600 mb-2">
                              {bed.ward}
                            </p>
                            <Badge
                              variant={getStatusBadgeVariant(bed.status)}
                              className="w-full justify-center text-xs"
                            >
                              {getStatusLabel(bed.status)}
                            </Badge>
                            {bed.patientName && (
                              <p className="text-xs text-granite-700 mt-2 truncate">
                                {bed.patientName}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Leito {selectedBed?.number} - {selectedBed?.ward}
            </DialogTitle>
            <DialogDescription>
              Atualize o status e informações do leito
            </DialogDescription>
          </DialogHeader>
          {selectedBed && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status do Leito</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("status", value as BedStatus)
                  }
                  defaultValue={selectedBed.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponível</SelectItem>
                    <SelectItem value="occupied">Ocupado</SelectItem>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
                    <SelectItem value="reserved">Reservado</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>

              {statusValue === "occupied" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Nome do Paciente</Label>
                    <Input
                      id="patientName"
                      {...register("patientName")}
                      placeholder="Digite o nome do paciente"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="admissionDate">Data de Internação</Label>
                      <Input
                        id="admissionDate"
                        type="date"
                        {...register("admissionDate")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expectedDischargeDate">
                        Previsão de Alta
                      </Label>
                      <Input
                        id="expectedDischargeDate"
                        type="date"
                        {...register("expectedDischargeDate")}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <textarea
                  id="notes"
                  {...register("notes")}
                  className="w-full min-h-[60px] px-3 py-2 border border-granite-300 rounded-md focus:outline-none focus:ring-2 focus:ring-jungle-teal-500"
                  placeholder="Observações adicionais..."
                />
              </div>

              {statusValue === "occupied" && (
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium">Leito será marcado como ocupado</p>
                    <p className="text-blue-700">
                      Preencha os dados do paciente internado
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Atualizar Leito
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
