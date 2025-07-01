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
  },
];

// Helper function to get PDF metadata by filename
export function getPDFMetadata(filename: string): PDFMetadata | undefined {
  return pdfMetadata.find((pdf) => pdf.filename === filename);
}

// Helper function to get PDF title by locale
export function getPDFTitle(filename: string, locale: string): string {
  const metadata = getPDFMetadata(filename);
  if (!metadata) return filename.replace(".pdf", "");

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
