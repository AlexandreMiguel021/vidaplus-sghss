import { createBrowserRouter, Navigate } from "react-router-dom";
import { HomePage } from "./pages/home";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { PatientDashboard } from "@/features/patients/pages/PatientDashboard";
import { AppointmentsPage } from "@/features/patients/pages/AppointmentsPage";
import { HistoryPage } from "@/features/patients/pages/HistoryPage";
import { TelemedicinePage } from "@/features/patients/pages/TelemedicinePage";
import { ExamsPage } from "@/features/patients/pages/ExamsPage";
import { ProfessionalDashboard } from "@/features/professionals/pages/ProfessionalDashboard";
import { SchedulePage } from "@/features/professionals/pages/SchedulePage";
import { RecordsPage } from "@/features/professionals/pages/RecordsPage";
import { PrescriptionsPage } from "@/features/professionals/pages/PrescriptionsPage";
import { ExamsManagementPage } from "@/features/professionals/pages/ExamsManagementPage";
import { AdminDashboard } from "@/features/admin/pages/AdminDashboard";
import { UsersPage } from "@/features/admin/pages/UsersPage";
import { BedsPage } from "@/features/admin/pages/BedsPage";
import { ReportsPage } from "@/features/admin/pages/ReportsPage";
import { FinancialReportsPage } from "@/features/admin/pages/FinancialReportsPage";
import { ROUTES } from "./routes";

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <HomePage />,
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
  },

  {
    path: ROUTES.PATIENT,
    element: <ProtectedRoute allowedRoles={["patient"]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "dashboard",
            element: <PatientDashboard />,
          },
          {
            path: "appointments",
            element: <AppointmentsPage />,
          },
          {
            path: "history",
            element: <HistoryPage />,
          },
          {
            path: "telemedicine",
            element: <TelemedicinePage />,
          },
          {
            path: "exams",
            element: <ExamsPage />,
          },
        ],
      },
    ],
  },

  {
    path: ROUTES.PROFESSIONAL,
    element: <ProtectedRoute allowedRoles={["professional"]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "dashboard",
            element: <ProfessionalDashboard />,
          },
          {
            path: "schedule",
            element: <SchedulePage />,
          },
          {
            path: "records",
            element: <RecordsPage />,
          },
          {
            path: "prescriptions",
            element: <PrescriptionsPage />,
          },
          {
            path: "exams",
            element: <ExamsManagementPage />,
          },
        ],
      },
    ],
  },

  {
    path: ROUTES.ADMIN,
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "dashboard",
            element: <AdminDashboard />,
          },
          {
            path: "users",
            element: <UsersPage />,
          },
          {
            path: "beds",
            element: <BedsPage />,
          },
          {
            path: "reports",
            element: <ReportsPage />,
          },
          {
            path: "financial",
            element: <FinancialReportsPage />,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to={ROUTES.LOGIN} replace />,
  },
]);
