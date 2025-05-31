import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const workerPath = path.join(process.cwd(), "public", "pdf-worker", "pdf.worker.min.mjs");
    
    // Check if the worker file exists
    if (!fs.existsSync(workerPath)) {
      return NextResponse.json({ error: "PDF worker not found" }, { status: 404 });
    }
    
    // Read the worker file
    const workerContent = fs.readFileSync(workerPath, 'utf8');
    
    // Return the worker with proper headers
    return new NextResponse(workerContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error("Error serving PDF worker:", error);
    return NextResponse.json(
      { error: "Failed to serve PDF worker" },
      { status: 500 }
    );
  }
}
