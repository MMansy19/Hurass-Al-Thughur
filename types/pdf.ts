// Updated PDF types for local storage integration
export interface PDFRecord {
  id: string; // Changed from number to string for local system
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
  file_size?: number; // File size in bytes
  page_count?: number;
  google_drive_id?: string; // Google Drive file ID for PDF (optional)
  cover_image_id?: string; // Not used in local system
  issue_number?: number;
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
  id: string; // Changed from number to string for consistency
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