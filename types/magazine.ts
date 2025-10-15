// Shared interfaces for magazine components
export interface MagazineIssue {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  date: string;
  category: string;
  author?: string | undefined;
  tags?: string[] | undefined;
  fileSize?: string | undefined;
  pageCount?: number | undefined;
}

export interface MagazineIssueDisplay extends MagazineIssue {
  // Additional display properties if needed
  formattedDate?: string;
  shortDescription?: string;
}