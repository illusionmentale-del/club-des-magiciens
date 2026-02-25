-- Create legal_pages table
CREATE TABLE IF NOT EXISTS public.legal_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view legal pages" 
    ON public.legal_pages FOR SELECT 
    USING (true);

CREATE POLICY "Admins can insert legal pages" 
    ON public.legal_pages FOR INSERT 
    WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can update legal pages" 
    ON public.legal_pages FOR UPDATE 
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can delete legal pages" 
    ON public.legal_pages FOR DELETE 
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_legal_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_legal_pages_updated_at
BEFORE UPDATE ON public.legal_pages
FOR EACH ROW
EXECUTE FUNCTION update_legal_pages_updated_at();

-- Insert default pages so they are ready to be edited in the admin
INSERT INTO public.legal_pages (slug, title, content) VALUES
('mentions-legales', 'Mentions Légales', '<h2>Mentions Légales</h2><p>Contenu à venir...</p>'),
('privacy', 'Politique de Confidentialité', '<h2>Politique de Confidentialité</h2><p>Contenu à venir...</p>'),
('terms', 'Conditions Générales d''Utilisation (CGU/CGV)', '<h2>Conditions Générales</h2><p>Contenu à venir...</p>'),
('cookies', 'Politique des Cookies', '<h2>Politique des Cookies</h2><p>Contenu à venir...</p>')
ON CONFLICT (slug) DO NOTHING;
