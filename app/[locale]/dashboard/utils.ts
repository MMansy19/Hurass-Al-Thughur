import { supabase } from '@/supabase/initializing';

export async function loadMessages(locale: string, setMessages: (messages: any) => void) {
  const messagesModule = await import(`@/locales/${locale}.json`);
  setMessages(messagesModule.default);
}

export async function loadSignedInUser(setUser: (user: any) => void) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  setUser(user);
}
