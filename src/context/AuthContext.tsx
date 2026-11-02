import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  getCurrentUser,
  signOut as requestSignOut,
  type SignedInUser,
} from "../api/client";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "error";

interface AuthContextValue {
  user: SignedInUser | null;
  status: AuthStatus;
  error: string;
  setAuthenticatedUser: (user: SignedInUser) => void;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SignedInUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [error, setError] = useState("");
  const authRevision = useRef(0);

  const refreshSession = useCallback(async () => {
    const revision = ++authRevision.current;
    setStatus("loading");
    setError("");
    try {
      const currentUser = await getCurrentUser();
      if (revision !== authRevision.current) return;
      setUser(currentUser);
      setStatus(currentUser ? "authenticated" : "unauthenticated");
    } catch (sessionError) {
      if (revision !== authRevision.current) return;
      setUser(null);
      setStatus("error");
      setError(sessionError instanceof Error
        ? sessionError.message
        : "Unable to verify your sign-in session.");
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const setAuthenticatedUser = useCallback((authenticatedUser: SignedInUser) => {
    authRevision.current += 1;
    setUser(authenticatedUser);
    setStatus("authenticated");
    setError("");
  }, []);

  const signOut = useCallback(async () => {
    await requestSignOut();
    authRevision.current += 1;
    setUser(null);
    setStatus("unauthenticated");
    setError("");
  }, []);

  const value = useMemo(
    () => ({ user, status, error, setAuthenticatedUser, signOut, refreshSession }),
    [user, status, error, setAuthenticatedUser, signOut, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
