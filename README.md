<div align="center">

# حُراس الثغور | Hurass Al-Thughur

<img src="public/images/logo.jpg" alt="Hurass Al-Thughur Logo" width="120" height="120" style="border-radius: 10px;">

### A Modern Islamic Knowledge Platform

[![Website](https://img.shields.io/badge/Website-Live-brightgreen?style=for-the-badge&logo=vercel)](https://hurass-althughur.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-MMansy19-black?style=for-the-badge&logo=github)](https://github.com/MMansy19)

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.8-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://hurass-althughur.vercel.app)

</div>

---

## 🌟 Overview

**Hurass Al-Thughur** (حُراس الثغور) is a sophisticated, bilingual Islamic knowledge platform designed to preserve and disseminate authentic Islamic teachings. Built with cutting-edge web technologies, it serves as a comprehensive digital library and magazine platform for the global Muslim community.

> **🌐 Live Demo**: [https://hurass-althughur.vercel.app](https://hurass-althughur.vercel.app)

This platform bridges traditional Islamic scholarship with modern technology, providing an intuitive and accessible interface for studying Islamic texts, magazines, and educational materials.

## ✨ Platform Features

### 🎯 Core Functionality
- **📖 Islamic Magazine**: Digital magazine with issues covering Aqeedah, Fiqh, Prophet's Biography, and Islamic History
- **📚 Digital Library**: Comprehensive collection of Islamic educational materials, brochures, and resources
- **🤲 Dawah Section**: Introduction to Islam materials for non-Muslims and new Muslim guides
- **💬 Contact System**: Interactive contact forms for community engagement

### 🌍 Internationalization & Accessibility
- **Bilingual Interface**: Complete Arabic (RTL) and English (LTR) support
- **Cultural Adaptation**: Authentic Arabic typography with Cairo font family
- **Accessibility Standards**: WCAG compliant with screen reader support
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🔧 Technical Excellence
- **Advanced PDF Viewer**: 
  - Full-text search within documents
  - Zoom controls (fit-to-width, fit-to-page, custom levels)
  - Thumbnail navigation and page jumping
  - Download and print functionality
  - Bookmark support and table of contents
- **Smart Search**: Intelligent filtering and categorization
- **Performance Optimization**: Lazy loading, image optimization, and efficient caching
- **SEO Optimized**: Dynamic metadata generation and structured data markup

### 🎨 User Experience
- **Modern UI/UX**: Clean, intuitive interface with Islamic design principles
- **Animation System**: Smooth transitions and micro-interactions
- **Loading States**: Elegant loading indicators and skeleton screens
- **Error Handling**: Comprehensive error boundaries and user-friendly messages

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 8+ or **yarn** 1.22+
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/MMansy19/hurass.git
cd hurass

# Install dependencies
npm install
# or
yarn install

# Copy PDF.js worker files
npm run copy-worker

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Hurass Al-Thughur"

# Optional: Analytics and Monitoring
# NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_ga_id
```

## 📁 Project Architecture

```
hurass/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 [locale]/                 # Internationalized routes
│   │   ├── 📄 layout.tsx           # Root layout with locale support
│   │   ├── 📄 page.tsx             # Homepage with hero section
│   │   ├── 📁 magazine/            # Islamic magazine section
│   │   │   ├── 📄 page.tsx         # Magazine grid view
│   │   │   ├── 📁 issue/[id]/      # Individual magazine issues
│   │   │   ├── 📁 category/[cat]/  # Magazine categories
│   │   │   └── 📁 all/             # All issues view
│   │   ├── 📁 library/             # Digital library
│   │   │   ├── 📄 page.tsx         # Library main page
│   │   │   ├── 📁 pdf/[id]/        # PDF viewer pages
│   │   │   ├── 📁 category/[cat]/  # Library categories
│   │   │   └── 📁 brochure/[id]/   # Brochure viewer
│   │   ├── 📁 dawah/               # Islamic outreach content
│   │   │   ├── 📄 page.tsx         # Dawah main page
│   │   │   ├── 📁 article/[id]/    # Individual articles
│   │   │   └── 📁 material/[id]/   # Educational materials
│   │   └── 📁 contact/             # Contact forms and info
│   ├── 📁 api/                      # API endpoints
│   │   ├── 📁 pdf-worker/          # PDF.js worker service
│   │   └── 📁 pdfs/                # PDF file serving API
│   └── 📄 globals.css              # Global styles and animations
├── 📁 components/                   # Reusable React components
│   ├── 📁 pdf/                     # PDF-specific components
│   │   ├── 📄 PDFViewer.tsx        # Advanced PDF viewer
│   │   ├── 📄 PDFBrowser.tsx       # PDF library browser
│   │   ├── 📁 controls/            # PDF navigation controls
│   │   ├── 📁 hooks/               # Custom PDF hooks
│   │   └── 📁 ui/                  # PDF UI components
│   ├── 📁 magazine/                # Magazine components
│   │   └── 📄 MagazineIssueViewer.tsx
│   └── 📁 ui/                      # General UI components
│       ├── 📄 Header.tsx           # Navigation header
│       ├── 📄 Footer.tsx           # Site footer
│       ├── 📄 SEO.tsx              # SEO meta tags
│       ├── 📄 AnimationSystem.tsx  # Animation components
│       └── 📄 AccessibilityComponents.tsx
├── 📁 config/                      # Configuration files
│   └── 📄 pdf-metadata.ts          # PDF metadata configuration
├── 📁 locales/                     # Internationalization
│   ├── 📄 ar.json                  # Arabic translations
│   └── 📄 en.json                  # English translations
├── 📁 public/                      # Static assets
│   ├── 📁 pdfs/                    # PDF document library
│   ├── 📁 images/                  # Images, icons, and logos
│   ├── 📁 fonts/                   # Custom Arabic fonts
│   └── 📁 pdf-worker/              # PDF.js worker files
├── 📁 types/                       # TypeScript definitions
├── 📁 utils/                       # Utility functions
├── 📁 styles/                      # CSS and styling
└── 📁 scripts/                     # Build and deployment scripts
```

## 🔧 Technical Stack & Architecture

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.3.2 | React framework with App Router |
| **React** | 19.0 | UI library with concurrent features |
| **TypeScript** | 5.0 | Type-safe development |
| **TailwindCSS** | 4.1.8 | Utility-first CSS framework |
| **PDF.js** | Latest | PDF rendering engine |
| **next-intl** | Latest | Internationalization |

### Advanced Features

#### 🔍 PDF Viewer Engine
Our custom PDF viewer provides enterprise-grade document viewing:

```typescript
// Advanced PDF features
const pdfFeatures = {
  rendering: 'Canvas + SVG hybrid rendering',
  search: 'Full-text search with highlighting',
  navigation: 'Thumbnail sidebar, page jumping',
  zoom: 'Smart zoom with fit-to-width/page',
  annotations: 'Highlighting and note-taking',
  export: 'High-quality PDF download',
  performance: 'Lazy loading + virtualization',
  accessibility: 'Screen reader compatible'
};
```

#### 🌐 Internationalization System
- **RTL/LTR Support**: Automatic layout direction switching
- **Font Optimization**: Cairo for Arabic, Roboto for English
- **Dynamic Content**: Locale-aware routing and content
- **Cultural Adaptation**: Islamic calendar, number formatting

#### ⚡ Performance Optimizations
- **Image Optimization**: Next.js Image component with blur placeholders
- **Bundle Splitting**: Dynamic imports and code splitting
- **Caching Strategy**: Intelligent caching for static assets
- **Core Web Vitals**: Optimized for Google's performance metrics

### Development Workflow

```bash
# Development commands
npm run dev              # Start development server
npm run dev:turbo        # Start with Turbopack (experimental)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # ESLint code analysis
npm run type-check       # TypeScript type checking
npm run copy-worker      # Copy PDF.js worker files

# Quality assurance
npm run test             # Run test suite (if implemented)
npm run lighthouse       # Performance auditing
```

## 📱 Platform Sections

### 🏠 Homepage
- **Hero Section**: Welcoming introduction to the platform
- **Feature Overview**: Quick access to main sections
- **About Section**: Information about the Hurass team mission

### 📖 Magazine Section (`/magazine`)
Digital Islamic magazine with rich content:
- **Latest Issues**: Recent publications with topics like Aqeedah, Fiqh, Prophet's Biography
- **Category Browser**: Organized by Islamic knowledge areas
- **Issue Viewer**: Professional PDF reader with advanced features
- **Search & Filter**: Find specific topics and authors

### 📚 Library Section (`/library`)
Comprehensive digital library:
- **PDF Collection**: Scholarly articles, research papers, and books
- **Brochures**: Educational pamphlets and quick reference guides
- **Image Resources**: Islamic educational graphics and infographics
- **Smart Categorization**: Organized by topic and difficulty level

### 🤲 Dawah Section (`/dawah`)
Islamic outreach and education:
- **Introduction to Islam**: Fundamental concepts for non-Muslims
- **New Muslim Guide**: Step-by-step guidance for new converts
- **Educational Articles**: Comprehensive explanations of Islamic principles
- **Downloadable Materials**: Shareable content for dawah activities

### 📞 Contact Section (`/contact`)
- **Interactive Forms**: Multi-language contact forms
- **Direct Communication**: Email, phone, and social media links
- **Location Information**: Office details and visiting hours

## 🎯 Target Audience

- **Islamic Scholars**: Researchers and academics in Islamic studies
- **Students**: Individuals learning about Islam at various levels
- **New Muslims**: People who have recently converted to Islam
- **Dawah Workers**: Those engaged in Islamic outreach activities
- **General Public**: Anyone interested in authentic Islamic knowledge

## 🌍 Deployment & Infrastructure

### Live Deployment
- **Production URL**: [https://hurass-althughur.vercel.app](https://hurass-althughur.vercel.app)
- **Platform**: Vercel (Optimized for Next.js)
- **CDN**: Global edge network for fast content delivery
- **SSL**: Automatic HTTPS with TLS 1.3

### Performance Metrics
- **Core Web Vitals**: Optimized for Google's performance standards
- **Lighthouse Score**: 90+ across all categories
- **Mobile Optimization**: Perfect mobile experience
- **Accessibility**: WCAG 2.1 AA compliant

## 🤝 Contributing

We welcome contributions from the global Muslim community! Here's how you can help:

### How to Contribute

1. **Fork the Repository**
   ```bash
   git fork https://github.com/MMansy19/hurass.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/new-amazing-feature
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Add appropriate tests if applicable
   - Update documentation as needed

4. **Commit Your Changes**
   ```bash
   git commit -m "feat: add amazing new feature"
   ```

5. **Push and Create Pull Request**
   ```bash
   git push origin feature/new-amazing-feature
   ```

### Contribution Guidelines

- **Code Quality**: Follow TypeScript best practices
- **Islamic Content**: Ensure all content aligns with authentic Islamic teachings
- **Accessibility**: Maintain WCAG compliance
- **Internationalization**: Support both Arabic and English languages
- **Performance**: Optimize for speed and efficiency

### Areas for Contribution

- 📝 **Content**: Adding new Islamic articles and materials
- 🌐 **Translation**: Improving Arabic and English translations
- 🎨 **Design**: Enhancing UI/UX components
- 🔧 **Technical**: Performance improvements and new features
- 📱 **Testing**: Adding test coverage and quality assurance
- 📚 **Documentation**: Improving guides and documentation

## 👨‍💻 Author

**Mahmoud Al-Mansy (MMansy19)**
- 🌐 **GitHub**: [@MMansy19](https://github.com/MMansy19)
- 📧 **Contact**: Available through the website contact form
- 🌍 **Location**: Saudi Arabia

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### Third-Party Licenses
- **PDF.js**: Apache License 2.0
- **Next.js**: MIT License
- **TailwindCSS**: MIT License

## 🙏 Acknowledgments

- **Islamic Scholars**: For their invaluable knowledge and guidance
- **Open Source Community**: For the amazing tools and libraries
- **Muslim Developers**: For inspiration and feedback
- **Vercel**: For excellent hosting and deployment platform

## 📊 Project Status

- ✅ **Production Ready**: Live and stable
- 🔄 **Actively Maintained**: Regular updates and improvements
- 🌱 **Growing**: New features and content added regularly
- 🛡️ **Secure**: Following best security practices

---

<div align="center">

### 🕌 Built with ❤️ for the Global Muslim Community

**"And whoever saves a life, it is as if he has saved all of mankind"** - *Quran 5:32*

[![Website](https://img.shields.io/badge/🌐_Visit_Website-hurass--althughur.vercel.app-brightgreen?style=for-the-badge)](https://hurass-althughur.vercel.app)
[![GitHub](https://img.shields.io/badge/⭐_Star_on_GitHub-MMansy19/hurass-yellow?style=for-the-badge)](https://github.com/MMansy19/Hurass-Al-Thughur)

*Preserving and sharing Islamic knowledge through modern technology*

</div>
