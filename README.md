# Hurass Al-Thughur (حُراس الثغور)

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.8-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🌟 Overview

**Hurass Al-Thughur** (حُراس الثغور) is a sophisticated bilingual Islamic academic platform that provides an advanced PDF library management system. Built with Next.js and featuring a cutting-edge PDF viewer, it serves as a digital fortress for Islamic knowledge and scholarship.

### ✨ Key Features

- 🌍 **Bilingual Support**: Full Arabic (RTL) and English (LTR) interface
- 📚 **Advanced PDF Library**: Intelligent search and categorization system
- 🔍 **Smart Search**: Multi-language metadata search with filtering
- 📖 **Professional PDF Viewer**: Industry-leading PDF viewing experience
- 🎨 **Modern UI/UX**: Responsive design with Arabic typography support
- ⚡ **Performance Optimized**: Built with Next.js 15 App Router
- 🔐 **SEO Optimized**: Dynamic metadata generation for all pages

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/hurass-al-thughur.git
cd hurass-al-thughur

# Install dependencies
npm install

# Copy PDF.js worker files
npm run copy-worker

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
hurass-al-thughur/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Internationalized routes
│   │   ├── layout.tsx           # Locale-specific layout
│   │   ├── page.tsx             # Home page
│   │   ├── library/             # PDF library section
│   │   ├── magazine/            # Magazine section
│   │   ├── dawah/               # Dawah content
│   │   └── contact/             # Contact forms
│   ├── api/                      # API routes
│   │   ├── pdf-worker/          # PDF.js worker endpoint
│   │   └── pdfs/                # PDF file serving
│   └── globals.css              # Global styles
├── components/                   # Reusable React components
│   ├── pdf/                     # PDF-related components
│   │   ├── PDFViewer.tsx        # Main PDF viewer
│   │   ├── PDFBrowser.tsx       # PDF library browser
│   │   ├── controls/            # PDF controls
│   │   ├── hooks/               # PDF custom hooks
│   │   └── ui/                  # PDF UI components
│   └── ui/                      # General UI components
├── config/                      # Configuration files
│   └── pdf-metadata.ts          # PDF metadata configuration
├── locales/                     # Internationalization
│   ├── ar.json                  # Arabic translations
│   └── en.json                  # English translations
├── public/                      # Static assets
│   ├── pdfs/                    # PDF files
│   ├── images/                  # Images and logos
│   └── pdf-worker/              # PDF.js worker files
├── types/                       # TypeScript type definitions
├── utils/                       # Utility functions
└── scripts/                     # Build and deployment scripts
```

## 🔧 Technical Architecture

### Core Technologies

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.0
- **Styling**: TailwindCSS with custom Arabic typography
- **PDF Engine**: PDF.js with React-PDF wrapper
- **Internationalization**: next-intl
- **Fonts**: Cairo (Arabic), Roboto (English)

### PDF Viewer Features

The PDF viewer is engineered to provide a superior reading experience:

- **Multi-format Support**: PDF, with planned support for EPUB and DOCX
- **Advanced Navigation**: Page jumping, bookmarks, table of contents
- **Zoom Controls**: Fit-to-width, fit-to-page, custom zoom levels
- **Search Functionality**: Full-text search within documents
- **Annotation Support**: Highlighting, notes, and comments
- **Download & Print**: High-quality export options
- **Keyboard Shortcuts**: Professional navigation shortcuts
- **Responsive Design**: Optimized for all screen sizes
- **Performance**: Lazy loading and virtualization for large documents

## 📚 Development Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev:turbo        # Start with Turbopack (faster)

# Building
npm run build            # Production build
npm run start            # Start production server

# Utilities
npm run lint             # Run ESLint
npm run copy-worker      # Copy PDF.js worker files
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <strong>Built with ❤️ for the Islamic Academic Community</strong>
  <br>
  <sub>Preserving and sharing Islamic knowledge through technology</sub>
</div>
