import { NextResponse } from "next/server";
import { pdfMetadata, getPDFUrl } from "@/config/pdf-metadata";

export async function GET() {
  try {
    // Get all PDF files from metadata (no more filesystem scanning)
    const pdfFiles = pdfMetadata.map((metadata) => ({
      name: metadata.filename,
      path: getPDFUrl(metadata.filename),
      useGoogleDrive: true, // Always true now
      googleDriveId: metadata.googleDriveId,
      title: metadata.title,
      description: metadata.description,
      category: metadata.category,
      author: metadata.author,
      tags: metadata.tags,
    }));

    return NextResponse.json(pdfFiles);
  } catch (error) {
    console.error("Error reading PDF configuration:", error);
    return NextResponse.json(
      { error: "Failed to read PDF files" },
      { status: 500 },
    );
  }
}
