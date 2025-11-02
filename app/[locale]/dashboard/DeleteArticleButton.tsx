import { supabase } from "@/supabase/initializing";
import { Messages } from "@/types/messages";
import toast from "react-hot-toast";
import { useState } from "react";

function DeleteArticleButton({
  articleId,
  messages,
}: {
  articleId: number;
  messages?: Messages;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleClick() {
    const confirmMessage = messages?.confirm?.deleteArticle || 
      "هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.";
    
    if (!confirm(confirmMessage)) {
      return;
    }

    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", articleId);

      if (error) {
        toast.error(messages?.errors?.deleteArticle || "فشل في حذف المقال. يرجى المحاولة مرة أخرى.");
      } else {
        toast.success(messages?.success?.deleteArticle || "تم حذف المقال بنجاح!");
        window.location.reload();
      }
    } catch (error) {
      toast.error(messages?.errors?.deleteArticle || "فشل في حذف المقال. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isDeleting}
      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[40px]"
    >
      {isDeleting ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700"></div>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}
export default DeleteArticleButton;
