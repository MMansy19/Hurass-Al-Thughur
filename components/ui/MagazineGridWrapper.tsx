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
}: MagazineGridWrapperProps) {
  // Handle issue view action - defined within client component
  const handleIssueView = useCallback((id: string) => {
    console.log('View issue:', id);
    // Implement issue view functionality here
    // For example, open in a modal, navigate to issue page, etc.
  }, []);

  // Handle issue download action - defined within client component
  const handleIssueDownload = useCallback((id: string) => {
    console.log('Download issue:', id);
    // Implement issue download functionality here
    // For example, trigger download, open PDF viewer, etc.
  }, []);

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
