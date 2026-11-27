
import React, { useState } from "react";

import { Toaster, toast } from "sonner";

import {
  QueryClientProvider
} from "@tanstack/react-query";

import {
  queryClientInstance
} from "@/lib/query-client";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
  useNavigate
} from "react-router-dom";

import {
  sendEmailVerification
} from "firebase/auth";

// Authentication
import {
  AuthProvider,
  useAuth
} from "./lib/AuthContext";

// Layout and components
import PageNotFound from "./lib/PageNotFound";
import ScrollToTop from "./components/Studio/ScrollToTop";
import LayOut from "./components/Studio/LayOut";

// Icons
import {
  Mail,
  RefreshCw,
  Loader2,
  CheckCircle2,
  LogOut
} from "lucide-react";

// Pages
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import TrendsDashboard from "./pages/TrendsDashboard";
import ContentCalendar from "./pages/ContentCalendar";
import Profile from "./pages/Profile";
import Templates from "./pages/Templates";
import MediaLibrary from "./pages/MediaLibrary";
import Analytics from "./pages/Analytics";
import Create from "./pages/Create";
import Settings from "./pages/Settings";

// Authentication pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";


/*
|--------------------------------------------------------------------------
| VERIFIED ROUTE PROTECTION
|--------------------------------------------------------------------------
*/

const ProtectedRoute = () => {
  const {
    isSignedIn,
    isAuthenticated,
    isLoadingAuth
  } = useAuth();

  if (isLoadingAuth) {
    return <LoadingScreen />;
  }

  // User is not signed in
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // User is signed in but email is not verified
  if (!isAuthenticated) {
    return <Navigate to="/verify-email" replace />;
  }

  // Verified user
  return <Outlet />;
};


/*
|--------------------------------------------------------------------------
| LOADING SCREEN
|--------------------------------------------------------------------------
*/

function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
    </div>
  );
}


/*
|--------------------------------------------------------------------------
| EMAIL VERIFICATION PAGE
|--------------------------------------------------------------------------
*/

