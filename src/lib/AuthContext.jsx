
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback
} from "react";

import { auth } from "../Firebase/auth";

import {
  onAuthStateChanged,
  signOut,
  reload
} from "firebase/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Firebase user
  const [user, setUser] = useState(null);

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Loading states
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);

  // Other application states
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | REFRESH FIREBASE USER
  |--------------------------------------------------------------------------
  */

  const refreshUser = useCallback(async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setUser(null);
      setIsSignedIn(false);
      setIsEmailVerified(false);
      setIsAuthenticated(false);

      return false;
    }

    try {
      await reload(currentUser);

      const updatedUser = auth.currentUser;

      if (!updatedUser) {
        setUser(null);
        setIsSignedIn(false);
        setIsEmailVerified(false);
        setIsAuthenticated(false);

        return false;
      }

      setUser(updatedUser);
      setIsSignedIn(true);
      setIsEmailVerified(updatedUser.emailVerified);
      setIsAuthenticated(updatedUser.emailVerified);

      return updatedUser.emailVerified;

    } catch (error) {
      console.error("Unable to refresh Firebase user:", error);

      return false;
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FIREBASE AUTH LISTENER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          if (firebaseUser) {
            // Refresh user to get the latest verification status
            await reload(firebaseUser);

            const updatedUser = auth.currentUser;

            if (updatedUser) {
              setUser(updatedUser);
              setIsSignedIn(true);
              setIsEmailVerified(updatedUser.emailVerified);
              setIsAuthenticated(updatedUser.emailVerified);
            } else {
              setUser(null);
              setIsSignedIn(false);
              setIsEmailVerified(false);
              setIsAuthenticated(false);
            }

          } else {
            setUser(null);
            setIsSignedIn(false);
            setIsEmailVerified(false);
            setIsAuthenticated(false);
          }

        } catch (error) {
          console.error("Firebase auth listener error:", error);

          setUser(firebaseUser);
          setIsSignedIn(!!firebaseUser);
          setIsEmailVerified(false);
          setIsAuthenticated(false);

        } finally {
          setIsLoadingAuth(false);
          setAuthChecked(true);
          setIsLoadingPublicSettings(false);
        }
      }
    );

    return unsubscribe;
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CHECK USER AUTHENTICATION
  |--------------------------------------------------------------------------
  */

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      setAuthError(null);

      const verified = await refreshUser();

      if (!auth.currentUser) {
        setAuthError({
          type: "auth_required",
          message: "Authentication required"
        });
      }

      return verified;

    } catch (error) {
      console.error("User auth check failed:", error);

      setAuthError({
        type: "auth_required",
        message: "Authentication required"
      });

      return false;

    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | CHECK APPLICATION PUBLIC SETTINGS
  |--------------------------------------------------------------------------
  |
  | Keep your existing app-specific integration here.
  | The original code referenced createAxiosClient and appParams,
  | which were not declared in the file you supplied.
  |
  */

  const checkAppState = async () => {
    console.warn(
      "checkAppState requires your existing createAxiosClient and appParams configuration."
    );

    setIsLoadingPublicSettings(false);
  };

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const logout = async () => {
    try {
      await signOut(auth);

      setUser(null);
      setIsSignedIn(false);
      setIsEmailVerified(false);
      setIsAuthenticated(false);

      setAuthError(null);

    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | NAVIGATE TO LOGIN
  |--------------------------------------------------------------------------
  */

  const navigateToLogin = () => {
    window.location.href = "/login";
  };

  /*
  |--------------------------------------------------------------------------
  | CONTEXT PROVIDER
  |--------------------------------------------------------------------------
  */

  return (
    <AuthContext.Provider
      value={{
        // User
        user,

        // Authentication
        isAuthenticated,
        isSignedIn,
        isEmailVerified,

        // Loading
        isLoadingAuth,
        isLoadingPublicSettings,
        authChecked,

        // Errors and settings
        authError,
        appPublicSettings,

        // Methods
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/*
|--------------------------------------------------------------------------
| CUSTOM AUTH HOOK
|--------------------------------------------------------------------------
*/

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};
