import { supabase } from '@/supabase/initializing';

/**
 * Utility to handle token refresh and session management
 */
export class TokenManager {
  private static refreshTimeout: NodeJS.Timeout | null = null;
  private static isRefreshing = false;

  /**
   * Set up automatic token refresh
   */
  static setupAutoRefresh() {
    if (typeof window === 'undefined') return;

    // Clear any existing timeout
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }

    // Listen for auth state changes to set up refresh timer
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        this.scheduleTokenRefresh(session);
      } else if (event === 'SIGNED_OUT') {
        this.clearRefreshTimer();
      }
    });
  }

  /**
   * Schedule token refresh before expiry
   */
  private static scheduleTokenRefresh(session: any) {
    if (!session?.expires_at) return;

    // Clear existing timer
    this.clearRefreshTimer();

    // Calculate time until refresh (refresh 5 minutes before expiry)
    const expiresAt = new Date(session.expires_at * 1000);
    const now = new Date();
    const timeUntilRefresh = Math.max(0, expiresAt.getTime() - now.getTime() - 5 * 60 * 1000);

    console.log(`Token refresh scheduled in ${Math.round(timeUntilRefresh / 1000)} seconds`);

    this.refreshTimeout = setTimeout(() => {
      this.refreshToken();
    }, timeUntilRefresh);
  }

  /**
   * Manually refresh the token
   */
  static async refreshToken() {
    if (this.isRefreshing) {
      console.log('Token refresh already in progress');
      return;
    }

    this.isRefreshing = true;

    try {
      console.log('Refreshing auth token...');
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        console.error('Token refresh failed:', error);
        
        // If refresh fails, sign out the user
        if (error.message.includes('refresh') || error.message.includes('token')) {
          console.log('Invalid refresh token, signing out...');
          await supabase.auth.signOut({ scope: 'local' });
          
          // Clear storage
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem('user');
          }
          
          // Redirect to sign in
          const currentPath = window.location.pathname;
          const locale = currentPath.split('/')[1] || 'ar';
          window.location.href = `/${locale}/signin`;
        }
      } else if (data.session) {
        console.log('Token refreshed successfully');
        this.scheduleTokenRefresh(data.session);
      }
    } catch (error) {
      console.error('Unexpected error during token refresh:', error);
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Clear the refresh timer
   */
  private static clearRefreshTimer() {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }

  /**
   * Check if the current session is valid
   */
  static async validateSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session validation error:', error);
        return false;
      }

      if (!session) {
        console.log('No active session');
        return false;
      }

      // Check if token is expired
      const expiresAt = new Date(session.expires_at! * 1000);
      const now = new Date();
      
      if (expiresAt <= now) {
        console.log('Session expired, attempting refresh...');
        await this.refreshToken();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error validating session:', error);
      return false;
    }
  }

  /**
   * Initialize token management
   */
  static init() {
    if (typeof window === 'undefined') return;

    // Set up auto refresh
    this.setupAutoRefresh();

    // Validate session on page load
    this.validateSession();

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        // Page became visible, validate session
        this.validateSession();
      }
    });

    // Handle focus events
    window.addEventListener('focus', () => {
      this.validateSession();
    });
  }
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  TokenManager.init();
}
