import { useMemo, useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockTransactions } from "@/mocks/transactions";
import type { Transaction, TransactionType } from "@/types";
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
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";

export function FinancialReportsPage() {
  const [period, setPeriod] = useState<string>("month");
  const [transactions] = useState<Transaction[]>(mockTransactions);

  const stats = useMemo(() => {
    const revenue = transactions
      .filter((t) => t.type === "revenue")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const profit = revenue - expenses;
    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

    return { revenue, expenses, profit, profitMargin };
  }, [transactions]);

  const revenueByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>();
    transactions
      .filter((t) => t.type === "revenue")
      .forEach((t) => {
        const current = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, current + t.amount);
      });

    return Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category: getCategoryLabel(category),
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const expensesByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>();
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const current = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, current + t.amount);
      });

    return Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category: getCategoryLabel(category),
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(2025, i, 1);
      return date.toLocaleDateString("pt-BR", { month: "short" });
    });

    return months.map((month, index) => {
      const monthTransactions = transactions.filter((t) => {
        const date = new Date(t.date);
        return date.getMonth() === index;
      });

      const revenue = monthTransactions
        .filter((t) => t.type === "revenue")
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        month,
        receitas: revenue,
        despesas: expenses,
        lucro: revenue - expenses,
      };
    });
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [transactions]);

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      consultation: "Consultas",
      exam: "Exames",
      procedure: "Procedimentos",
      medication: "Medicamentos",
      salary: "Salários",
      supplies: "Suprimentos",
      maintenance: "Manutenção",
      utilities: "Utilidades",
      other: "Outros",
    };
    return labels[category] || category;
  };

  const getTypeBadgeVariant = (type: TransactionType) => {
    return type === "revenue" ? "success" : "danger";
  };

  const getTypeLabel = (type: TransactionType) => {
    return type === "revenue" ? "Receita" : "Despesa";
  };

  const COLORS = ["#6a956d", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-granite-900">
            Relatórios Financeiros
          </h1>
          <p className="text-granite-600 mt-1">
            Análise financeira e desempenho
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
              <CardDescription>Receitas</CardDescription>
              <ArrowUpCircle className="h-4 w-4 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-green-600">
              R$ {stats.revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Despesas</CardDescription>
              <ArrowDownCircle className="h-4 w-4 text-red-600" />
            </div>
            <CardTitle className="text-3xl text-red-600">
              R$ {stats.expenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Lucro</CardDescription>
              <DollarSign className="h-4 w-4 text-jungle-teal-600" />
            </div>
            <CardTitle
              className={`text-3xl ${
                stats.profit >= 0 ? "text-jungle-teal-600" : "text-red-600"
              }`}
            >
              R$ {stats.profit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Margem de Lucro</CardDescription>
              <TrendingUp className="h-4 w-4 text-jungle-teal-600" />
            </div>
            <CardTitle className="text-3xl text-jungle-teal-600">
              {stats.profitMargin.toFixed(1)}%
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Receitas por Categoria</CardTitle>
            <CardDescription>Distribuição das receitas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) =>
                    `${category}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {revenueByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) =>
                    `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
            <CardDescription>Distribuição das despesas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expensesByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) =>
                    `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                  }
                />
                <Bar dataKey="amount" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evolução Mensal</CardTitle>
          <CardDescription>
            Receitas, despesas e lucro ao longo do ano
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number) =>
                  `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="receitas"
                stroke="#22c55e"
                name="Receitas"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="despesas"
                stroke="#ef4444"
                name="Despesas"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="lucro"
                stroke="#6a956d"
                name="Lucro"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
          <CardDescription>
            Últimas 10 transações registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-granite-600" />
                      {new Date(transaction.date).toLocaleDateString("pt-BR")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      {transaction.patientName && (
                        <p className="text-sm text-granite-600">
                          {transaction.patientName}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryLabel(transaction.category)}</TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(transaction.type)}>
                      {getTypeLabel(transaction.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`font-semibold ${
                        transaction.type === "revenue"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "revenue" ? "+" : "-"} R${" "}
                      {transaction.amount.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
