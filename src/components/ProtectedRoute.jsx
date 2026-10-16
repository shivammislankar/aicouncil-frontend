import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth } from "../services/firebase";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait for Firebase to restore the session before deciding, otherwise a
  // signed-in user is briefly bounced to /login on every page load.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }
  // auth.currentUser covers the instant right after sign-in, before the
  // onAuthStateChanged listener has updated context state.
  return user || auth.currentUser ? children : <Navigate to="/login" replace />;
}
