import { PDFRecord, MagazineIssue, LibraryPDF } from "@/types/pdf";
import { pdfMetadata, PDFMetadata } from "@/config/pdf-metadata";

// Helper function to generate Google Drive preview URL
export function getGoogleDrivePreviewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

// Helper function to generate Google Drive direct view URL  
export function getGoogleDriveViewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/view`;
}

// Helper function to generate Google Drive cover image URL from PDF Google Drive ID
export function getGoogleDriveCoverImageUrl(fileId: string): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h600`;
}

// Convert PDFMetadata to PDFRecord format
function metadataToPDFRecord(metadata: PDFMetadata, index: number): PDFRecord {
  return {
    id: String(index + 1),
    filename: metadata.filename,
    title_en: metadata.title.en,
    title_ar: metadata.title.ar,
    description_en: metadata.description?.en || "",
    description_ar: metadata.description?.ar || "",
    category: metadata.category || "Uncategorized",
    author: metadata.author,
    publish_date: metadata.publishDate,
    tags: metadata.tags || [],
    cover_image_id: undefined, // Not using Google Drive for cover images
    google_drive_id: metadata.googleDriveId,
    file_size: metadata.fileSize,
    page_count: metadata.pageCount,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    issue_number: metadata.issueNumber,
  };
}

// Get PDF URL from database record
export function getPDFUrlFromRecord(pdf: PDFRecord): string {
  // Use Google Drive if available
  if (pdf.google_drive_id) {
    return getGoogleDrivePreviewUrl(pdf.google_drive_id);
  }
  // Fallback to local PDFs stored in /public/pdfs/
  return `/pdfs/${pdf.filename}`;
}

// Get PDF title by locale from database record
export function getPDFTitleFromRecord(pdf: PDFRecord, locale: string): string {
  return locale === "ar" ? pdf.title_ar : pdf.title_en;
}

// Get PDF description by locale from database record
export function getPDFDescriptionFromRecord(pdf: PDFRecord, locale: string): string | undefined {
  if (locale === "ar") {
    return pdf.description_ar || pdf.description_en;
  }
  return pdf.description_en || pdf.description_ar;
}

// Get cover image URL from PDF metadata (Google Drive or local images)
export function getCoverImageFromPDF(pdf: PDFRecord): string | undefined {
  // Find the metadata for this PDF
  const metadata = pdfMetadata.find(m => m.filename === pdf.filename);
  
  // Return the cover image URL (can be Google Drive thumbnail or local path)
  return metadata?.coverImage || undefined;
}

// Fetch all magazine issues from local metadata
export async function getMagazineIssues(): Promise<PDFRecord[]> {
  // Filter PDFs that have issue numbers (magazine issues)
  const magazineMetadata = pdfMetadata.filter(m => m.issueNumber !== undefined);
  
  return magazineMetadata
    .map((metadata, index) => metadataToPDFRecord(metadata, index))
    .sort((a, b) => (a.issue_number || 0) - (b.issue_number || 0));
}

// Fetch specific magazine issue by issue number
export async function getMagazineIssueByNumber(issueNumber: number): Promise<PDFRecord | null> {
  const metadata = pdfMetadata.find(m => m.issueNumber === issueNumber);
  
  if (!metadata) {
    return null;
  }
  
  return metadataToPDFRecord(metadata, issueNumber - 1);
}

// Fetch all library PDFs from local metadata
export async function getAllPDFs(category?: string): Promise<PDFRecord[]> {
  let filteredMetadata = pdfMetadata;
  
  if (category) {
    filteredMetadata = pdfMetadata.filter(m => m.category === category);
  }
  
  return filteredMetadata.map((metadata, index) => metadataToPDFRecord(metadata, index));
}

// Get PDF by filename
export async function getPDFByFilename(filename: string): Promise<PDFRecord | null> {
  const metadata = pdfMetadata.find(m => m.filename.toLowerCase() === filename.toLowerCase());
  
  if (!metadata) {
    return null;
  }
  
  const index = pdfMetadata.indexOf(metadata);
  return metadataToPDFRecord(metadata, index);
}

