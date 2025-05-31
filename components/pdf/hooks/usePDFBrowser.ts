"use client";

import { useState, useEffect } from 'react';

interface PDFFile {
  name: string;
  path: string;
}

export function usePDFBrowser() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [filteredPDFs, setFilteredPDFs] = useState<PDFFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Fetch PDF list from API
  useEffect(() => {
    async function fetchPDFList() {
      try {
        const response = await fetch(`/api/pdfs`);
        if (!response.ok) {
          throw new Error("Failed to fetch PDF list");
        }
        const data = await response.json();
        setPdfFiles(data);
        setFilteredPDFs(data);
        setIsLoading(false);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error("Error fetching PDFs:", errorMessage);
        setError(errorMessage);
        setIsLoading(false);
      }
    }

    fetchPDFList();
  }, []);

  // Filter PDFs based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPDFs(pdfFiles);
    } else {
      const filtered = pdfFiles.filter((pdf) =>
        pdf.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPDFs(filtered);
    }
  }, [searchTerm, pdfFiles]);

  return {
    pdfFiles,
    filteredPDFs,
    isLoading,
    searchTerm,
    setSearchTerm,
    error
  };
}
