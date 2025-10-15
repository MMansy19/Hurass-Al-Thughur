// Updated PDF types for Supabase integration
export interface PDFRecord {
  id: number;
  created_at: string;
  updated_at: string;
  filename: string;
  title_ar: string;
  title_en: string;
  description_ar?: string;
  description_en?: string;
  category?: string;
  author?: string;
  publish_date?: string;
  tags?: string[];
  file_size_mb?: number;
  page_count?: number;
  google_drive_id?: string; // Google Drive file ID for PDF
  cover_image_id?: string; // Google Drive file ID for cover image
  is_issue: boolean;
  issue_number?: number;
  is_published: boolean;
  is_featured: boolean;
  meta_description_ar?: string;
  meta_description_en?: string;
  slug_ar?: string;
  slug_en?: string;
}

// Compatibility interface for existing code
export interface PDFMetadata {
  filename: string;
  title: {
    en: string;
    ar: string;
  };
  description?: {
    en: string;
    ar: string;
  };
  category?: string;
  author?: string;
  publishDate?: string;
  tags?: string[];
  googleDriveId?: string;
  googleDriveUrl?: string;
  useGoogleDrive?: boolean;
  coverImageUrl?: string;
  isIssue?: boolean;
  issueNumber?: number;
}

// Magazine Issue interface
export interface MagazineIssue {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  pdfUrl: string;
  coverImageUrl?: string | undefined;
  fileSize?: string | undefined;
  pageCount?: number | undefined;
  author?: string | undefined;
  tags?: string[] | undefined;
}

// Library PDF interface
export interface LibraryPDF {
  id: number;
  filename: string;
  title: string;
  description?: string | undefined;
  category?: string | undefined;
  author?: string | undefined;
  publishDate?: string | undefined;
  tags?: string[] | undefined;
  pdfUrl: string;
  coverImageUrl?: string | undefined;
}