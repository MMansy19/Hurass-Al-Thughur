'use client';

import React, { useCallback } from 'react';
import { IntegratedMagazineGrid } from './IntegratedComponents';

interface MagazineIssue {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  coverImage?: string;
  pdfUrl?: string;
  fileSize?: string;
  pageCount?: number;
}

interface MagazineGridWrapperProps {
  issues: MagazineIssue[];
  locale: string;
  isLoading?: boolean;
  columns?: number;
  readNowText?: string;
  enableAnimations?: boolean;
  enableAccessibilityFeatures?: boolean;
  className?: string;
}

export function MagazineGridWrapper({
  issues,
  locale,
  isLoading = false,
  columns = 3,
  readNowText = locale === 'ar' ? 'اقرأ الآن' : 'Read Now',
  enableAnimations = true,
  enableAccessibilityFeatures = true,
  className = ''
}: MagazineGridWrapperProps) {  // Handle issue view action - navigate to magazine issue page
  const handleIssueView = useCallback((id: string) => {
    window.location.href = `/${locale}/magazine/issue/${id}`;
  }, [locale]);

  // Handle issue download action - trigger PDF download
  const handleIssueDownload = useCallback((id: string) => {
    // Find the issue to get its title for proper filename
    const issue = issues.find(i => i.id === id);
    const link = document.createElement('a');
    link.href = `/pdfs/magazine-issue-${id}.pdf`;
    link.download = `${issue?.title?.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_') || `magazine-issue-${id}`}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [issues]);

  return (
    <div className={className}>
      <IntegratedMagazineGrid
        issues={issues}
        onIssueView={handleIssueView}
        onIssueDownload={handleIssueDownload}
        locale={locale}
        isLoading={isLoading}
        columns={columns}
        readNowText={readNowText}
        enableAnimations={enableAnimations}
        enableAccessibilityFeatures={enableAccessibilityFeatures}
      />
    </div>
  );
}
