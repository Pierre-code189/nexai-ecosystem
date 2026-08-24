export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  tenantId: string;
  role: 'super_admin' | 'admin' | 'agent' | 'supervisor';
  photoURL?: string;
  createdAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