// Convert database record to MagazineIssue interface for compatibility
export function convertToMagazineIssue(
  pdf: PDFRecord, 
  locale: string
): MagazineIssue {
  const createdAtDate = pdf.created_at ? pdf.created_at.split('T')[0] : '';
  return {
    id: pdf.issue_number?.toString() || pdf.id.toString(),
    title: getPDFTitleFromRecord(pdf, locale),
    description: getPDFDescriptionFromRecord(pdf, locale) || '',
    date: pdf.publish_date || createdAtDate || '',
    category: pdf.category || '',
    pdfUrl: getPDFUrlFromRecord(pdf),
    coverImageUrl: getCoverImageFromPDF(pdf),
    fileSize: pdf.file_size ? `${(pdf.file_size / 1024 / 1024).toFixed(2)} MB` : undefined,
    pageCount: pdf.page_count || undefined,
    author: pdf.author || undefined,
    tags: pdf.tags || undefined
  };
}

// Convert database record to LibraryPDF interface
export function convertToLibraryPDF(pdf: PDFRecord, locale: string): LibraryPDF {
  return {
    id: pdf.id,
    filename: pdf.filename,
    title: getPDFTitleFromRecord(pdf, locale),
    description: getPDFDescriptionFromRecord(pdf, locale) || undefined,
    category: pdf.category || undefined,
    author: pdf.author || undefined,
    publishDate: pdf.publish_date || undefined,
    tags: pdf.tags || undefined,
    pdfUrl: getPDFUrlFromRecord(pdf),
    coverImageUrl: getCoverImageFromPDF(pdf)
  };
}

// Search PDFs by query (local implementation)
export async function searchPDFs(
  query: string, 
  isIssue?: boolean, 
  category?: string
): Promise<PDFRecord[]> {
  let filteredMetadata = pdfMetadata;
  
  // Filter by issue status
  if (isIssue !== undefined) {
    if (isIssue) {
      filteredMetadata = filteredMetadata.filter(m => m.issueNumber !== undefined);
    } else {
      filteredMetadata = filteredMetadata.filter(m => m.issueNumber === undefined);
    }
  }
  
  // Filter by category
  if (category) {
    filteredMetadata = filteredMetadata.filter(m => m.category === category);
  }
  
  // Search in title, description, and author fields
  const searchLower = query.toLowerCase();
  filteredMetadata = filteredMetadata.filter(m => 
    m.title.ar.toLowerCase().includes(searchLower) ||
    m.title.en.toLowerCase().includes(searchLower) ||
    m.description?.ar?.toLowerCase().includes(searchLower) ||
    m.description?.en?.toLowerCase().includes(searchLower) ||
    m.author?.toLowerCase().includes(searchLower)
  );
  
  return filteredMetadata.map((metadata, index) => metadataToPDFRecord(metadata, index));
}

// Backward compatibility functions for existing code
export async function getPDFMetadata(filename: string): Promise<PDFRecord | null> {
  return getPDFByFilename(filename);
}

export async function getPDFUrl(filename: string): Promise<string> {
  const pdf = await getPDFByFilename(filename);
  if (pdf) {
    return getPDFUrlFromRecord(pdf);
  }
  return `/pdfs/${filename}`;
}

export async function getPDFTitle(filename: string, locale: string): Promise<string> {
  const pdf = await getPDFByFilename(filename);
  if (pdf) {
    return getPDFTitleFromRecord(pdf, locale);
  }
  return filename.replace(/\.pdf$/i, "");
}

export async function getPDFDescription(
  filename: string,
  locale: string,
): Promise<string | undefined> {
  const pdf = await getPDFByFilename(filename);
  if (pdf) {
    return getPDFDescriptionFromRecord(pdf, locale);
  }
  return undefined;
}

// Get all unique categories from PDFs (local implementation)
export async function getPDFCategories(): Promise<string[]> {
  const categories = [...new Set(pdfMetadata
    .map(m => m.category)
    .filter(Boolean) as string[])];
  
  return categories.sort();
}