-- Ajoute les colonnes pour la planification des publications
ALTER TABLE library_items
ADD COLUMN IF NOT EXISTS published_at timestamp with time zone DEFAULT null,
ADD COLUMN IF NOT EXISTS publication_email_sent boolean DEFAULT false;

-- Index pour accélérer la recherche du Cron Job
CREATE INDEX IF NOT EXISTS idx_library_items_published_at_email
ON library_items(published_at, publication_email_sent);
