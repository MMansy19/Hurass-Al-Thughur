import { supabase } from "@/supabase/initializing";
import { PDFRecord, MagazineIssue, LibraryPDF } from "@/types/pdf";

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

// Get PDF URL from database record
export function getPDFUrlFromRecord(pdf: PDFRecord): string {
  if (pdf.google_drive_id) {
    return getGoogleDrivePreviewUrl(pdf.google_drive_id);
  }
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

// Get cover image URL from PDF cover image ID
export function getCoverImageFromPDF(pdf: PDFRecord): string | undefined {
  if (pdf.cover_image_id) {
    return getGoogleDriveCoverImageUrl(pdf.cover_image_id);
  }
  return undefined;
}

// Fetch all magazine issues from Supabase
export async function getMagazineIssues(): Promise<PDFRecord[]> {
  const { data, error } = await supabase
    .from('magazine_issues')
    .select('*')
    .order('issue_number', { ascending: true });

  if (error) {
    console.error('Error fetching magazine issues:', error);
    return [];
  }

  return data || [];
}

// Fetch specific magazine issue by issue number
export async function getMagazineIssueByNumber(issueNumber: number): Promise<PDFRecord | null> {
  const { data, error } = await supabase
    .rpc('get_magazine_issue', { issue_num: issueNumber })
    .single();

  if (error) {
    console.error('Error fetching magazine issue:', error);
    return null;
  }

  return data as PDFRecord | null;
}

// Fetch all library PDFs from Supabase
export async function getAllPDFs(category?: string): Promise<PDFRecord[]> {
  let query = supabase
    .from('pdfs')
    .select('*')
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching library PDFs:', error);
    return [];
  }

  return data || [];
}

// Get PDF by filename
export async function getPDFByFilename(filename: string): Promise<PDFRecord | null> {
  const { data, error } = await supabase
    .from('pdfs')
    .select('*')
    .eq('filename', filename)
    .eq('is_published', true)
    .single();

  if (error) {
    console.error('Error fetching PDF by filename:', error);
    return null;
  }

  return data;
}

// Analytics functions removed - not needed for this implementation

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
    fileSize: pdf.file_size_mb ? `${pdf.file_size_mb} MB` : undefined,
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

// Search PDFs by query
export async function searchPDFs(
  query: string, 
  isIssue?: boolean, 
  category?: string
): Promise<PDFRecord[]> {
  let supabaseQuery = supabase
    .from('pdfs')
    .select('*')
    .eq('is_published', true);

  if (isIssue !== undefined) {
    supabaseQuery = supabaseQuery.eq('is_issue', isIssue);
  }

  if (category) {
    supabaseQuery = supabaseQuery.eq('category', category);
  }

  // Search in title and description fields
  supabaseQuery = supabaseQuery.or(
    `title_ar.ilike.%${query}%,title_en.ilike.%${query}%,description_ar.ilike.%${query}%,description_en.ilike.%${query}%,author.ilike.%${query}%`
  );

  const { data, error } = await supabaseQuery.order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching PDFs:', error);
    return [];
  }

  return data || [];
}

// Get unique categories
export async function getPDFCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('pdfs')
    .select('category')
    .eq('is_published', true)
    .not('category', 'is', null);

  if (error) {
    console.error('Error fetching PDF categories:', error);
    return [];
  }

  const categories = [...new Set(data.map(item => item.category).filter(Boolean))];
  return categories.sort();
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