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
        en: "Not Quranists: Instinct and Covenant",
        ar: "ليسوا قرآنيين: الفطرة والميثاق"
      },
      description: {
        en: "An exploration of the concept of instinct, the covenant, and the restricted meaning of worship in Islamic thought.",
        ar: "استكشاف مفهوم الفطرة والميثاق والمفهوم المقيد للعبادة في الفكر الإسلامي."
      },
      category: "Religious Studies",
      author: "Islamic Theology Department",
      publishDate: "2025",
      tags: ["fitrah", "covenant", "worship", "islam"]
    },
    {
      filename: "2.pdf",
      title: {
        en: "Tawhid Al-Uluhiyyah and Linguistic Weakness",
        ar: "توحيد الألوهية وضعف الملكة اللغوية"
      },
      description: {
        en: "A study on the doctrine of Tawhid Al-Uluhiyyah and the impact of linguistic weakness on denying what is not rightfully denied.",
        ar: "دراسة حول عقيدة توحيد الألوهية وأثر ضعف الملكة اللغوية في الإنكار على ما ليس حقه الإنكار."
      },
      category: "Theology",
      author: "Dr. Abdullah Al-Lughawi",
      publishDate: "2025",
      tags: ["tawhid", "linguistics", "denial", "aqeedah"]
    },
    {
      filename: "3.pdf",
      title: {
        en: "Proofs of Prophethood and Orientalist Narratives",
        ar: "دلائل النبوة ومعركة الزلاقة"
      },
      description: {
        en: "An analysis of the proofs of prophethood, addressing orientalist narratives and doubts, including the Battle of Zallaqa.",
        ar: "تحليل دلائل النبوة، مع الرد على الروايات المستشرقين والشبهات، بما في ذلك معركة الزلاقة."
      },
      category: "Islamic History",
      author: "Historical Studies Council",
      publishDate: "2025",
      tags: ["prophethood", "orientalism", "zallaqa", "history"]
    }
  ];
  
  // Helper function to get PDF metadata by filename
  export function getPDFMetadata(filename: string): PDFMetadata | undefined {
    return pdfMetadata.find(pdf => pdf.filename === filename);
  }
  
  // Helper function to get PDF title by locale
  export function getPDFTitle(filename: string, locale: string): string {
    const metadata = getPDFMetadata(filename);
    if (!metadata) return filename.replace('.pdf', '');
    
    const title = locale === 'ar' ? metadata.title.ar : metadata.title.en;
    return title || metadata.title.en;
  }
  
  // Helper function to get PDF description by locale
  export function getPDFDescription(filename: string, locale: string): string | undefined {
    const metadata = getPDFMetadata(filename);
    if (!metadata?.description) return undefined;
    
    const description = locale === 'ar' ? metadata.description.ar : metadata.description.en;
    return description || metadata.description.en;
  }