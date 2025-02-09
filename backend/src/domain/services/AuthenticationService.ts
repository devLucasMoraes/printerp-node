export interface AuthenticationResult {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}
export interface AuthenticationService {
  authenticate(email: string, password: string): Promise<AuthenticationResult>;
  refreshAuthentication(refreshToken: string): Promise<AuthenticationResult>;
  revokeAuthentication(userId: string): Promise<void>;
}
