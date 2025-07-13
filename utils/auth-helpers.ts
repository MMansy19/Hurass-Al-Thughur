import { supabase } from "@/supabase/initializing";
import { AuthError } from "@supabase/supabase-js";
import toast from "react-hot-toast";

export interface AuthErrorHandlerOptions {
  redirectOnError?: boolean;
  clearSession?: boolean;
  showAlert?: boolean;
  customMessage?: string;
}

export async function handleAuthError(
  error: AuthError | Error,
  options: AuthErrorHandlerOptions = {},
) {
  const {
    redirectOnError = false,
    clearSession = true,
    showAlert = true,
    customMessage,
  } = options;

  console.error("Auth error:", error);

  // Check if it's a refresh token error
  const isRefreshTokenError =
    error.message.includes("refresh") ||
    error.message.includes("token") ||
    error.message.includes("Invalid Refresh Token") ||
    error.message.includes("Refresh Token Not Found");

  if (isRefreshTokenError && clearSession) {
    console.log("Clearing invalid session due to refresh token error...");
    try {
      // Sign out locally only (don't call server)
      await supabase.auth.signOut({ scope: "local" });

      // Clear any remaining localStorage data
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("user");
        window.localStorage.removeItem("supabase.auth.token");
      }
    } catch (signOutError) {
      console.error("Error during cleanup:", signOutError);
    }
  }

  if (showAlert) {
    const message =
      customMessage ||
      (isRefreshTokenError
        ? "Your session has expired. Please sign in again."
        : `Authentication error: ${error.message}`);

    toast.error(message);
  }

  if (redirectOnError && typeof window !== "undefined") {
    // Get current locale from URL
    const currentPath = window.location.pathname;
    const locale = currentPath.split("/")[1] || "ar";
    window.location.href = `/${locale}/signin`;
  }

  return {
    isRefreshTokenError,
    handled: true,
  };
}

export function isAuthError(error: any): error is AuthError {
  return (
    error &&
    typeof error.message === "string" &&
    (error.constructor?.name === "AuthError" ||
      error.message.includes("auth") ||
      error.message.includes("token") ||
      error.message.includes("session"))
  );
}

export async function refreshSessionSafely() {
  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      await handleAuthError(error, {
        redirectOnError: false,
        clearSession: true,
        showAlert: false,
      });
      return { session: null, error };
    }

    return { session: data.session, error: null };
  } catch (error) {
    console.error("Unexpected error during session refresh:", error);
    return { session: null, error };
  }
}

export async function getSessionSafely() {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      await handleAuthError(error, {
        redirectOnError: false,
        clearSession: true,
        showAlert: false,
      });
      return { session: null, error };
    }

    return { session: data.session, error: null };
  } catch (error) {
    console.error("Unexpected error getting session:", error);
    return { session: null, error };
  }
}
