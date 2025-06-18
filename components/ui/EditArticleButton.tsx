'use client';

import { useCanEditArticle } from '@/components/ui/hooks/useCanEditArticle';
import Link from 'next/link';

interface EditArticleButtonProps {
  articleId: string;
  locale: string;
  children?: React.ReactNode;
  className?: string;
  messages?: {
    edit?: string;
  };
}

export default function EditArticleButton({ 
  articleId, 
  locale, 
  children, 
  className = "bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition-colors",
  messages 
}: EditArticleButtonProps) {
  const { canEdit, loading } = useCanEditArticle(articleId);

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-10 w-20 rounded"></div>;
  }

  if (!canEdit) {
    return null;
  }

  return (
    <Link 
      href={`/${locale}/articles/edit/${articleId}`}
      className={className}
    >
      {children || messages?.edit || 'Edit'}
    </Link>
  );
}