function VerifyEmail() {
  const navigate = useNavigate();

  const {
    user,
    isSignedIn,
    isEmailVerified,
    isLoadingAuth,
    refreshUser,
    logout
  } = useAuth();

  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);

  // Check authentication
  if (isLoadingAuth) {
    return <LoadingScreen />;
  }

  // Must be signed in to verify
  if (!isSignedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  // Already verified
  if (isEmailVerified) {
    return <Navigate to="/studio" replace />;
  }

  // Resend Firebase verification email
  const handleResend = async () => {
    if (!user) return;

    setResending(true);

    try {
      await sendEmailVerification(user);

      toast.success("Verification email sent!", {
        description: "Check your inbox for the verification link."
      });

    } catch (error) {
      console.error("Resend verification error:", error);

      if (error.code === "auth/too-many-requests") {
        toast.error("Too many requests. Please wait before trying again.");
      } else {
        toast.error("Unable to send verification email.");
      }

    } finally {
      setResending(false);
    }
  };

  // Check verification status
  const handleCheckVerification = async () => {
    setChecking(true);

    try {
      const verified = await refreshUser();

      if (verified) {
        toast.success("Email verified successfully!");

        navigate("/studio", { replace: true });
      } else {
        toast.error("Email not verified yet.", {
          description: "Please open the verification link sent to your email."
        });
      }

    } catch (error) {
      console.error(error);
      toast.error("Unable to check verification status.");

    } finally {
      setChecking(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error("Unable to log out.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">

      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-xl">

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>

        {/* Heading */}
        <div className="text-center">

          <h1 className="text-2xl font-bold tracking-tight">
            Verify your email
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            We've sent a verification link to your email address.
            Verify your email to access Illia Studio.
          </p>

        </div>

        {/* Email */}
        <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4 text-center">

          <p className="text-xs text-muted-foreground">
            Verification email sent to
          </p>

          <p className="mt-1 break-all text-sm font-semibold">
            {user.email}
          </p>

        </div>

        {/* Instructions */}
        <div className="mt-6 space-y-3 text-sm text-muted-foreground">

          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

            <p>Open your email inbox.</p>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

            <p>Find the verification email from Firebase.</p>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

            <p>Click the verification link.</p>
          </div>

        </div>

        {/* Check button */}
        <button
          type="button"
          onClick={handleCheckVerification}
          disabled={checking}
          className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >

          {checking ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking verification...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              I've verified my email
            </>
          )}

        </button>

        {/* Resend button */}
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-medium transition hover:bg-muted disabled:opacity-60"
        >

          {resending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Resend verification email
            </>
          )}

        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 flex w-full items-center justify-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Can't find the email? Check your spam or junk folder.
        </p>

      </div>

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| APPLICATION ROUTES
|--------------------------------------------------------------------------
*/

const AuthenticatedApp = () => {

  const {
    isLoadingAuth,
    isLoadingPublicSettings
  } = useAuth();

  if (isLoadingAuth || isLoadingPublicSettings) {
    return <LoadingScreen />;
  }

  return (
    <Routes>

      {/* PUBLIC PAGES */}

      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />


      {/* EMAIL VERIFICATION */}

      <Route
        path="/verify-email"
        element={<VerifyEmail />}
      />


      {/* PROTECTED STUDIO ROUTES */}

      <Route element={<ProtectedRoute />}>

        {/* STUDIO HOME */}

        <Route
          path="/studio"
          element={
            <LayOut>
              <Home />
            </LayOut>
          }
        />


        {/* CREATE */}

        <Route
          path="/studio/create"
          element={
            <LayOut>
              <Create />
            </LayOut>
          }
        />


        {/* TRENDS */}

        <Route
          path="/studio/trends"
          element={
            <LayOut>
              <TrendsDashboard />
            </LayOut>
          }
        />


        {/* CALENDAR */}

        <Route
          path="/studio/calendar"
          element={
            <LayOut>
              <ContentCalendar />
            </LayOut>
          }
        />


        {/* ANALYTICS */}

        <Route
          path="/studio/analytics"
          element={
            <LayOut>
              <Analytics />
            </LayOut>
          }
        />


        {/* PROFILE */}

        <Route
          path="/studio/profile"
          element={
            <LayOut>
              <Profile />
            </LayOut>
          }
        />


        {/* SETTINGS */}

        <Route
          path="/studio/settings"
          element={
            <LayOut>
              <Settings />
            </LayOut>
          }
        />


        {/* TEMPLATES */}

        <Route
          path="/studio/templates"
          element={
            <LayOut>
              <Templates />
            </LayOut>
          }
        />


        {/* MEDIA LIBRARY */}

        <Route
          path="/studio/media"
          element={
            <LayOut>
              <MediaLibrary />
            </LayOut>
          }
        />


        {/* OLD URL REDIRECTS */}

        <Route
          path="/create"
          element={<Navigate to="/studio/create" replace />}
        />

        <Route
          path="/trends"
          element={<Navigate to="/studio/trends" replace />}
        />

        <Route
          path="/calendar"
          element={<Navigate to="/studio/calendar" replace />}
        />

        <Route
          path="/profile"
          element={<Navigate to="/studio/profile" replace />}
        />

        <Route
          path="/templates"
          element={<Navigate to="/studio/templates" replace />}
        />

        <Route
          path="/media"
          element={<Navigate to="/studio/media" replace />}
        />

      </Route>


      {/* 404 */}

      <Route
        path="*"
        element={<PageNotFound />}
      />

    </Routes>
  );
};


/*
|--------------------------------------------------------------------------
| MAIN APP
|--------------------------------------------------------------------------
*/

function App() {
  return (
    <AuthProvider>

      <QueryClientProvider client={queryClientInstance}>

        <Router>

          <ScrollToTop />

          <AuthenticatedApp />

        </Router>

        <Toaster
          richColors
          position="top-right"
          closeButton
          expand
          duration={3000}
        />

      </QueryClientProvider>

    </AuthProvider>
  );
}

export default App;
  