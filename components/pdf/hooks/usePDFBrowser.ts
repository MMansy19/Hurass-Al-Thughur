"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PDFRecord } from "@/types/pdf";
import { getAllPDFs, getPDFCategories } from "@/utils/pdf-helpers";

export function usePDFBrowser() {
  const params = useParams();
  const locale = params.locale as string;

  const [pdfFiles, setPdfFiles] = useState<PDFRecord[]>([]);
  const [filteredPDFs, setFilteredPDFs] = useState<PDFRecord[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Fetch PDF list and categories from Supabase
  const fetchPDFList = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [pdfData, categoryData] = await Promise.all([
        getAllPDFs(),
        getPDFCategories()
      ]);
      setPdfFiles(pdfData);
      setFilteredPDFs(pdfData);
      setCategories(categoryData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error fetching PDFs:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPDFList();
  }, []);
  // Filter PDFs based on search term and category
  useEffect(() => {
    let filtered = pdfFiles;

    // Filter by category first
    if (selectedCategory.trim() !== "") {
      filtered = filtered.filter((pdf) => pdf.category === selectedCategory);
    }

    // Then filter by search term
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((pdf) => {
        // Search in filename
        if (pdf.filename.toLowerCase().includes(searchLower)) {
          return true;
        }

        // Search in titles
        if (pdf.title_ar.toLowerCase().includes(searchLower) ||
            pdf.title_en.toLowerCase().includes(searchLower)) {
          return true;
        }

        // Search in descriptions
        if ((pdf.description_ar && pdf.description_ar.toLowerCase().includes(searchLower)) ||
            (pdf.description_en && pdf.description_en.toLowerCase().includes(searchLower))) {
          return true;
        }

        // Search in category
        if (pdf.category && pdf.category.toLowerCase().includes(searchLower)) {
          return true;
        }

        // Search in author
        if (pdf.author && pdf.author.toLowerCase().includes(searchLower)) {
          return true;
        }

        // Search in tags
        if (pdf.tags && pdf.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))) {
          return true;
        }

        return false;
      });
    }

    setFilteredPDFs(filtered);
  }, [searchTerm, selectedCategory, pdfFiles, locale]);
  return {
    pdfFiles,
    filteredPDFs,
    categories,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    error,
    retryFetch: fetchPDFList,
  };
}
