'use client';

import { AccessibleMagazineCard } from './AccessibilityEnhancements';

interface MagazineIssue {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  fileSize?: string;
  pageCount?: number;
}

interface MagazineCardWrapperProps {
  issue: MagazineIssue;
  locale: string;
}

export default function MagazineCardWrapper({ issue, locale }: MagazineCardWrapperProps) {
  const handleView = (id: string) => {
    window.location.href = `/${locale}/magazine/issue/${id}`;
  };

  const handleDownload = (id: string) => {
    console.log('Download issue:', id);
    // Implement download functionality
    // This could be expanded to actual download logic
  };

  return (
    <AccessibleMagazineCard
      issue={issue}
      onView={handleView}
      onDownload={handleDownload}
      locale={locale}
    />
  );
}
