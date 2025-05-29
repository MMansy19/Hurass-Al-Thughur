import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const pdfDirectory = path.join(process.cwd(), "public/pdfs");
    
    // Check if the directory exists
    if (!fs.existsSync(pdfDirectory)) {
      return NextResponse.json({ error: "PDF directory not found" }, { status: 404 });
    }
    
    // Read all files in the directory
    const files = fs.readdirSync(pdfDirectory);
    
    // Filter and format the PDF files
    const pdfFiles = files
      .filter(file => file.toLowerCase().endsWith(".pdf"))
      .map(file => ({
        name: file,
        path: `/pdfs/${file}`
      }));
    
    return NextResponse.json(pdfFiles);
  } catch (error) {
    console.error("Error reading PDF directory:", error);
    return NextResponse.json(
      { error: "Failed to read PDF files" },
      { status: 500 }
    );
  }
}
