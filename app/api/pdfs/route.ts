import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { pdfMetadata, getPDFUrl, shouldUseGoogleDrive } from "@/config/pdf-metadata";

export async function GET() {
  try {
    // Get all PDF files from metadata instead of scanning filesystem
    const pdfFiles = pdfMetadata.map((metadata) => ({
      name: metadata.filename,
      path: getPDFUrl(metadata.filename),
      useGoogleDrive: shouldUseGoogleDrive(metadata.filename),
      googleDriveId: metadata.googleDriveId,
    }));

    // For backwards compatibility, also check for local files that might not be in metadata
    const pdfDirectory = path.join(process.cwd(), "public/pdfs");
    
    if (fs.existsSync(pdfDirectory)) {
      const localFiles = fs.readdirSync(pdfDirectory);
      
      // Add any local PDF files that aren't in metadata
      const localPdfFiles = localFiles
        .filter((file) => file.toLowerCase().endsWith(".pdf"))
        .filter((file) => !pdfMetadata.some(meta => meta.filename === file))
        .map((file) => ({
          name: file,
          path: `/pdfs/${file}`,
          useGoogleDrive: false,
          googleDriveId: undefined,
        }));
      
      pdfFiles.push(...localPdfFiles);
    }

    return NextResponse.json(pdfFiles);
  } catch (error) {
    console.error("Error reading PDF configuration:", error);
    return NextResponse.json(
      { error: "Failed to read PDF files" },
      { status: 500 },
    );
  }
}
