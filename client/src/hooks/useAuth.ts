import { useQuery } from "@tanstack/react-query";

// Mock user data for development
const mockUser = {
  id: 'dev-user-123',
  name: 'Dev User',
  email: 'dev@example.com',
  userType: 'patient',
  // Add any other required user properties here
};

export function useAuth() {
  // For development, return the mock user directly
  if (import.meta.env.DEV) {
    return {
      user: mockUser,
      isLoading: false,
      isAuthenticated: true,
    };
  }

  // Original implementation for production
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}