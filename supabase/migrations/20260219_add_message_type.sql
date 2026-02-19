-- Add type column to live_messages
ALTER TABLE public.live_messages 
ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'chat';

-- Update RLS if necessary (not needed as existing policies cover all rows)
