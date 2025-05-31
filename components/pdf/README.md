# PDF Components Architecture

This document describes the enhanced architecture for the PDF-related components in the Hurass Al-Thughur project.

## Overview

The PDF components have been modularized to improve maintainability, reusability, and code organization. The architecture follows a component-based approach with clear separation of concerns.

## Component Structure

```
components/pdf/
├── PDFViewer.tsx              # Main PDF viewer component
├── PDFViewerSection.tsx       # Container component for PDF viewer
├── PDFBrowser.tsx             # PDF browsing and listing component
├── hooks/
│   ├── usePDFViewer.ts        # Hook for PDF viewer functionality
│   └── usePDFBrowser.ts       # Hook for PDF browser functionality  
├── controls/
│   └── Controls.tsx           # PDF viewer control components
├── browser/
│   ├── SearchBar.tsx          # Search component for PDF browser
│   └── PDFGrid.tsx            # Grid for displaying PDF cards
└── ui/
    └── PDFComponents.tsx      # Reusable UI components for the PDF viewer
```

## Component Responsibilities

### Main Components
- **PDFViewer.tsx**: Renders a PDF document with navigation and zoom controls
- **PDFViewerSection.tsx**: Container for the PDF viewer with title and lazy loading
- **PDFBrowser.tsx**: Displays a grid of available PDFs with search functionality

### Custom Hooks
- **usePDFViewer.ts**: Manages PDF viewer state (pages, zoom, navigation)
- **usePDFBrowser.ts**: Handles PDF browser state (loading, filtering, search)

### UI Components
- **Controls.tsx**: 
  - `PDFControlsWrapper`: Container for PDF controls
  - `NavigationButton`: Page navigation buttons
  - `PageIndicator`: Shows current page/total pages
  - `ZoomControl`: Handles zoom in/out functionality

- **PDFComponents.tsx**:
  - `PDFContainer`: Main container for PDF viewer
  - `PDFDocumentWrapper`: Wrapper for the PDF document
  - `PDFLoading`: Loading indicator
  - `PDFError`: Error display component

- **Browser Components**:
  - `SearchBar`: Search input for filtering PDFs
  - `PDFGrid`: Grid display for PDF files
  - `PDFCard`: Individual PDF card with link to view

## API Integration

The PDF components interact with a Next.js API route:
- `app/api/pdfs/route.ts`: Returns a list of available PDF files from the public directory

## Features

- **Responsive Design**: Adapts to different screen sizes
- **Zoom Controls**: Allows users to zoom in/out of PDF documents
- **Page Navigation**: Intuitive controls for moving between pages
- **Smooth Loading**: Loading states for both the browser and viewer
- **Search Functionality**: Filtering PDFs by name
- **Error Handling**: Proper error displays for various failure scenarios

## Usage

To display a PDF:

```tsx
<PDFViewerSection
  pdfUrl="/pdfs/example.pdf"
  title="Example Document"
  messages={{
    previousPage: "Previous",
    nextPage: "Next",
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",
    loading: "Loading...",
    error: "Error"
  }}
/>
```

To display the PDF browser:

```tsx
<PDFBrowser
  translations={{
    browseAllPDFs: "Browse All PDFs",
    viewPDF: "View PDF",
    noPDFsFound: "No PDFs Found",
    search: "Search",
    searchPlaceholder: "Search for PDFs..."
  }}
/>
```
