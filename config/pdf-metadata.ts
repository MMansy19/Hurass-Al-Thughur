export interface PDFMetadata {
  filename: string;
  title: {
    en: string;
    ar: string;
  };
  description?: {
    en: string;
    ar: string;
  };
  category?: string;
  author?: string;
  publishDate?: string;
  tags?: string[];
  // Google Drive configuration
  googleDriveId?: string;
  googleDriveUrl?: string;
  useGoogleDrive?: boolean;
}

export const pdfMetadata: PDFMetadata[] = [
  {
    filename: "1.pdf",
    title: {
      en: "The First Issue",
      ar: "العدد الأول",
    },
    description: {
      en: "Not Quraniyyun: Fitrah and Covenant",
      ar: "ليسوا قرآنيين: الفطرة والميثاق",
    },
    category: "Religious Studies",
    author: "Islamic Theology Department",
    publishDate: "2025",
    tags: ["fitrah", "covenant", "worship", "islam"],
    // Google Drive file ID for 1.pdf
    googleDriveId: "1UMurarFB8eXjj02YPHmlL_MQXq_8_7pi",
    useGoogleDrive: true,
  },
  {
    filename: "2.pdf",
    title: {
      en: "The Second Issue",
      ar: "العدد الثاني",
    },
    description: {
      en: "Tawhid Al-Uluhiyyah and Linguistic Weakness",
      ar: "توحيد الألوهية وضعف الملكة اللغوية",
    },
    category: "Theology",
    author: "Dr. Abdullah Al-Lughawi",
    publishDate: "2025",
    tags: ["tawhid", "linguistics", "denial", "aqeedah"],
    // Google Drive file ID for 2.pdf
    googleDriveId: "1JODOLrX6CxxW00jqq0L2yOMb5RLU6oUa",
    useGoogleDrive: true,
  },
  {
    filename: "3.pdf",
    title: {
      en: "The Third Issue",
      ar: "العدد الثالث",
    },
    description: {
      en: "Proofs of Prophethood and Orientalist Narratives",
      ar: "دلائل النبوة ومعركة الزلاقة",
    },
    category: "Islamic History",
    author: "Historical Studies Council",
    publishDate: "2025",
    tags: ["prophethood", "orientalism", "zallaqa", "history"],
    // Google Drive file ID for 3.pdf
    googleDriveId: "11fOWS30NTx5AnzGRBMjOePsoskNd76yy",
    useGoogleDrive: true,
  },
  {
    filename: "4.pdf",
    title: {
      en: "The Fourth Issue",
      ar: "العدد الرابع",
    },
    description: {
      en: "Spiritual Atheism. Proofs of Prophethood. The Twenty Revolution",
      ar: "الإلحاد الروحي. أدلة النبوة. ثورة العشرين",
    },
    category: "Islamic Studies",
    author: "Islamic Research Council",
    publishDate: "2025",
    tags: ["atheism", "prophethood", "revolution", "spirituality"],
    // Google Drive file ID for 4.pdf
    googleDriveId: "1remp7L3mJJhHqlCg-o3lOeprR8yvf3Jx",
    useGoogleDrive: true,
  },
  {
    filename: "5.pdf",
    title: {
      en: "The Fifth Issue",
      ar: "العدد الخامس",
    },
    description: {
      en: "The Map to the Path. What is Fitrah",
      ar: "الخريطة إلى الطريق. ما هي الفطرة",
    },
    category: "Religious Studies",
    author: "Fitrah Studies Department",
    publishDate: "2025",
    tags: ["fitrah", "guidance", "path", "nature"],
    // Google Drive file ID for 5.pdf
    googleDriveId: "1JunB2K2-P9WMzvJ0Ik_v4g8IPvwW4hzR",
    useGoogleDrive: true,
  },
  {
    filename: "6.pdf",
    title: {
      en: "The Sixth Issue",
      ar: "العدد السادس",
    },
    description: {
      en: "South America Culture Religion on How to Call",
      ar: " أمريكا الجنوبية ثقافة دينًا لكيفية الدعوة",
    },
    category: "Cultural Studies",
    author: "ابن عبدالصبور",
    publishDate: "2025",
    tags: ["south america", "culture", "religion", "da'wah"],
    // Google Drive file ID for 6.pdf
    googleDriveId: "1V1Chf-tZOQaQtG9hqVyjpeF7ySouTGG1",
    useGoogleDrive: true,
  },
  {
    filename: "7.pdf",
    title: {
      en: "Proof of the Prophethood of Muhammad",
      ar: "إثبات نبوة محمد صلى الله عليه وسلم",
    },
    description: {
      en: "Research on the Prophethood of Muhammad (PBUH)",
      ar: "بحث في نبوة محمد (صلى الله عليه وسلم)",
    },
    category: "Islamic Studies",
    author: "Islamic Research Council",
    publishDate: "2025",
    tags: ["prophethood", "muhammad", "research", "islam"],
    // Google Drive file ID for 7.pdf
    googleDriveId: "1KmJKaAAdaRGkhWTdpf0wX_Crc1i2cYEx",
    useGoogleDrive: true,
  },
  {
    filename: "8.pdf",
    title: {
      en: "Secularization of Nations",
      ar: "علمنة الشعوب",
    },
    description: {
      en: "A Study on the Secularization of Nations and Its Impact on the Islamic World",
      ar: "دراسة في علمنة الشعوب وتأثيرها على العالم الإسلامي",
    },
    category: "Cultural Studies",
    author: "عبدالنور الجزائري",
    publishDate: "2025",
    tags: ["secularization", "nations", "culture", "islam"],
    // Google Drive file ID for 8.pdf
    googleDriveId: "1Ho2af8h67f1VZYdcI_5b9_80mGzN9tad",
    useGoogleDrive: true,
  },
];

