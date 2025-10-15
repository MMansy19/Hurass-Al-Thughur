-- Create PDFs table in Supabase
-- This table stores all PDF documents with multilingual support
-- Similar to articles table but for PDF management

CREATE TABLE IF NOT EXISTS public.pdfs (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- PDF identification
    filename TEXT NOT NULL UNIQUE,
    
    -- Multilingual content
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    
    -- Categorization and metadata
    category TEXT,
    author TEXT,
    publish_date DATE,
    tags TEXT[], -- Array of tags
    
    -- File information
    file_size_mb DECIMAL(10,2),
    page_count INTEGER,
    
    -- Google Drive configuration
    google_drive_id TEXT, -- Google Drive file ID for PDF viewing
    cover_image_id TEXT, -- Google Drive file ID for cover image
    
    -- Magazine/Library categorization
    is_issue BOOLEAN DEFAULT FALSE NOT NULL, -- TRUE for magazine issues, FALSE for library PDFs
    issue_number INTEGER, -- For magazine issues only
    
    -- Content management
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- SEO and visibility
    meta_description_ar TEXT,
    meta_description_en TEXT,
    slug_ar TEXT,
    slug_en TEXT
    
    -- Analytics (removed - not needed for this implementation)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pdfs_is_issue ON public.pdfs(is_issue);
CREATE INDEX IF NOT EXISTS idx_pdfs_is_published ON public.pdfs(is_published);
CREATE INDEX IF NOT EXISTS idx_pdfs_category ON public.pdfs(category);
CREATE INDEX IF NOT EXISTS idx_pdfs_issue_number ON public.pdfs(issue_number) WHERE is_issue = TRUE;
CREATE INDEX IF NOT EXISTS idx_pdfs_created_at ON public.pdfs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pdfs_filename ON public.pdfs(filename);
CREATE INDEX IF NOT EXISTS idx_pdfs_tags ON public.pdfs USING GIN(tags);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_pdfs_updated_at 
    BEFORE UPDATE ON public.pdfs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.pdfs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "PDFs are viewable by everyone" 
    ON public.pdfs FOR SELECT 
    USING (is_published = TRUE);

-- Create policies for authenticated users (admin access)
-- You can modify these based on your admin user setup
CREATE POLICY "Authenticated users can insert PDFs" 
    ON public.pdfs FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update PDFs" 
    ON public.pdfs FOR UPDATE 
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete PDFs" 
    ON public.pdfs FOR DELETE 
    USING (auth.role() = 'authenticated');

-- Insert sample data from your existing pdf-metadata.ts
INSERT INTO public.pdfs (
    filename, title_ar, title_en, description_ar, description_en, 
    category, author, publish_date, tags, google_drive_id, cover_image_id,
    file_size_mb, page_count, meta_description_ar, meta_description_en,
    is_issue, issue_number, is_published
) VALUES 
('1.pdf', 'العدد الأول', 'The First Issue', 
 'ليسوا قرآنيين: الفطرة والميثاق', 'Not Quraniyyun: Fitrah and Covenant',
 'دراسات دينية', 'Islamic Theology Department', '2025-01-01', 
 ARRAY['فطرة', 'ميثاق', 'عبادة', 'إسلام'], '1UMurarFB8eXjj02YPHmlL_MQXq_8_7pi', '165qhoNO3jaAv1phnp9JuMbJ8XCjFLs8K',
 11.4, 32, 'ليسوا قرآنيين: الفطرة والميثاق', 'Not Quraniyyun: Fitrah and Covenant',
 TRUE, 1, TRUE),

('2.pdf', 'العدد الثاني', 'The Second Issue',
 'توحيد الألوهية وضعف الملكة اللغوية', 'Tawhid Al-Uluhiyyah and Linguistic Weakness',
 'علم الكلام', 'Dr. Abdullah Al-Lughawi', '2025-01-01',
 ARRAY['توحيد', 'لسانيات', 'إنكار', 'عقيدة'], '1JODOLrX6CxxW00jqq0L2yOMb5RLU6oUa', '10K6J55tR2fLw903D6l5BkwhT4iRbCe32',
 11.3, 40, 'توحيد الألوهية وضعف الملكة اللغوية', 'Tawhid Al-Uluhiyyah and Linguistic Weakness',
 TRUE, 2, TRUE),

('3.pdf', 'العدد الثالث', 'The Third Issue',
 'دلائل النبوة ومعركة الزلاقة', 'Proofs of Prophethood and Orientalist Narratives',
 'تاريخ إسلامي', 'Historical Studies Council', '2025-01-01',
 ARRAY['نبوة', 'استشراق', 'زلاقة', 'تاريخ'], '11fOWS30NTx5AnzGRBMjOePsoskNd76yy', '18UvCcwJfE8lShKMYrDhTunQhLc6lWQ5s',
 49.5, 36, 'دلائل النبوة ومعركة الزلاقة', 'Proofs of Prophethood and Orientalist Narratives',
 TRUE, 3, TRUE),

('4.pdf', 'العدد الرابع', 'The Fourth Issue',
 'الإلحاد الروحي. أدلة النبوة. ثورة العشرين', 'Spiritual Atheism. Proofs of Prophethood. The Twenty Revolution',
 'دراسات إسلامية', 'Islamic Research Council', '2025-01-01',
 ARRAY['إلحاد', 'نبوة', 'ثورة', 'روحانية'], '1remp7L3mJJhHqlCg-o3lOeprR8yvf3Jx', '11SIlfpzELfa1Yy-ObvbGxnKtNgY5FTU8',
 32.6, 28, 'الإلحاد الروحي. أدلة النبوة. ثورة العشرين', 'Spiritual Atheism. Proofs of Prophethood. The Twenty Revolution',
 TRUE, 4, TRUE),

('5.pdf', 'العدد الخامس', 'The Fifth Issue',
 'الخريطة إلى الطريق. ما هي الفطرة', 'The Map to the Path. What is Fitrah',
 'دراسات دينية', 'Fitrah Studies Department', '2025-01-01',
 ARRAY['فطرة', 'هداية', 'طريق', 'طبيعة'], '1JunB2K2-P9WMzvJ0Ik_v4g8IPvwW4hzR', '1xxJQB-AsDblzQTWUVRwAU5NVxW-EWbND',
 32.5, 24, 'الخريطة إلى الطريق. ما هي الفطرة', 'The Map to the Path. What is Fitrah',
 TRUE, 5, TRUE),

('6.pdf', 'العدد السادس', 'The Sixth Issue',
 'أمريكا الجنوبية ثقافة دينًا لكيفية الدعوة', 'South America Culture Religion on How to Call',
 'دراسات ثقافية', 'ابن عبدالصبور', '2025-01-01',
 ARRAY['أمريكا-الجنوبية', 'ثقافة', 'دين', 'دعوة'], '1V1Chf-tZOQaQtG9hqVyjpeF7ySouTGG1', '1Shq5I80oHvd-JfRQCqoLDSTSiz7byJUo',
 0.5, 30, 'أمريكا الجنوبية ثقافة دينًا لكيفية الدعوة', 'South America Culture Religion on How to Call',
 TRUE, 6, TRUE),

('7.pdf', 'إثبات نبوة محمد صلى الله عليه وسلم', 'Proof of the Prophethood of Muhammad',
 'بحث في نبوة محمد (صلى الله عليه وسلم)', 'Research on the Prophethood of Muhammad (PBUH)',
 'دراسات إسلامية', 'Islamic Research Council', '2025-01-01',
 ARRAY['نبوة', 'محمد', 'بحث', 'إسلام'], '1KmJKaAAdaRGkhWTdpf0wX_Crc1i2cYEx', '1nVPuv7r2UJTfgohlfDb5Q7Ok4j4pE5YV',
 1.28, 30, 'بحث في نبوة محمد (صلى الله عليه وسلم)', 'Research on the Prophethood of Muhammad (PBUH)',
 FALSE, NULL, TRUE),

('8.pdf', 'علمنة الشعوب', 'Secularization of Nations',
 'دراسة في علمنة الشعوب وتأثيرها على الإسلام', 'A Study on the Secularization of Nations and Its Impact on the Islamic World',
 'دراسات ثقافية', 'عبدالنور الجزائري', '2025-01-01',
 ARRAY['علمنة', 'شعوب', 'ثقافة', 'إسلام'], '1Ho2af8h67f1VZYdcI_5b9_80mGzN9tad', '1BfQQbo0EWj6oAhPD8aDxTQyWD3_mpS4v',
 0.61, 34, 'دراسة في علمنة الشعوب وتأثيرها على الإسلام', 'A Study on the Secularization of Nations and Its Impact on the Islamic World',
 FALSE, NULL, TRUE),

('9.pdf', 'حملات المناصرة', 'Advocacy Campaigns',
 'لعلك سألت نفسك من قبل كيف يمكنني إحداث إصلاح في أمتنا ؟ و لعلك أيضا بنيت أحلامًا وهمية و آمالًا عالية في الإصلاح فأصطدمت مع الواقع', 'Perhaps you have asked yourself before, how can I bring about reform in our nation? And perhaps you have also built illusory dreams and high hopes for reform, only to collide with reality.',
 'إصلاح وتغيير', 'عمر', '2025-01-01',
 ARRAY['مناصرة', 'إصلاح', 'تغيير', 'إصلاح-إسلامي', 'بناء-مجتمع'], '1C-2M7bq2aitxE6LdY54I34LpPOi4BXiY', '1iZzhdNagJleRNvv5T4hd8Wb_V1Xq6HzZ',
 2.1, 19, 'لعلك سألت نفسك من قبل كيف يمكنني إحداث إصلاح في أمتنا ؟ و لعلك أيضا بنيت أحلامًا وهمية و آمالًا عالية في الإصلاح فأصطدمت مع الواقع', 'Perhaps you have asked yourself before, how can I bring about reform in our nation? And perhaps you have also built illusory dreams and high hopes for reform, only to collide with reality.',
 FALSE, NULL, TRUE),

('10.pdf', 'ومبشرا برسول يأتي من بعدي اسمه احمد', 'And giving glad tidings of a Messenger to come after me, whose name shall be Ahmad',
 'في هذا البحث، نقوم بعرض اسم الرسول ﷺ «أحمد» في نصِّ إشعياء (42:1) بطريقةٍ محكمةٍ ومختصرة', 'In this research, we present the Prophet''s ﷺ name ''Ahmad'' in the text of Isaiah (42:1) in a precise and concise manner',
 'دراسات كتابية', 'عيسى بن محمد', '2025-01-01',
 ARRAY['أحمد', 'نبي', 'إشعياء', 'دراسات-كتابية', 'نبوة'], '1W_TxYtyBiL07DPFG1u2wN3c3RRrJHZbH', '1-hGLMiQoAA7OqOppFPseauV8wSnFg531',
 7.9, 22, 'في هذا البحث، نقوم بعرض اسم الرسول ﷺ «أحمد» في نصِّ إشعياء (42:1) بطريقةٍ محكمةٍ ومختصرة', 'In this research, we present the Prophet''s ﷺ name ''Ahmad'' in the text of Isaiah (42:1) in a precise and concise manner',
 FALSE, NULL, TRUE);

-- Create a view for magazine issues only
CREATE OR REPLACE VIEW public.magazine_issues AS
SELECT 
    id, filename, title_ar, title_en, description_ar, description_en,
    category, author, publish_date, tags, google_drive_id, cover_image_id,
    file_size_mb, page_count, meta_description_ar, meta_description_en,
    issue_number, created_at, updated_at
FROM public.pdfs 
WHERE is_issue = TRUE AND is_published = TRUE
ORDER BY issue_number ASC;

-- Create a view for library PDFs only
CREATE OR REPLACE VIEW public.library_pdfs AS
SELECT 
    id, filename, title_ar, title_en, description_ar, description_en,
    category, author, publish_date, tags, google_drive_id, cover_image_id,
    file_size_mb, page_count, meta_description_ar, meta_description_en,
    created_at, updated_at
FROM public.pdfs 
WHERE is_issue = FALSE AND is_published = TRUE
ORDER BY created_at DESC;

-- Analytics functions removed - not needed for this implementation

-- Function to get magazine issue by issue number
-- Drop existing function first to avoid return type conflicts
DROP FUNCTION IF EXISTS get_magazine_issue(INTEGER);

CREATE OR REPLACE FUNCTION get_magazine_issue(issue_num INTEGER)
RETURNS TABLE (
    id BIGINT,
    filename TEXT,
    title_ar TEXT,
    title_en TEXT,
    description_ar TEXT,
    description_en TEXT,
    category TEXT,
    author TEXT,
    publish_date DATE,
    tags TEXT[],
    google_drive_id TEXT,
    cover_image_id TEXT,
    file_size_mb DECIMAL(10,2),
    page_count INTEGER,
    meta_description_ar TEXT,
    meta_description_en TEXT,
    issue_number INTEGER,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id, p.filename, p.title_ar, p.title_en, p.description_ar, p.description_en,
        p.category, p.author, p.publish_date, p.tags, p.google_drive_id, 
        p.cover_image_id, p.file_size_mb, p.page_count, p.meta_description_ar, p.meta_description_en,
        p.issue_number, p.created_at
    FROM public.pdfs p
    WHERE p.is_issue = TRUE AND p.is_published = TRUE AND p.issue_number = issue_num;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE public.pdfs IS 'Stores all PDF documents with multilingual support and categorization for magazine issues and library content';
COMMENT ON COLUMN public.pdfs.is_issue IS 'TRUE for magazine issues that appear in /magazine, FALSE for library PDFs that appear in /library';
COMMENT ON COLUMN public.pdfs.issue_number IS 'Sequential number for magazine issues, NULL for library PDFs';
COMMENT ON COLUMN public.pdfs.cover_image_id IS 'Google Drive file ID for cover image used for SEO and thumbnails';
COMMENT ON COLUMN public.pdfs.google_drive_id IS 'Google Drive file ID for PDF viewing and downloading';