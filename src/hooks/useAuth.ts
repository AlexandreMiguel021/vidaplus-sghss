import { useAuthStore } from '@/stores/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error, login, register, logout, clearError } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    isPatient: user?.role === 'patient',
    isProfessional: user?.role === 'professional',
    isAdmin: user?.role === 'admin',
  };
};
