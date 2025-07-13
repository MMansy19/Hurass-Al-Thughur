import { supabase } from "@/supabase/initializing";

export async function loadMessages(
  locale: string,
  setMessages: (messages: any) => void,
) {
  const messagesModule = await import(`@/locales/${locale}.json`);
  setMessages(messagesModule.default);
}

export async function loadSignedInUser(setUser: (user: any) => void) {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      if (
        error.message.includes("refresh") ||
        error.message.includes("token")
      ) {
        await supabase.auth.signOut({ scope: "local" });
      }
      setUser(null);
      return;
    }

    setUser(user);
  } catch (error) {
    setUser(null);
  }
}

export async function loadArticles(
  user_id: string,
  setArticles: (articles: any[]) => void,
  setLoading: (loading: boolean) => void,
) {
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
  if (error) {
    setArticles([]);
  } else {
    setArticles(articles || []);
  }

  setLoading(false);
}
