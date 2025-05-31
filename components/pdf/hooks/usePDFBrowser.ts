"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getPDFTitle, getPDFDescription, getPDFMetadata } from '@/config/pdf-metadata';

interface PDFFile {
  name: string;
  path: string;
}

export function usePDFBrowser() {
  const params = useParams();
  const locale = params.locale as string;
  
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [filteredPDFs, setFilteredPDFs] = useState<PDFFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');  const [error, setError] = useState<string | null>(null);

  // Fetch PDF list from API
  const fetchPDFList = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/pdfs`);
      if (!response.ok) {
        throw new Error("Failed to fetch PDF list");
      }
      const data = await response.json();
      setPdfFiles(data);
      setFilteredPDFs(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Error fetching PDFs:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPDFList();
  }, []);
  // Filter PDFs based on search term with metadata support
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPDFs(pdfFiles);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = pdfFiles.filter((pdf) => {
        // Search in filename
        if (pdf.name.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // Search in metadata title
        const title = getPDFTitle(pdf.name, locale);
        if (title.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // Search in metadata description
        const description = getPDFDescription(pdf.name, locale);
        if (description && description.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // Search in metadata tags and category
        const metadata = getPDFMetadata(pdf.name);
        if (metadata) {
          if (metadata.category && metadata.category.toLowerCase().includes(searchLower)) {
            return true;
          }
          if (metadata.author && metadata.author.toLowerCase().includes(searchLower)) {
            return true;
          }
          if (metadata.tags && metadata.tags.some(tag => tag.toLowerCase().includes(searchLower))) {
            return true;
          }
        }
        
        return false;
      });
      setFilteredPDFs(filtered);
    }
  }, [searchTerm, pdfFiles, locale]);
  return {
    pdfFiles,
    filteredPDFs,
    isLoading,
    searchTerm,
    setSearchTerm,
    error,
    retryFetch: fetchPDFList
  };
}
