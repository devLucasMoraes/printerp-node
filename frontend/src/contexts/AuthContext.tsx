import axios from "axios";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router";
import LoadingScreen from "../components/shared/LoadingScreen";
import { LoginFormData, SignUpFormData } from "../schemas/auth";
import { UserDto } from "../schemas/user.schemas";
import { AUTH_ERROR_EVENT, api, authErrorEvent } from "../services/api/axios";
import { useAlertStore } from "../stores/useAlertStore";

interface AuthContextData {
  user: Omit<UserDto, "password"> | null;
  signIn: (data: LoginFormData) => Promise<void>;
  signUp: (data: SignUpFormData) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<Omit<UserDto, "password"> | null>(null);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlertStore((state) => state);

  const isAuthenticated = !!user;

  useEffect(() => {
    const handleAuthError = (event: Event) => {
      const customEvent = event as CustomEvent;
      showAlert(customEvent.detail, "error");
      setUser(null);
      navigate("/auth/login");
    };

    authErrorEvent.addEventListener(AUTH_ERROR_EVENT, handleAuthError);

    return () => {
      authErrorEvent.removeEventListener(AUTH_ERROR_EVENT, handleAuthError);
    };
  }, [navigate]);

  const signIn = useCallback(
    async (data: LoginFormData) => {
      try {
        const response = await api.post("/auth/login", data);
        const { user } = response.data;

        setUser(user);
        navigate("/dashboard");
        showAlert("Login realizado com sucesso!", "success");
      } catch (error) {
        showAlert("Erro ao fazer login. Verifique suas credenciais.", "error");
      }
    },
    [navigate]
  );

  const signUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        await api.post("/auth/signup", data);
        navigate("/auth/login");
        showAlert("Conta criada com sucesso!", "success");
      } catch (error) {
        showAlert("Erro ao criar conta. Tente novamente.", "error");
      }
    },
    [navigate]
  );

  const signOut = useCallback(async () => {
    try {
      await api.post("/auth/logout");
      showAlert("Logout realizado com sucesso!", "success");
    } finally {
      setUser(null);
      navigate("/auth/login");
    }
  }, [navigate]);

  const loadUserData = useCallback(async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setUser(null);
        navigate("/auth/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadUserData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider
      value={{ user, signIn, signUp, signOut, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}
