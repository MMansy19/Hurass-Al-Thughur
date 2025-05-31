import PDFViewerSection from "@/components/pdf/PDFViewerSection";
import TailwindTest from "./tailwindtest";

export default function TestPDFPage() {
    // Test with either:
    // 1. A PDF in your public folder: "/sample.pdf"
    // 2. Or an online PDF URL
    const testPdfUrl = "/pdfs/MahmoudMansy_Frontend_Engineer.pdf"; 
    // const testPdfUrl = "https://drive.google.com/file/d/1HXEfTtU-8uqxjukGI35N7kOrn5Paf8D7/view?usp=sharing"; 

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">PDF Viewer Test</h1>
            
            {/* Tailwind CSS Test Component */}
            <div className="mb-10">
                <TailwindTest />
            </div>
            
            <PDFViewerSection
                pdfUrl={testPdfUrl}
                title="Sample PDF Document"
                messages={{
                    previousPage: "Previous",
                    nextPage: "Next",
                    zoomIn: "Zoom In",
                    zoomOut: "Zoom Out",
                    loading: "Loading document...",
                    error: "Failed to load PDF"
                }}
            />
        </main>
    );
}