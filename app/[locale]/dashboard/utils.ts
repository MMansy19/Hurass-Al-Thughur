import { supabase } from "@/supabase/initializing";
import { ArticleInterface } from "@/types/articles";
import { Messages } from "@/types/messages";

export async function loadMessages(
  locale: string,
  setMessages: (messages: Messages | null) => void,
) {
  try {
    const messagesModule = await import(`@/locales/${locale}.json`);
    setMessages(messagesModule.default);
  } catch (error) {
    console.error('Failed to load messages:', error);
    setMessages(null);
  }
}

export async function loadArticles(
  user_id: string,
  setArticles: (articles: ArticleInterface[]) => void,
  setLoading: (loading: boolean) => void,
) {
  try {
    setLoading(true);
    
    const { data: articles, error } = await supabase
      .from("articles")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error('Failed to load articles:', error);
      setArticles([]);
    } else {
      setArticles(articles || []);
    }
  } catch (error) {
    console.error('Unexpected error loading articles:', error);
    setArticles([]);
  } finally {
    setLoading(false);
  }
}
