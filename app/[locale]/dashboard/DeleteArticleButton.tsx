import { supabase } from '@/supabase/initializing';

function DeleteArticleButton({ articleId }: { articleId: number }) {
  async function handleClick() {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }
    const { error } = await supabase.from('articles').delete().eq('id', articleId);

    if (error) {
      alert('Failed to delete the article. Please try again.');
    } else {
      alert('Article deleted successfully!');
      // Optionally, you can redirect or refresh the page here
      window.location.reload();
    }
  }

  return (
    <button onClick={handleClick} className="block w-full sm:px-4 px-2 py-2 text-center bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
      Delete Article
    </button>
  );
}
export default DeleteArticleButton;
