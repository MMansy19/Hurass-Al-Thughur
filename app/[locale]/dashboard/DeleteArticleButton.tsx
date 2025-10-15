import { supabase } from "@/supabase/initializing";
import { Messages } from "@/types/messages";
import toast from "react-hot-toast";

function DeleteArticleButton({
  articleId,
  messages,
}: {
  articleId: number;
  messages?: Messages;
}) {
  async function handleClick() {
    if (
      !confirm(
        "Are you sure you want to delete this article? This action cannot be undone.",
      )
    ) {
      return;
    }
    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", articleId);

    if (error) {
      toast.error("Failed to delete the article. Please try again.");
    } else {
      toast.success("Article deleted successfully!");
      // Optionally, you can redirect or refresh the page here
      window.location.reload();
    }
  }

  return (
    <button
      onClick={handleClick}
      className="block w-full sm:px-4 px-2 py-2 text-center bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
    >
      {messages?.common?.delete || "Delete"}
    </button>
  );
}
export default DeleteArticleButton;
