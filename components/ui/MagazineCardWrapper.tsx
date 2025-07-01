"use client";

import { AccessibleMagazineCard } from "./AccessibilityEnhancements";

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

export default function MagazineCardWrapper({
  issue,
  locale,
}: MagazineCardWrapperProps) {

  const handleDownload = (id: string) => {
    // Create PDF download using the same logic as the issue page
    const link = document.createElement("a");
    link.href = `/pdfs/magazine-issue-${id}.pdf`;
    link.download = `${issue.title.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AccessibleMagazineCard
      issue={issue}
      onDownload={handleDownload}
      locale={locale}
    />
  );
}
