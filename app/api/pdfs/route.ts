import { NextResponse } from "next/server";
import { pdfMetadata } from "@/config/pdf-metadata";

export async function GET() {
  try {
    // Return all PDF metadata with Google Drive links
    const pdfFiles = pdfMetadata.map((metadata) => ({
      name: metadata.filename,
      path: metadata.useGoogleDrive && metadata.googleDriveId 
        ? `https://drive.google.com/file/d/${metadata.googleDriveId}/preview`
        : `/pdfs/${metadata.filename}`,
      coverImage: metadata.coverImage,
      useGoogleDrive: metadata.useGoogleDrive,
      googleDriveId: metadata.googleDriveId,
      title: metadata.title,
      description: metadata.description,
      category: metadata.category,
      author: metadata.author,
      tags: metadata.tags,
      publishDate: metadata.publishDate,
      issueNumber: metadata.issueNumber,
      fileSize: metadata.fileSize,
      pageCount: metadata.pageCount,
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
