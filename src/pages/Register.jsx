
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  auth,
  db
} from "../Firebase/config";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  reload
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  UserPlus,
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
  RefreshCw
} from "lucide-react";

import AuthLayout from "../components/Studio/AuthLayout";
import GoogleIcon from "../components/Studio/Googleicon";
import { toast } from "@/components/ui/use-toast";

export default function Register() {
  const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState(
    location.state?.email || ""
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);

  const [pendingVerification, setPendingVerification] =
    useState(false);

  // CREATE ACCOUNT
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      // Save user profile in Firestore
      await setDoc(doc(db, "users", result.user.uid), {
        name: name.trim(),
        email: cleanEmail,
        createdAt: Date.now(),
        emailVerified: false
      });

      // Show verification screen
      setPendingVerification(true);

      // Send Firebase verification email
      await sendEmailVerification(result.user);

      setMessage(
        "Your account has been created. Check your inbox for the verification link."
      );

    } catch (err) {
      console.error("Registration error:", err);

      // Account may already have been created if a later
      // operation, such as sending the email, failed.
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        setPendingVerification(true);
        setError(
          "Your account was created, but the verification email could not be sent. Try resending it."
        );
      } else {
        const errors = {
          "auth/email-already-in-use":
            "This email is already registered. Please log in instead.",

          "auth/invalid-email":
            "Please enter a valid email address.",

          "auth/weak-password":
            "Your password is too weak. Use at least 6 characters.",

          "auth/network-request-failed":
            "Network error. Please check your internet connection."
        };

        setError(
          errors[err.code] ||
          err.message ||
          "Failed to create account."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // RESEND VERIFICATION EMAIL
  const handleResendVerification = async () => {
    const user = auth.currentUser;

    if (!user) {
      setError("Please register again or log in to continue.");
      return;
    }

    setResending(true);
    setError("");
    setMessage("");

    try {
      await sendEmailVerification(user);

      setMessage(
        "A new verification link has been sent to your email."
      );
    } catch (err) {
      console.error(err);

      setError(
        err.code === "auth/too-many-requests"
          ? "Too many requests. Please wait before trying again."
          : "Unable to send verification email. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  // CHECK IF EMAIL HAS BEEN VERIFIED
  const handleCheckVerification = async () => {
    const user = auth.currentUser;

    if (!user) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    setChecking(true);
    setError("");

    try {
      await reload(user);

      if (auth.currentUser.emailVerified) {
        await setDoc(
          doc(db, "users", user.uid),
          {
            emailVerified: true
          },
          { merge: true }
        );

        setMessage("Email verified successfully!");

        navigate("/studio", { replace: true });
      } else {
        setError(
          "Your email has not been verified yet. Open the link in your inbox first."
        );
      }
    } catch (err) {
      console.error(err);
      setError("Could not check verification status. Try again.");
    } finally {
      setChecking(false);
    }
  };

  // GOOGLE SIGN-IN
  const handleGoogle = async () => {
    setLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          name: user.displayName || "",
          email: user.email || "",
          createdAt: Date.now(),
          emailVerified: user.emailVerified
        },
        { merge: true }
      );

      if (user.emailVerified) {
        navigate("/studio", { replace: true });
      } else {
        setPendingVerification(true);
      }
    } catch (err) {
      console.error(err);

      toast({
        title: "Google sign-in failed",
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  // EMAIL VERIFICATION SCREEN
  if (pendingVerification) {
    return (
      <AuthLayout
        icon={Mail}
        title="Verify your email"
        subtitle="One more step before entering Illia Studio"
        footer={
          <>
            Already verified?{" "}
            <button
              type="button"
              onClick={handleCheckVerification}
              className="text-primary font-medium hover:underline"
            >
              Check again
            </button>
          </>
        }
      >
        <div className="text-center space-y-5">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              We've sent a verification link to:
            </p>

            <p className="mt-2 font-semibold break-all">
              {email}
            </p>
          </div>

          {message && (
            <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-600">
              {message}
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            Open the email from Firebase and click the verification
            link. Check your spam folder if you cannot find it.
          </p>

          <Button
            type="button"
            className="w-full h-12"
            onClick={handleCheckVerification}
            disabled={checking}
          >
            {checking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              "I've verified my email"
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12"
            onClick={handleResendVerification}
            disabled={resending}
          >
            {resending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend verification email
              </>
            )}
          </Button>

        </div>
      </AuthLayout>
    );
  }

  // REGISTRATION SCREEN
  return (
    <AuthLayout
      icon={UserPlus}
      title="Create your account"
      subtitle="Sign up to get started"
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <Button
        variant="outline"
        className="w-full h-12 text-sm font-medium mb-6"
        onClick={handleGoogle}
        disabled={loading}
      >
        <GoogleIcon className="w-5 h-5 mr-2" />
        Continue with Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>

        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">
            or
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>

          <div className="relative">
            <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm Password</Label>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 font-medium"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>

      </form>
    </AuthLayout>
  );
}
