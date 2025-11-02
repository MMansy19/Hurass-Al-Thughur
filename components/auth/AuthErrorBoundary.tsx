"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { isAuthError, handleAuthError } from "@/utils/auth-helpers";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  messages?: any;
  locale?: string;
}

export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Auth Error Boundary caught an error:", error, errorInfo);

    // Load locale and messages
    await this.loadLocaleMessages();

    if (isAuthError(error)) {
      await handleAuthError(error, {
        redirectOnError: true,
        clearSession: true,
        showAlert: true,
        customMessage: "A session error occurred. Redirecting to sign in...",
      });
    }
  }

  async loadLocaleMessages() {
    try {
      // Try to get locale from URL or localStorage
      const pathname = window.location.pathname;
      const localeFromUrl = pathname.startsWith('/ar') ? 'ar' : 'en';
      const storedLocale = localStorage.getItem('locale');
      const locale = localeFromUrl || storedLocale || 'en';

      const messages = await import(`@/locales/${locale}.json`);
      this.setState({ messages: messages.default, locale });
    } catch (error) {
      console.error('Failed to load locale messages:', error);
      // Fallback to default English messages
      this.setState({ 
        messages: {
          errors: {
            authenticationError: "Authentication Error",
            sessionProblem: "There was a problem with your session. Please sign in again.",
            reloadPage: "Reload Page"
          }
        },
        locale: 'en'
      });
    }
  }

  render() {
    if (this.state.hasError) {
      const { messages, locale } = this.state;
      const isRTL = locale === 'ar';

      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-md w-full space-y-8">
              <div className="text-center">
                {/* Error Icon */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                  <svg
                    className="h-8 w-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>

                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  {messages?.errors?.authenticationError || "Authentication Error"}
                </h2>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {messages?.errors?.sessionProblem || "There was a problem with your session. Please sign in again."}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => window.location.href = `/${locale}/signin`}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm13.28 4.72a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 0 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h9.44l-1.72-1.72a.75.75 0 0 1 1.06-1.06l3 3Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {messages?.errors?.goToSignIn || "Go to Sign In"}
                  </button>
                  
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {messages?.errors?.reloadPage || "Reload Page"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
