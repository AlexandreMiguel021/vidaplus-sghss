import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppointmentStore } from "@/stores/appointmentStore";
import { useBedStore } from "@/stores/bedStore";
import { useUserStore } from "@/stores/userStore";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calendar, Users, Bed as BedIcon, Activity } from "lucide-react";

export function ReportsPage() {
  const { appointments, loadAppointments } = useAppointmentStore();
  const { beds, loadBeds } = useBedStore();
  const { users, loadUsers } = useUserStore();
  const [period, setPeriod] = useState<string>("month");

  useEffect(() => {
    loadAppointments();
    loadBeds();
    loadUsers();
  }, []);

  const appointmentsByStatus = useMemo(() => {
    const scheduled = appointments.filter((a) => a.status === "scheduled").length;
    const completed = appointments.filter((a) => a.status === "completed").length;
    const cancelled = appointments.filter((a) => a.status === "cancelled").length;

    return [
      { name: "Agendadas", value: scheduled, color: "#6a956d" },
      { name: "Realizadas", value: completed, color: "#22c55e" },
      { name: "Canceladas", value: cancelled, color: "#ef4444" },
    ];
  }, [appointments]);

  const appointmentsByType = useMemo(() => {
    const inPerson = appointments.filter((a) => a.type === "in-person").length;
    const telemedicine = appointments.filter((a) => a.type === "telemedicine").length;

    return [
      { name: "Presencial", value: inPerson, color: "#6a956d" },
      { name: "Telemedicina", value: telemedicine, color: "#3b82f6" },
    ];
  }, [appointments]);

  const appointmentsBySpecialty = useMemo(() => {
    const specialtyMap = new Map<string, number>();
    appointments.forEach((a) => {
      const count = specialtyMap.get(a.specialty) || 0;
      specialtyMap.set(a.specialty, count + 1);
    });

    return Array.from(specialtyMap.entries())
      .map(([specialty, total]) => ({ specialty, total }))
      .sort((a, b) => b.total - a.total);
  }, [appointments]);

  const bedStats = useMemo(() => {
    const available = beds.filter((b) => b.status === "available").length;
    const occupied = beds.filter((b) => b.status === "occupied").length;
    const maintenance = beds.filter((b) => b.status === "maintenance").length;
    const reserved = beds.filter((b) => b.status === "reserved").length;

    return [
      { status: "Disponível", total: available, color: "#22c55e" },
      { status: "Ocupado", total: occupied, color: "#ef4444" },
      { status: "Manutenção", total: maintenance, color: "#9ca3af" },
      { status: "Reservado", total: reserved, color: "#6a956d" },
    ];
  }, [beds]);

  const bedsByWard = useMemo(() => {
    const wardMap = new Map<string, { available: number; occupied: number }>();
    beds.forEach((bed) => {
      const current = wardMap.get(bed.ward) || { available: 0, occupied: 0 };
      if (bed.status === "available") {
        current.available++;
      } else if (bed.status === "occupied") {
        current.occupied++;
      }
      wardMap.set(bed.ward, current);
    });

    return Array.from(wardMap.entries()).map(([ward, data]) => ({
      ward,
      disponivel: data.available,
      ocupado: data.occupied,
    }));
  }, [beds]);

  const usersByRole = useMemo(() => {
    const patients = users.filter((u) => u.role === "patient").length;
    const professionals = users.filter((u) => u.role === "professional").length;
    const admins = users.filter((u) => u.role === "admin").length;

    return [
      { role: "Pacientes", total: patients },
      { role: "Profissionais", total: professionals },
      { role: "Administradores", total: admins },
    ];
  }, [users]);

  const monthlyAppointments = useMemo(() => {
    const months = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    const monthlyData = months.map((month, index) => {
      const monthAppointments = appointments.filter((a) => {
        const date = new Date(a.date);
        return date.getMonth() === index;
      });

      return {
        month,
        total: monthAppointments.length,
        completed: monthAppointments.filter((a) => a.status === "completed")
          .length,
      };
    });

    return monthlyData.filter((m) => m.total > 0 || m.completed > 0);
  }, [appointments]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-granite-900">Relatórios</h1>
          <p className="text-granite-600 mt-1">
            Análise de dados e métricas do sistema
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Última Semana</SelectItem>
            <SelectItem value="month">Último Mês</SelectItem>
            <SelectItem value="quarter">Último Trimestre</SelectItem>
            <SelectItem value="year">Último Ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Total de Consultas</CardDescription>
              <Calendar className="h-4 w-4 text-granite-600" />
            </div>
            <CardTitle className="text-3xl">{appointments.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Total de Usuários</CardDescription>
              <Users className="h-4 w-4 text-granite-600" />
            </div>
            <CardTitle className="text-3xl">{users.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Total de Leitos</CardDescription>
              <BedIcon className="h-4 w-4 text-granite-600" />
            </div>
            <CardTitle className="text-3xl">{beds.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Taxa de Ocupação</CardDescription>
              <Activity className="h-4 w-4 text-granite-600" />
            </div>
            <CardTitle className="text-3xl text-jungle-teal-600">
              {beds.length > 0
                ? Math.round(
                    (beds.filter((b) => b.status === "occupied").length /
                      beds.length) *
                      100
                  )
                : 0}
              %
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Consultas por Status</CardTitle>
            <CardDescription>
              Distribuição de consultas por status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appointmentsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {appointmentsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consultas por Tipo</CardTitle>
            <CardDescription>
              Presencial vs Telemedicina
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appointmentsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {appointmentsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Consultas por Especialidade</CardTitle>
            <CardDescription>
              Total de consultas por área médica
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentsBySpecialty}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="specialty" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#6a956d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status dos Leitos</CardTitle>
            <CardDescription>Ocupação atual dos leitos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bedStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#6a956d">
                  {bedStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Leitos por Setor</CardTitle>
            <CardDescription>
              Disponibilidade e ocupação por ala hospitalar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bedsByWard}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ward" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="disponivel" fill="#22c55e" />
                <Bar dataKey="ocupado" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuários por Tipo</CardTitle>
            <CardDescription>
              Distribuição de usuários no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usersByRole}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#6a956d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evolução Mensal de Consultas</CardTitle>
          <CardDescription>
            Número de consultas agendadas e realizadas por mês
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyAppointments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#6a956d"
                name="Total"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#22c55e"
                name="Realizadas"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