// Helper function to get PDF metadata by filename
export function getPDFMetadata(filename: string): PDFMetadata | undefined {
  return pdfMetadata.find((pdf) => pdf.filename.toLowerCase() === filename.toLowerCase());
}

// Helper function to get PDF title by locale
export function getPDFTitle(filename: string, locale: string): string {
  const metadata = getPDFMetadata(filename);
  if (!metadata) return filename.replace(/\.pdf$/i, "");

  const title = locale === "ar" ? metadata.title.ar : metadata.title.en;
  return title || metadata.title.en;
}

// Helper function to get PDF description by locale
export function getPDFDescription(
  filename: string,
  locale: string,
): string | undefined {
  const metadata = getPDFMetadata(filename);
  if (!metadata?.description) return undefined;

  const description =
    locale === "ar" ? metadata.description.ar : metadata.description.en;
  return description || metadata.description.en;
}

// Helper function to generate Google Drive preview URL
export function getGoogleDrivePreviewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

// Helper function to generate Google Drive direct view URL  
export function getGoogleDriveViewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/view`;
}

// Helper function to get PDF URL (Google Drive or local)
export function getPDFUrl(filename: string): string {
  const metadata = getPDFMetadata(filename);
  
  if (metadata?.useGoogleDrive && metadata.googleDriveId) {
    // Check if it's a placeholder ID
    if (metadata.googleDriveId.startsWith('YOUR_GOOGLE_DRIVE_FILE_ID')) {
      console.warn(`⚠️  Google Drive ID not configured for ${filename}. Using local file.`);
      return `/pdfs/${filename}`;
    }
    return getGoogleDrivePreviewUrl(metadata.googleDriveId);
  }
  
  // Fallback to local file
  return `/pdfs/${filename}`;
}

// Helper function to check if PDF should use Google Drive
export function shouldUseGoogleDrive(filename: string): boolean {
  const metadata = getPDFMetadata(filename);
  return Boolean(metadata?.useGoogleDrive === true && 
         metadata.googleDriveId && 
         !metadata.googleDriveId.startsWith('YOUR_GOOGLE_DRIVE_FILE_ID'));
}

// Helper function to get all configured Google Drive files
export function getGoogleDriveFiles(): PDFMetadata[] {
  return pdfMetadata.filter(pdf => shouldUseGoogleDrive(pdf.filename));
}

// Helper function to validate Google Drive configuration
export function validateGoogleDriveConfig(): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  pdfMetadata.forEach(pdf => {
    if (pdf.useGoogleDrive) {
      if (!pdf.googleDriveId) {
        issues.push(`${pdf.filename}: Missing Google Drive ID`);
      } else if (pdf.googleDriveId.startsWith('YOUR_GOOGLE_DRIVE_FILE_ID')) {
        issues.push(`${pdf.filename}: Placeholder Google Drive ID needs to be replaced`);
      }
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}
