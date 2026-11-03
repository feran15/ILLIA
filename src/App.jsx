
import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "./lib/AuthContext";

import ScrollToTop from "./components/Studio/ScrollToTop";

// Layout
import LayOut from "./components/Studio/LayOut";

// Pages
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import TrendsDashboard from "./pages/TrendsDashboard";
import ContentCalendar from "./pages/ContentCalendar";
import Profile from "./pages/Profile";
import Templates from "./pages/Templates";
import MediaLibrary from "./pages/MediaLibrary";

import Create from "./components/Studio/Create";

// Authentication Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";


const AuthenticatedApp = () => {
  const {
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    navigateToLogin,
  } = useAuth();

  // Authentication loading
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  // Authentication errors
  if (authError) {
    if (authError.type === "user_not_registered") {
      // Handle unregistered users if needed
    }

    if (authError.type === "auth_required") {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>

      {/* PUBLIC PAGES */}

      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/reset-password" element={<ResetPassword />} />


      {/* STUDIO HOME */}

      <Route
        path="/studio"
        element={
          <LayOut>
            <Home />
          </LayOut>
        }
      />


      {/* CREATE PAGE */}

      <Route
        path="/studio/create"
        element={
          <LayOut>
            <Create />
          </LayOut>
        }
      />


      {/* TRENDS PAGE */}

      <Route
        path="/studio/trends"
        element={
          <LayOut>
            <TrendsDashboard />
          </LayOut>
        }
      />


      {/* CONTENT CALENDAR */}

      <Route
        path="/studio/calendar"
        element={
          <LayOut>
            <ContentCalendar />
          </LayOut>
        }
      />


      {/* ANALYTICS PAGE */}

      {/* Add your Analytics component here when available */}


      {/* PROFILE PAGE */}

      <Route
        path="/studio/profile"
        element={
          <LayOut>
            <Profile />
          </LayOut>
        }
      />


      {/* TEMPLATES PAGE */}

      <Route
        path="/studio/templates"
        element={
          <LayOut>
            <Templates />
          </LayOut>
        }
      />


      {/* MEDIA LIBRARY PAGE */}

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


      {/* 404 PAGE */}

      <Route path="*" element={<PageNotFound />} />

    </Routes>
  );
};


function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>

        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>

        {/* Notifications */}
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
