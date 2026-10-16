import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../services/firebase";

const AuthContext = createContext({ user: null, loading: true, logout: async () => {} });

/**
 * Login state comes from Firebase itself, not from a token copied into
 * localStorage. Firebase keeps the session, refreshes ID tokens before they
 * expire, and tells us the moment the user signs out (in this tab or another).
 * Nothing that can authenticate the user is ever written to localStorage.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clean up the token copies older versions of the app left behind.
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
    } catch {
      /* storage unavailable — nothing to clean */
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
