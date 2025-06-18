import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/initializing';

export function useCanEditArticle(articleId: string) {
  const [canEdit, setCanEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkEditPermission();
  }, [articleId]);

  async function checkEditPermission() {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      
      if (!currentUser) {
        setCanEdit(false);
        setLoading(false);
        return;
      }

      const { data: article, error } = await supabase
        .from('articles')
        .select('user_id')
        .eq('id', articleId)
        .single();

      if (error) {
        console.error('Error checking article ownership:', error);
        setCanEdit(false);
      } else {
        setCanEdit(article?.user_id === currentUser.id);
      }
    } catch (error) {
      console.error('Error in checkEditPermission:', error);
      setCanEdit(false);
    } finally {
      setLoading(false);
    }
  }

  return { canEdit, loading, user, refetch: checkEditPermission };
}
